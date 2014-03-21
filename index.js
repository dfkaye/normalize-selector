// boilerplate for normalizeSelector
;(function () {

  // node.js
  if (typeof module != "undefined") {
    module.exports = normalizeSelector;
  }
  
  // browser
  if (typeof window != "undefined") {
    !window.normalizeSelector && (window.normalizeSelector = normalizeSelector);
  }

  function normalizeSelector() {
    return 'normalizeSelector';
  }
}());