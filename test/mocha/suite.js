// mocha/suite.js for normalize-selector.js

var normalizeSelector;
var assert;

if (typeof require == 'function') {
  // enable to re-use in a browser without require.js
  normalizeSelector = require('../../index.js');
  assert = require('assert');
}

describe('normalizeSelector', function() {

  it('should be function', function () {
    assert.equal(typeof normalizeSelector, 'function', 'wrong type');
  });

  describe('base cases', function () {
  
    it('should return optimized selector', function () {
      assert.equal(normalizeSelector("#foo .bar"), "#foo .bar");
    });
    
    it('should trim whitespace', function () {
      assert.equal(normalizeSelector(" #foo   .bar "), "#foo .bar");
    });
    
    it('should pad child selector', function () {
      assert.equal(normalizeSelector("#foo>.bar"), "#foo > .bar");
    });
  });
  
  describe('CSS at-rules', function () {
  
  });
  
  describe('Descriptors', function () {
  
  });
  
  describe('Simple selectors', function () {
  
  });
  
  describe('Attribute selectors', function () {
  
  });
  
  describe('Combinators', function () {
  
  });
  
  describe('Pseudo-classes', function () {
  
  });
  
  describe('Pseudo-elements', function () {
  
  });
  
  // should be more focused - 
  // tilde
  // attribute selector
  // :hover
  // :focus
  // ::after
  // + sibling
  // .class
  
  it('*~*>*.foo href attr, :hover data attr, : focus :: after', function () {
    var selector = "*~*>*.foo[   href *=  \"/\"   ]:hover>*[  data-foo =   \"bar\"      ]:focus+*.baz::after";
    var expected = "* ~ * > *.foo[href*=\"/\"]:hover > *[data-foo=\"bar\"]:focus + *.baz::after";
    assert.equal(normalizeSelector(selector), expected);
  });

  describe('comments', function () {
    var expected = ".e1 .e2 .e3";
    
    // remove leading comment
    
    it('remove trailing comment', function () {
      assert.equal(normalizeSelector(" /*c1*/ .e1/*c2*/.e2 /*c3*/ .e3 /*c4*/ "), expected);
    });
    
    it('remove trailing whitespace', function () {
      assert.equal(normalizeSelector(" /*c1*/ .e1/*c2*/.e2 /*c3*/ .e3   "), expected);
    });
    
    it('remove leading whitespace', function () {
      assert.equal(normalizeSelector(" /*c1*/ .e1/*c2*/.e2 /*c3*/ .e3"), expected);
    });
    
    it('remove inner whitespace', function () {
      assert.equal(normalizeSelector("/*c1*/.e1/*c2*/.e2 /*c3*/ .e3"), expected);
    });
    
    it('remove inner comments', function () {
      assert.equal(normalizeSelector(".e1/*c2*/.e2 /*c3*/ .e3"), expected);
    });
  });
});
