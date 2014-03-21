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
  
  // BIG SELECTOR
  // should be more focused - 
  // tilde
  // attribute selector
  // :hover
  // :focus
  // ::after
  // + sibling
  // .class
  
  it('should normalize BIG SELECTOR', function () {
    var selector = "*~*>*.foo[   href *=  \"/\"   ]:hover>*[  data-foo =   \"bar\"      ]:focus+*.baz::after";
    var expected = "* ~ * > *.foo[href*=\"/\"]:hover > *[data-foo=\"bar\"]:focus + *.baz::after";
    assert.equal(normalizeSelector(selector), expected);
  });
    
  it('should return optimized selector with no change', function () {
    assert.equal(normalizeSelector("#foo .bar"), "#foo .bar");
  });
  
  it('should trim whitespace', function () {
    assert.equal(normalizeSelector(" #foo   .bar "), "#foo .bar");
  });
  
  it('should separate between combinators', function () {
    assert.equal(normalizeSelector("#foo>.bar+.baz"), "#foo > .bar + .baz");
  });
  
  it('should not separate concatenated classes', function () {
    assert.equal(normalizeSelector("#foo.bar.baz"), "#foo.bar.baz");
  });
  
  it('should remove comments', function () {
    assert.equal(normalizeSelector(".e1 /* c2 */ .e2"), ".e1 .e2");
  });    
  
  // describe('CSS at-rules', function () {
  
  // });
  
  // describe('Descriptors', function () {
  
  // });
  
  // describe('Simple selectors', function () {
  
  // });
  
  // describe('Attribute selectors', function () {
  
  // });
  
  // describe('Combinators', function () {
  
  // });
  
  // describe('Pseudo-classes', function () {
  
  // });
  
  // describe('Pseudo-elements', function () {
  
  // });
  
  // describe('comments', function () {
    // var expected = ".e1 .e2 .e3";
    
    //remove leading comment
    
    // it('should remove comments and whitespace', function () {
      // assert.equal(normalizeSelector(" /*c1*/ .e1/*c2*/.e2 /*c3*/ .e3 /*c4*/ "), expected);
    // });
    
    //remove or replace with ws?
    // it('should remove comments', function () {
      // assert.equal(normalizeSelector("/*c1*/.e1/*c2*/.e2/*c3*/.e3"), expected);
    // });
    
    // it('remove trailing whitespace', function () {
      // assert.equal(normalizeSelector(" /*c1*/ .e1/*c2*/.e2 /*c3*/ .e3   "), expected);
    // });
    
    // it('remove leading whitespace', function () {
      // assert.equal(normalizeSelector(" /*c1*/ .e1/*c2*/.e2 /*c3*/ .e3"), expected);
    // });
        
    // it('remove inner comments', function () {
      // assert.equal(normalizeSelector(".e1/*c2*/.e2 /*c3*/ .e3"), expected);
    // });
  // });
});
