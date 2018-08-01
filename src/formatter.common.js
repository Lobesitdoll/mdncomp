/*
  Formatter Common module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

"use strict";

const utils = loadModule("core.utils");
const mdn = utils.loadMDN();

/**
 * This will flatten and normalize the __compat + support + status objects.
 * @param {string} path
 * @param {boolean} [isRecursive=false] - used when analysing sub-objects, children on the primary __compat object
 * @returns {{path: string, prePath: string, name: string, description: string, url: string|null, specs: Array, experimental: boolean, standard: boolean, deprecated: boolean, browsers: {desktop: Array, mobile: Array, ext: Array}, notes: Array, links: Array, children: Array, sab: *, workers: *}}
 */
function format(path, isRecursive) {

  if (!utils.isCompat(mdn, path)) {
    console.error(`Error: path "${path}" not a "__compat" object.`);
    process.exit();
  }

  const rxAhref = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/;
  const browserList = utils.getBrowserList();
  const pathObj = utils.getPathAsObject(mdn, path);
  const compat = pathObj.__compat;
  const support = compat.support;
  const status = compat.status;
  const url = compat.mdn_url && compat.mdn_url.length ? ("https://developer.mozilla.org/docs/" + compat.mdn_url).replace(".org/docs/Mozilla/Add-ons/", ".org/Add-ons/") : null;
  const specs = options.specs ? compat.specs || [] : [];

  const result = {
    path        : path,
    prePath     : utils.prePathFromPath(mdn, path),
    name        : utils.nameFromPath(path),
    description : compat.description || "",
    short       : (compat.short || "").replace("→", "-&gt;"),
    url         : url,
    specs       : specs,
    experimental: status.experimental,
    standard    : status.standard_track,
    deprecated  : status.deprecated,
    browsers    : { desktop: [], mobile: [], ext: [] },
    notes       : [],
    links       : [],
    children    : [],
    sab         : pathObj.SharedArrayBuffer_as_param && !isRecursive ? format(path + ".SharedArrayBuffer_as_param", true) : null,
    workers     : pathObj.worker_support && !isRecursive ? format(path + ".worker_support", true) : null
  };

  // extract browser information (forces a slot to contain value or undefined)
  if (options.desktop) browserList.desktop.forEach(key => {
    result.browsers.desktop.push( mergeSupport(key, support) )
  });

  if (options.mobile) browserList.mobile.forEach(key => {
    result.browsers.mobile.push( mergeSupport(key, support) )
  });

  if (options.ext) browserList.ext.forEach(key => {
    result.browsers.ext.push( mergeSupport(key, support) )
  });

  // get children
  if (options.children && !isRecursive) {
//    const _history = options.history;
//    const _notes = options.notes;
    const _tmp = Object.assign({}, options);
    options.history = false;
    options.notes = false;
    Object.keys(pathObj).forEach(child => {
      if (pathObj[child].__compat) {
        result.children.push(format(path + "." + child, true))
      }
    });
    Object.assign(options, _tmp)
//    options.history = _history;
//    options.notes = _notes;
  }

  function mergeSupport(key, support) {
    const history = [];
    const noteIndices = [];

    support = support[key] || {};

    // Support entries for this specific browser
    let entries = Array.isArray(support) ? support : [support];
    if (!options.history) entries = [entries[0]];

    entries.forEach(entry => {
      const localNotesIndices = [];

      // all notes for this entry
      if (options.notes && (entry.notes || entry.prefix || entry.alternative_name || entry.partial_implementation)) {
        const notes = Array.isArray(entry.notes) ? entry.notes : (entry.notes ? [ entry.notes ] : []);

        if (entry.prefix) {
          notes.push(
            "Vendor prefix: " + entry.prefix
          )
        }

        if (entry.alternative_name) {
          notes.push(
            "Version " + utils.ansiFree(utils.versionAddRem(entry.version_added, entry.version_removed)) + " uses alternative name: " + entry.alternative_name
          )
        }

        if (entry.partial_implementation) {
          notes.push("Partial implementation.")
        }

        notes.forEach(note => {
          let index = getNoteIndex(note);
          if (index < 0) {
            index = result.notes.length;
            result.notes.push({index, note});

            // extract any links
            let link = note.match(rxAhref);
            if (link) result.links.push({index: index, url: link[link.length - 1]});
          }
          noteIndices.push(index);
          localNotesIndices.push(index)
        });
      }

      if (options.history || (!options.history && !history.length)) {
        history.push({
          add    : entry.version_added,
          removed: entry.version_removed || (entry.version_added === null ? null : false),
          prefix : entry.prefix || null,
          altName: entry.alternative_name || null,
          flags  : entry.flags || [],
          partial: entry.partial_implementation || false,
          notes  : localNotesIndices
        })
      }
    });

    return {browser: key, history, noteIndex: noteIndices.sort()}
  }

  function getNoteIndex(note) {
    for(let i = 0; i < result.notes.length; i++) {
      if (result.notes[i].note === note) return result.notes[i].index
    }
    return -1
  }

  return result
}

module.exports = format;