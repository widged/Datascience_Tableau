define(['classutil','d3'], function(ClassUtil, d3) {

  var Abstract = {};

  Abstract.subclass = function() {
    var Class = {};

    Class.instanceGenerator = function() {
      var instance = {}, s = {};

		function warnChange() { /* dispatch change event */ }

		var access              = ClassUtil.accessMaker(s, instance);
		instance.appendTo       = access.getSet("appendTo", [warnChange]);
		instance.data           = access.getSet("data",   [warnChange]);
		instance.width          = access.getSet("width",  [warnChange]);
		instance.height         = access.getSet("height", [warnChange]);

		instance.viewPort = function(className, margin) {
			var node = instance.appendTo(), width = instance.width(), height = instance.height();
			node.attr("class", className);

			var svg = node.append("svg")
				.attr("width", width)
				.attr("height", height);

			var g = svg.append("g");
			if(margin) {
				g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			}

			return g;
		};


        return instance;
    };

    return Class;
  };

  return Abstract;
});
