// mocha/suite.js for normalize-selector.js

var normalizeSelector;
var assert;

if (typeof require == 'function') {
  // enable to re-use in a browser without require.js
  normalizeSelector = require('../../index.js');
  assert = require('assert');
}

describe('smoke test', function() {
  it('should pass', function () {
    assert.equal(normalizeSelector(), 'normalizeSelector', 'failure message');
  });
});

