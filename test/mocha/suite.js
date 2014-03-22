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
  console.log(normalizeSelector);
    assert.equal(typeof normalizeSelector, 'function', 'wrong type');
  });

  it('should normalize BIG SELECTOR', function () {
    var selector = "*~*>*.foo[   href *=  \"/\"   ]:hover>*[  data-foo =   " +
                   "\"bar\"      ]:focus+*.baz::after";
    var expected = "* ~ * > *.foo[href*=\"/\"]:hover > *[data-foo=\"bar\"]:" +
                   "focus + *.baz::after";
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

  it('should normalize asterisks', function () {
    var selector = " *.class[ data * = 'data' ] ";
    assert.equal(normalizeSelector(selector), "*.class[data *='data']");
  });
  
  it('should remove comments', function () {
    assert.equal(normalizeSelector(".e1 /* c2 */ .e2"), ".e1 .e2");
  });
  
  it('should replace comments with single whitespace', function () {
    assert.equal(normalizeSelector("tag/* c2 */tag"), "tag tag");
  });
  
  it('should normalize @-rule parentheses', function () {
    var selector = "@media  screen  and  ( color ),  projection  and  (color )";
    var expected = "@media screen and (color), projection and (color)";
    assert.equal(normalizeSelector(selector), expected);
  });
  
  it('should normalize descriptors', function () {
    var selector = "@counter-style    triangle";
    assert.equal(normalizeSelector(selector), "@counter-style triangle");
  });

  it('should normalize case-insensitivity attribute selector', function () {
    assert.equal(normalizeSelector("[ att = val  i ]"), "[att=val i]");
  });
    
  it('should normalize pseudo-classes', function () {
    var selector = "   :nth-last-of-type( )   ";
    assert.equal(normalizeSelector(selector), ":nth-last-of-type()");
  });
  
  it('should normalize pseudo-elements', function () {
    var selector = "   ::nth-fragment(   )   ";
    assert.equal(normalizeSelector(selector), "::nth-fragment()");
  });

});
