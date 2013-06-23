(function () {

function Set() {

  var keys   = [];

    function instance() {
      return keys;
    }

    instance.add = function(k) {
      var i = keys.indexOf(k);
      if(i === -1) { i = keys.length; keys.push(k); }
      return i;
    };

    instance.data = function() {
      return keys;
    };

  return instance;
}

  chartlib.Set = Set;
}(chartlib));
