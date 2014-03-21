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

  function normalizeSelector(sel) {

    // fallback if trim not available
    //sel = sel.replace(/^\s+|\s+$/gm, BLANK)
    sel = sel.trim();
    
    var BLANK = '';
    var SPACE = ' ';
    var RE_NOT_ESCAPED = /(?:[^\\]|(?:^|[^\\])(?:\\\\)+)$/;
    var RE_WS = /^\s+$/;
    var STATE_PATTERNS = [
      /\s+|[~|^$*]?\=|[>~+\[\]"']|\/\*/g, // general
      null, // string literal (placeholder)
      /\*\//g // comment
    ];
    
    var tokens = [];
    var state = 0;
    var next = 0;
    var previous = 0;
    
    var match, unmatched, regex, i, chars, token_length;
       
    while (next < sel.length) {
    
      unmatched = BLANK;
      
      regex = STATE_PATTERNS[state];
      regex.lastIndex = next;
      match = regex.exec(sel);
   
      if (!match) {
      
        previous = next; // is this right??
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
      
        chars = match[0];
        
        previous = next; // is this right??
        next = regex.lastIndex;
   
        // collect the previous string chunk not matched before this token
        if (previous < next - chars.length) {
          unmatched = sel.substring(previous, next - chars.length);
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
          if (/^["']$/.test(chars)) {
          
            state = 1;
            STATE_PATTERNS[1] = new RegExp(chars,"g");
          }
          
          // starting a comment?
          else if (chars === "/*") {
            state = 2;
          }
          
          // handling whitespace or a combinator?
          else if (/^(?:\s+|[~+>])$/.test(chars)) {
          
            // need to insert whitespace before?
            if (tokens.length > 0 && !RE_WS.test(tokens[tokens.length - 1])) {
              // add some placeholder whitespace (which we may remove later)
              tokens.push(SPACE);
            }
   
            // whitespace we can skip?
            if (RE_WS.test(chars)) {
              continue;
            }
          }
   
          tokens.push(chars);
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
              chars = BLANK;
            }
   
            state = 0;
          }
          
          tokens[tokens.length - 1] += chars;
        }
      }
    }
   
    // remove some unnecessary whitespace in [a=b] attribute selectors
    return tokens.filter(function(token, idx) {
      if (!(
        RE_WS.test(token) &&
        (
          idx === 0 ||
          /^(?:[~|^$*]?\=|[\[])$/.test(tokens[idx - 1]) ||
          idx === (tokens.length - 1) ||
          /^(?:[~|^$*]?\=|[\]])$/.test(tokens[idx + 1])
        )
      )) {
        return true;
      }
    }).join(BLANK);
  }
}());