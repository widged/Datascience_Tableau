define(['chartbase','classutil','d3'], function(ChartBase, ClassUtil, d3) {

  var Class = ChartBase.subclass();

  Class.instance = function() {

    var instance = Class.instanceGenerator(), s = {};

    function warnChange() { dataChange = true; }

    var access              = ClassUtil.accessMaker(s, instance);
    instance.fillScale      = access.getSet("fillScale", [beforeSetFillScale, warnChange]);


    function beforeSetFillScale(extend, scheme, updateValue) {
      var min = extend[0], max = extend[1];
      var scale = d3.scale.linear()
                .domain([min, (min + max) / 2, max])
                .range([scheme[0], "#d6d6d6", scheme[1]]);
      updateValue(scale);
    }

      instance.render = function() {

          var data = instance.data(), fillScale = instance.fillScale();
          var projection = d3.geo.albersUsa().scale(700);


          // var projection = d3.geo.albers().scale(600).center([0,55]);

          var g1 = instance.viewPort("mapChart", {top: -30, right: 0, bottom: 0, left: -130});
          var g = g1.append("g");

          d3.json('json/us-states.json', function(collection) {
            g.selectAll('path')
            .data(collection.features)
            .enter().append('path')
            .attr("d", d3.geo.path().projection(projection))
            .attr("id", function(d){return d.properties.name.replace(/\s+/g, "");})
            .style("fill", function(d){
              var obj = data[d.properties.name], count;
              if(obj) { count = obj[0].count; }
              return fillScale( count);
            })
            .style("stroke", "white")
            .style("stroke-width", 1);


          });
      };

      return instance;

  }
  return Class;
});  
