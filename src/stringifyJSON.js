// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:
var stringifyJSON = function(obj) {

  if (obj === null) {
      return 'null';
  }

  if (obj === undefined) {
    return '';
  }

  if (typeof(obj) === 'object') {
    var props = [];
    var isArray = obj instanceof Array;
    
    for (key in obj) {
      var propKey = isArray ? '' : '"' + key + '":';
      var propVal = stringifyJSON(obj[key])

      if (propVal) props.push(propKey + propVal);
    }

    return (isArray ? '[' : '{') + props.join(',') + (isArray ? ']' : '}');
  }

  if (typeof(obj) === 'string') {
    return '"' + obj + '"';
  }

  if (typeof(obj) === 'number') {
    return '' + obj;
  }

  if (typeof(obj) === 'function') {
    return '';
  }

  return '' + obj;

};
