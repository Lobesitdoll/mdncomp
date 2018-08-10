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
 * @param subNotes
 * @param subLinks
 * @returns {*}
 */
function format(path, isRecursive = false, subNotes, subLinks) {

  const pathObj = utils.getPathAsObject(mdn, path);

  if (!pathObj.__compat && !utils.hasChildren(pathObj)) {
    err(utils.breakAnsiLine(`?y${text.notFeatureObject}?R`, options.maxChars));
    process.exit();
  }

  const rxAhref = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/;
  const browserList = utils.getBrowserList();
  const compat = pathObj.__compat || {};
  const support = compat.support || {};
  const status = compat.status || {};
  const url = compat.mdn_url && compat.mdn_url.length ? ("https://developer.mozilla.org/docs/" + compat.mdn_url).replace(".org/docs/Mozilla/Add-ons/", ".org/Add-ons/") : null;
  const specs = compat.specs || [];
  const sab = pathObj.SharedArrayBuffer_as_param && options.sab && !isRecursive ? format(path + ".SharedArrayBuffer_as_param", true) : null;
  const workers = pathObj.worker_support && options.worker && !isRecursive ? format(path + ".worker_support", true) : null;
  const isWebExt = path.startsWith("webextensions");
  const showNode = path.startsWith("javascript");

  const result = {
    isCompat    : typeof pathObj.__compat === "object",
    path        : path,
    prePath     : utils.prePathFromPath(mdn, path),
    name        : utils.nameFromPath(path),
    description : compat.description || "",
    short       : (compat.short || "").replace("→", "-&gt;"),
    url         : url,
    specs       : specs,
    experimental: status.experimental,
    standard    : status.standard_track || (isRecursive && isWebExt),
    deprecated  : status.deprecated,
    browsers    : { desktop: [], mobile: [], ext: [] },
    notes       : [],
    links       : [],
    children    : [],
    sab         : sab,
    workers     : workers,
    isFiltered  : false
  };

  // extract browser information (forces a slot to contain value or undefined)
  if (options.desktop) browserList.desktop.forEach(key => {
    result.browsers.desktop.push( mergeSupport(key, support) )
  });

  if (options.mobile) browserList.mobile.forEach(key => {
    result.browsers.mobile.push( mergeSupport(key, support) )
  });

  if (options.ext) browserList.ext.filter(key => showNode ? true : key !== "nodejs").forEach(key => {
    result.browsers.ext.push( mergeSupport(key, support) );
  });

  // get children
  if (options.children && !isRecursive) {
    const filters = options.args.length
                    ? options.args.map(flt => utils.getComparer(flt, !(flt.includes("*") || flt.startsWith("/")), true))
                    : null;

    result.isFiltered = !!filters;

    const _history = options.history;
    options.history = false;

    Object.keys(pathObj).forEach(child => {
      const compat = pathObj[child].__compat;
      if (compat) {
        const status = compat.status || {};
        if (options.obsolete || isWebExt || ((status.experimental || status.standard_track || status.deprecated) && !status.deprecated)) {
          const childPath = path + "." + child;
          if (!filters || testFilter(child, filters)) {
            result.children.push(format(childPath, true, result.notes, result.links))
          }
        }
      }
    });

    options.history = _history;
  }

  function testFilter(key, filters) {
    for(let f of filters) if (f.test(key)) return true;
  }

  function mergeSupport(key, support) {
    const history = [];
    const noteIndices = [];

    support = support[key] || {};

    // Support entries for this specific browser
    let entries = Array.isArray(support) ? support : [support];
    if (!options.history) entries = [entries[0]];

    const _notes = (subNotes || result.notes);
    const _links = (subLinks || result.links);

    entries.forEach(entry => {
      const localNotesIndices = [];

      // all notes for this entry
      if (options.notes && (entry.notes || entry.prefix || entry.alternative_name || entry.partial_implementation)) {
        const notes = Array.isArray(entry.notes) ? entry.notes : (entry.notes ? [ entry.notes ] : []);

        if (entry.prefix) {
          notes.push(text.vendorPrefix + entry.prefix)
        }

        if (entry.alternative_name) {
          notes.push(
            text.versionColumn + utils.ansiFree(utils.versionAddRem(entry.version_added, entry.version_removed)) + text.usesAltName + entry.alternative_name
          )
        }

        if (entry.partial_implementation) {
          notes.push(text.partialImpl)
        }

        notes.forEach(note => {
          let index = getNoteIndex(note, _notes);
          if (index < 0) {
            index = _notes.length;
            _notes.push({index, note});

            // extract any links
            let link = note.match(rxAhref);
            if (link) _links.push({index: index, url: link[link.length - 1]});
          }
          noteIndices.push(index);
          localNotesIndices.push(index)
        });
      }

      if (options.history || (!options.history && !history.length)) {
        history.push({
          add    : entry.version_added,
          removed: entry.version_removed || (entry.version_added === null ? null : false),
          prefix : entry.prefix,
          altName: entry.alternative_name,
          flags  : entry.flags || [],
          partial: entry.partial_implementation,
          notes  : localNotesIndices
        })
      }
    });

    return {browser: key, history, noteIndex: noteIndices.sort()}
  }

  function getNoteIndex(note, notes) {
    for(let i = 0; i < notes.length; i++) {
      if (notes[i].note === note) return notes[i].index
    }
    return -1
  }

  return result
}

module.exports = format;