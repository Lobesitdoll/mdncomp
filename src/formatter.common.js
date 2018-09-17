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
 * @param {boolean} [recursive=false] - used when analysing sub-objects, children on the primary __compat object
 * @param subNotes
 * @param subLinks
 * @returns {*}
 */
function format(path, recursive = false, subNotes, subLinks) {
  const pathObj = utils.getPathAsObject(mdn, path);

  if ( !pathObj.__compat && !utils.hasChildren(pathObj) ) {
    err(utils.breakAnsiLine(`?y${text.notFeatureObject}?R`, options.maxChars));
    process.exitCode = 1;
    return null;
  }

  const browsers = utils.getBrowserList();

  // validate custom columns
  if ( options.columns ) {
    const array = options.columns.split(/[ ,;:]/g);
    const ids = Object.keys(utils.getBrowserNames());
    const columns = array.filter(item => ids.includes(item));
    if ( !columns.length || columns.length !== array.length ) {
      if ( !recursive ) {
        err(`\n?y${text.invalidColumnIds}?R`);
        process.exitCode = 1;
        return null;
      }
    }
    else {
      browsers.desktop = browsers.desktop.filter(item => columns.includes(item));
      browsers.mobile = browsers.mobile.filter(item => columns.includes(item));
      browsers.ext = browsers.ext.filter(item => columns.includes(item));
      options.ext = browsers.ext.length > 0;
    }
  }

  const rxAhref = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/gi;
  const compat = pathObj.__compat || {};
  const support = compat.support || {};
  const status = compat.status || {};
  const isWebExt = path.startsWith("webextensions");
  const showNode = path.startsWith("javascript");

  const url = compat.mdn_url && compat.mdn_url.length
              ? ("https://developer.mozilla.org/docs/" + compat.mdn_url).replace(".org/docs/Mozilla/Add-ons/", ".org/Add-ons/")
              : null;

  let title = compat.title ? compat.title.replace("→", char.arrowRight) : null;

  const result = {
    isCompat    : typeof pathObj.__compat === "object",
    path        : path,
    prePath     : utils.prePathFromPath(mdn, path),
    name        : utils.nameFromPath(path),
    title       : title,
    mdntitle    : compat.mdn_title,
    description : compat.description, // summary description, BCD.description is here .title (via data-service)
    url         : url,
    specs       : compat.specs || compat.spec_urls || [],
    experimental: status.experimental,
    standard    : status.standard_track || (recursive && isWebExt),
    deprecated  : status.deprecated,
    browsers    : { desktop: [], mobile: [], ext: [] },
    notes       : [],
    links       : [],
    children    : [],
    isFiltered  : false
  };

  // extract browser information (forces a slot to contain value or undefined)
  if ( options.desktop && browsers.desktop.length ) {
    browsers.desktop.forEach(key => {
      result.browsers.desktop.push(mergeSupport(key, support));
    });
  }

  if ( options.mobile && browsers.mobile.length ) {
    browsers.mobile.forEach(key => {
      result.browsers.mobile.push(mergeSupport(key, support));
    });
  }

  if ( options.ext && browsers.ext.length ) {
    browsers.ext.filter(key => (showNode || key !== "nodejs") && (isWebExt || key !== "thunderbird"))
      .forEach(key => {
        result.browsers.ext.push(mergeSupport(key, support));
      });
  }

  // get children
  if ( options.children && !recursive ) {
    const filters = options.args.length
                    ? options.args.map(flt => utils.getComparer(flt, !(flt.includes("*") || flt.startsWith("/")), true))
                    : null;

    result.isFiltered = !!filters;

    const _history = options.history;
    options.history = false;

    Object
      .keys(pathObj)
      .forEach(child => {
        const compat = pathObj[ child ].__compat;
        if ( compat ) {
          const status = compat.status || {};
          if ( options.obsolete || isWebExt || ((status.experimental || status.standard_track || status.deprecated) && !status.deprecated) ) {
            const childPath = path + "." + child;
            if ( !filters || utils.testFilters(filters, child) ) {
              result.children.push(format(childPath, true, result.notes, result.links));
            }
          }
        }
      });

    options.history = _history;
  }

  function mergeSupport(key, supportObj) {
    const history = [];
    const noteIndices = [];
    const support = supportObj[ key ] || {};

    // Support entries for this specific browser
    let entries = Array.isArray(support) ? support : [ support ];
    if ( !options.history ) entries = [ entries[ 0 ] ];

    const _notes = (subNotes || result.notes);
    const _links = (subLinks || result.links);

    entries.forEach(entry => {
      const localNotesIndices = [];

      // all notes for this entry
      if ( options.notes && (entry.notes || entry.prefix || entry.alternative_name || entry.partial_implementation) ) {
        const notes = Array.isArray(entry.notes) ? entry.notes : (entry.notes ? [ entry.notes ] : []);

        if ( entry.prefix ) {
          notes.push(text.vendorPrefix + ": " + entry.prefix);
        }

        if ( entry.alternative_name ) {
          let version = utils.ansiFree(utils.versionAddRem(entry.version_added, entry.version_removed));
          version = (version === char.yes) ? "" : version + " ";
          notes.push(
            `${text.versionColumn} ${version}${text.usesAltName}: ?w${entry.alternative_name}?R`
          );
        }

        if ( entry.partial_implementation ) {
          notes.push(text.partialImpl);
        }

        notes.forEach(note => {
          let index = getNoteIndex(note, _notes);
          if ( index < 0 ) {
            index = _notes.length;
            _notes.push({ index, note });

            // extract links
            note.replace(rxAhref, (a, b, url) => {
              _links.push({ index, url });
            });
          }

          if ( !noteIndices.includes(index) ) noteIndices.push(index);
          if ( !localNotesIndices.includes(index) ) localNotesIndices.push(index);
        });
      }

      if ( options.history || (!options.history && !history.length) ) {
        history.push(Object.assign(entry, {
          version_removed: entry.version_removed || (entry.version_added === null ? null : false),
          flags          : entry.flags || [],
          notes          : localNotesIndices
        }));
      }
    });

    return { browser: key, history, noteIndex: noteIndices.sort() };
  }

  function getNoteIndex(note, notes) {
    for(let i = 0; i < notes.length; i++) {
      if ( notes[ i ].note === note ) return notes[ i ].index;
    }
    return -1;
  }

  function renumLinks() {
    let i = -1, last = -1;
    result.links.forEach(link => {
      if ( link.index !== last ) {
        last = link.index;
        i++;
      }
      link.linkIndex = i;
    });
  }

  renumLinks();

  result.children.sort((a, b) => {
    const aName = a.title || a.name;
    const bName = b.title || b.name;
    return aName > bName ? 1 : (aName < bName ? -1 : 0)
  });

  return result;
}

module.exports = format;