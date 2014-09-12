var findMatch = function(jsonArray, symbol, match) {
  var balance = 0;
  for (var i = 0; i < jsonArray.length; i++) {
    if (jsonArray[i] === symbol) balance--;
    if (jsonArray[i] === match) balance++;
    if (balance === 0) return i;
  };
  var err = new SyntaxError('Unexpected end of input');
  throw err;
}

var findFirstUnescapedQuote = function(arr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === '"' && arr[i-1] !== '\\') {
      return i;
    }
  }
  var err = new SyntaxError('Unexpected end of input');
  throw err;
}

var shiftNode = function(jsonArray) {
  if (jsonArray[0] === '[') {
    var matchLength = findMatch(jsonArray, '[', ']') + 1;
    return jsonArray.splice(0, matchLength);
  } else if (jsonArray[0] === '{') {
    var matchLength = findMatch(jsonArray, '{', '}') + 1;
    return jsonArray.splice(0, matchLength);
  } else if (jsonArray[0] === '"') {
    jsonArray.shift();
    var matchLength = findFirstUnescapedQuote(jsonArray) + 1;
    var result = jsonArray.splice(0, matchLength);
    result.unshift('"');
    return result;
  } else if (jsonArray[0] === ',' || jsonArray[0] === ':' || jsonArray[0] === ' ') {
    return jsonArray.splice(0, 1);
  } else {
    var length = jsonArray.indexOf(",");
    if (length > 0 ) {
      var result = jsonArray.splice(0, length);
    } else {
      var result = jsonArray.splice(0, jsonArray.length);
    }
    result = result.join('').replace(/\s/g, '').split('');
    return result;
  }
}

var splitJSON = function(str) {
  var nodes = [];
  var jsonArray = str.split('');

  while (jsonArray.length > 0) {
    var node = shiftNode(jsonArray).join('').replace(/\\"/g, '"');
    if (node !== ','  && node !== ':' && node !== ' ') {
      nodes.push(node);
    }
  }

  return nodes;
}

var trim = function(str) {
  var arr = str.split('');
  arr.shift();
  arr.pop();
  return arr.join('');
}

var parseArray = function(json) {
  var node = [];
  json = trim(json);
  var children = splitJSON(json);
  if (children.length > 0) {
    for (var i = 0; i < children.length; i++) {
      node.push(parseJSON(children[i]));
    };
  }
  return node;
}

var parseObject = function(json) {
  var node = {};
  json = trim(json);
  var children = splitJSON(json);
  if (children.length > 0) {
    for (var i = 0; i < children.length; i+=2) {
      var key = parseJSON(children[i]);
      var val = parseJSON(children[i+1]);
      node[key] = val;
    };
  }
  return node;
}

var parseString = function(json) {
  return trim(json);
}

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {

  json = json
    .replace(/\\\\/g, '\\')
    .replace(/\r/g, '')
    .replace(/\n/g, '')
    .replace(/\t/g, '');

  if (json.charAt(0) === '[') {
    return parseArray(json);
  } else if (json.charAt(0) === '{') {
    return parseObject(json);
  } else if (json.charAt(0)  === '"') {
    return parseString(json);
  } else if (json === 'null') {
    return null;
  } else if (json === 'true') {
    return true;
  } else if (json === 'false') {
    return false;
  } else {
    return Number(json);
  }

};