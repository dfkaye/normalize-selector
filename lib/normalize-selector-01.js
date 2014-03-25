/*
  author: kyle simpson (@getify)
  original source: https://gist.github.com/getify/9679380
  
  modified for tests by david kaye (@dfkaye)
  21 march 2014
*/

if (typeof require == 'function' && typeof module != 'undefined') {
  // enable to re-use in a browser without require.js
  module.exports = normalizeSelector;
}

function normalizeSelector(sel) {

  // need fallback if trim not available??
  //sel = sel.replace(/^\s+|\s+$/gm, BLANK);
  sel = sel.trim();
  
  var BLANK = '';
  var SPACE = ' ';
  var RE_NOT_ESCAPED = /(?:[^\\]|(?:^|[^\\])(?:\\\\)+)$/;
  var RE_WS = /^\s+$/;
  var STATE_PATTERNS = [
    /\s+|[~|^$*]?\=|[>~+\[\]"']|\/\*|\(/g, // general
    null, // string literal (placeholder)
    /\*\//g, // end comment
    /\)/g // end parenthesis
  ];
  
  var tokens = [];
  var state = 0;
  var next = 0;
  var previous = 0;
  
  var match, unmatched, pattern, i, token, token_length;
     
  while (next < sel.length) {
  
    unmatched = BLANK;
    
    pattern = STATE_PATTERNS[state];
    pattern.lastIndex = next;
    match = pattern.exec(sel);
 
    if (!match) {
    
      previous = next;
      next = sel.length;
      unmatched = sel.substr(previous);
      
      // fail faster here
      if (!unmatched) { 
        break; 
      }
      else {
        if (tokens.length > 0 && !RE_WS.test(tokens[tokens.length - 1])) {
          tokens.push(SPACE);
        }
        tokens.push(unmatched);
      }        
    }
    
    // process match characters
    if (match) {
    
      token = match[0];
      previous = next;
      next = pattern.lastIndex;
 
      // collect the previous string chunk not matched before this token
      if (previous < next - token.length) {
        unmatched = sel.substring(previous, next - token.length);
      }

      // general
      if (state === 0) {
      
        // preserve the unmatched portion preceding
        if (unmatched) {
        
          if (tokens.length > 0 && /^[~+>]$/.test(tokens[tokens.length - 1])) {
            tokens.push(SPACE);
          }
          
          tokens.push(unmatched);
        }
 
        // starting a string literal?
        if (/^["']$/.test(token)) {
        
          state = 1;
          STATE_PATTERNS[1] = new RegExp(token,"g");
        }
        
        // starting a comment?
        else if (token === "/*") {
          state = 2;
        }
        
        // starting parenthesis
        else if (token == '(') {
          state = 3;
        }
        
        // handling whitespace or a combinator?
        else if (/^(?:\s+|[~+>])$/.test(token)) {
        
          // need to insert whitespace before?
          if (tokens.length > 0 && !RE_WS.test(tokens[tokens.length - 1])) {
            // add some placeholder whitespace (which we may remove later)
            tokens.push(SPACE);
          }
 
          // whitespace we can skip?
          if (RE_WS.test(token)) {
            continue;
          }
        }
 
        tokens.push(token);
      }
      
      // string literal or comment
      else {
      
        tokens[tokens.length - 1] += unmatched;
        
        // unescaped terminator to string literal or comment?
        if (RE_NOT_ESCAPED.test(tokens[tokens.length - 1])) {
        
          // comment to be dropped or turned it into whitespace?
          if (state === 2) {
          
            if (tokens.length < 2 || RE_WS.test(tokens[tokens.length - 2])) {
              tokens.pop();
            }
            else {
              tokens[tokens.length - 1] = SPACE;
            }
 
            // handled already
            token = BLANK;
          }
          
          // closing parentheses
          if (state === 3) {
          
            (function () {
            
              /* Using an IIFE to avoid leaking internal vars */
            
              // remove internal whitespace from parentheses
              var index = tokens.length - 1;
              var chars = tokens[index];
              var k = chars.length;
              
              tokens[index] = [];
              
              while (k--) {
                if (!RE_WS.test(chars[k])) {
                  tokens[index].unshift(chars[k]);
                }
              }
              
              tokens[index] = tokens[index].join(BLANK);
              
            }());
            
          }
 
          state = 0;
        }
        
        tokens[tokens.length - 1] += token;
      }
    }
  }
 
  // remove some unnecessary whitespace in [a=b] attribute selectors and 
  // parentheses ( color ) 
  return tokens.filter(function(token, idx) {
    if (!(
      RE_WS.test(token) &&
      (
        idx === 0 ||
        /^(?:[~|^$*]?\=|[\[]|[\(])$/.test(tokens[idx - 1]) ||
        idx === (tokens.length - 1) ||
        /^(?:[~|^$*]?\=|[\]]|[\)])$/.test(tokens[idx + 1])
      )
    )) {
      return true;
    }
  }).join(BLANK);
}