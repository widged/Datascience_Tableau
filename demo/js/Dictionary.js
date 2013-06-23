(function () {

function Dictionary() {

  var keys   = [], values = [],
      keyLbl = "k", valueLbl = "v";

    function instance() {}


    instance.add = function(k, v) {
      var i = keys.indexOf(k);
      if(i === -1) { i = keys.length; keys.push(k); }
      if(!values[i]) {
        values[i] = {};
        values[i][keyLbl]   = k;
        values[i][valueLbl] = [];
      }
      values[i][valueLbl].push(v);
    };

    instance.data = function() {
       return values;
    };

  return instance;
}

  chartlib.Dictionary = Dictionary;
}(chartlib));
