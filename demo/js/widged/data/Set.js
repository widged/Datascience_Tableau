define(function(){

  var Class = {};

  Class.instance = function(){

    var keys   = [];

    var instance = {};

    instance.add = function(k) {
      var i = keys.indexOf(k);
      if(i === -1) { i = keys.length; keys.push(k); }
      return i;
    };

    instance.data = function() {
      return keys;
    };

  return instance;


 };
 return Class;

});
