define(['chartbase','classutil','d3'], function(ChartBase, ClassUtil, d3) {

  var Class = ChartBase.subclass(), FN = PureFunctions();

  Class.instance = function() {

    var instance = Class.instanceGenerator(), s = {};

    function warnChange() { dataChange = true; }

    var access              = ClassUtil.accessMaker(s, instance);
    instance.appendTo       = access.getSet("appendTo", [warnChange]);
    instance.data           = access.getSet("data",   [warnChange]);
    instance.width          = access.getSet("width",  [warnChange]);
    instance.height         = access.getSet("height", [warnChange]);
    instance.xConfig        = access.getSet("xConfig", [warnChange]);
    instance.yConfig       = access.getSet("yConfig", [warnChange]);


    instance.render = function() {

      var data = s.data, node = s.appendTo,
          width = s.width, height = s.height,
          xConfig = s.xConfig, yConfig = s.yConfig;


      var margin = {top: 20, right: 50, bottom: 30, left: 50},
            innerWidth = width - margin.left - margin.right,
            innerHeight = height - margin.top - margin.bottom;


      var x = FN.getScale(xConfig.type, 0, innerWidth);
      var y = FN.getScale(yConfig.type, innerHeight, 0);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      var line = d3.svg.line()
          .x(function(d) { return x(d.x); })
          .y(function(d) { return y(d.y); });


        var convertFn = xConfig.convert || function(d) { return d; };
        data.forEach(function(d) {
          d.x = convertFn(d.x);
          d.y = +d.y;
        });

        data.sort(function(a, b) {
          return a.x - b.x;
        });

        x.domain([data[0].x, data[data.length - 1].x]);
        y.domain(d3.extent(data, function(d) {  return d.y; }));

        var g = instance.viewPort("timeSeries", margin);

        g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + innerHeight + ")")
            .call(xAxis);

        g.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(yConfig.label);

        g.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);
    };

    return instance;
  };

  function PureFunctions() {
    var FN = {};
    FN.getScale = function(type, min, max) {
      var out;
      if(type === "time") {
         out = d3.time.scale()
                .range([min, max]);
      } else {
        out = d3.scale.linear()
                .range([min, max]);
      }
      return out;
    };

    return FN;
  }
  return Class;
});
