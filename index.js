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

    var state = 0, tokens = [], match, unmatched, regex,
      next_match_idx = 0, prev_match_idx = 0, i,
      not_escaped_pattern = /(?:[^\\]|(?:^|[^\\])(?:\\\\)+)$/,
      whitespace_pattern = /^\s+$/,
      state_patterns = [
        /\s+|[~|^$*]?\=|[>~+\[\]"']|\/\*/g, // general
        null, // string literal (placeholder)
        /\*\//g // comment
      ]
    ;
   
    sel = sel.trim();
   
    while (next_match_idx < sel.length) {
      unmatched = "";
   
      regex = state_patterns[state];
   
      regex.lastIndex = next_match_idx;
      match = regex.exec(sel);
   
      if (match) {
        prev_match_idx = next_match_idx;
        next_match_idx = regex.lastIndex;
   
        // collect the previous string chunk not matched before this token
        if (prev_match_idx < next_match_idx - match[0].length) {
          unmatched = sel.substring(prev_match_idx,next_match_idx - match[0].length);
        }
      }
      else {
        prev_match_idx = next_match_idx;
        next_match_idx = sel.length;
        unmatched = sel.substr(prev_match_idx);
        if (!unmatched) break;
      }
   
      if (match) {
        // general
        if (state === 0) {
          // preserve the unmatched portion preceding
          if (unmatched) {
            if (tokens.length > 0 &&
              /^[~+>]$/.test(tokens[tokens.length-1])
            ) {
              tokens.push(" ");
            }
            tokens.push(unmatched);
          }
   
          // starting a string literal?
          if (/^["']$/.test(match[0])) {
            state = 1;
            state_patterns[1] = new RegExp(match[0],"g");
          }
          // starting a comment?
          else if (match[0] === "/*") {
            state = 2;
          }
          // handling whitespace or a combinator?
          else if (/^(?:\s+|[~+>])$/.test(match[0])) {
            // need to insert whitespace before?
            if (tokens.length > 0 &&
              !whitespace_pattern.test(tokens[tokens.length-1])
            ) {
              // add some placeholder whitespace (which we may remove later)
              tokens.push(" ");
            }
   
            // whitespace we can skip?
            if (whitespace_pattern.test(match[0])) {
              continue;
            }
          }
   
          tokens.push(match[0]);
        }
        // string literal or comment
        else {
          tokens[tokens.length-1] += unmatched;
          // unescaped terminator to string literal or comment?
          if (not_escaped_pattern.test(tokens[tokens.length-1])) {
            // comment to be dropped or turned it into whitespace?
            if (state === 2) {
              if (tokens.length < 2 ||
                whitespace_pattern.test(tokens[tokens.length-2])
              ) {
                tokens.pop();
              }
              else {
                tokens[tokens.length-1] = " ";
              }
   
              // handled already
              match[0] = "";
            }
   
            state = 0;
          }
          tokens[tokens.length-1] += match[0];
        }
      }
      else if (unmatched) {
        if (tokens.length > 0 &&
          !whitespace_pattern.test(tokens[tokens.length-1])
        ) {
          tokens.push(" ");
        }
        tokens.push(unmatched);
      }
    }
   
    // remove some unnecessary whitespace in [a=b] attribute selectors
    return tokens.filter(function(token,idx){
      if (!(
        whitespace_pattern.test(token) &&
        (
          idx === 0 ||
          /^(?:[~|^$*]?\=|[\[])$/.test(tokens[idx-1]) ||
          idx === (tokens.length - 1) ||
          /^(?:[~|^$*]?\=|[\]])$/.test(tokens[idx+1])
        )
      )) {
        return true;
      }
    }).join("");
  }
}());