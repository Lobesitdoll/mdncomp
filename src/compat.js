/**
 * This is a normalizing function which takes the official
 * MDN __compat object and converts it to a fixed form.
 * This allow changes to the MDN version (which they warn
 * may happen, f.ex. https://github.com/mdn/browser-compat-data/issues/114)
 * in the future and only this function to be updated if needed.
 *
 * @param path
 * @returns {MDNComp}
 */
function convertCompat(path) {
  return new MDNComp(path);
}

