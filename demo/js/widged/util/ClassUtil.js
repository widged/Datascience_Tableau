define(function() {

    var Class = {}, FN = PureFunctions();

    /*
      AccessMaker helps rapidly create getter and setters in classes meant to provide a fluent/chainable interface.
      @param instance  the instance object to return after a variable is set
      @param state the object with the attributes to read/write when a variable is accessed.
    */
    Class.accessMaker = function(state, instance) {
      return {
        /*
          GetSet creates an accessor/mutator for a given property
          @param attr  the attribute to update
          @param aroundSetFns the functions to execute at the time a value is set.
        */
        getSet: function(attr, aroundSetFns) {
          return function(_) {
            var args = FN.forceArray(arguments);
            if(_ === undefined) { return state[attr]; }
            if(_ !== state[attr]) {
              (aroundSetFns || []).forEach(function(fn) {
                args.push(function(new_) { _ = new_; });
                fn.apply(null, args);
              });
              state[attr] = _;
            }
            return instance;
          };
        }
      };
    };


    function PureFunctions() {
      var FN = {};
      FN.forceArray = function(pseudoArray) {
        return Array.prototype.slice.call(pseudoArray, 0);
      };

      return FN;
    }
    return Class;

});
