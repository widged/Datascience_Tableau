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

      var data = instance.data(), width = instance.width(), height = instance.height(), xConfig = s.xConfig, yConfig = s.yConfig;

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


        data.data.sort(function(a, b) {
          return a.x - b.x;
        });

        var lineData = data.data;
        var convertFn  = s.xConfig.convert || function(x) { return x; };
        FN.cleanData(lineData, convertFn);

        x.domain([lineData[0].x, lineData[lineData.length - 1].x]);
        y.domain(lineData.yExtent);

        var g = instance.viewPort("lineChart", margin);
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

      var colors = yConfig.colors, line;
      data.lines.forEach(function(line, i) {
        line = d3.svg.line()
            .x(function(d) { return x(d.x); })
            .y(function(d) { var dy = d.y[i] || 0; return y(dy); });

        g.append("path")
            .datum(lineData)
            .attr("class", "line")
            .attr("d", line)
            .attr("stroke",colors(i));
      });

      return g;
    };

     return instance;
  };

   /**
    Functions with no side effect and no dependency on any instance state variable
   */
   function PureFunctions() {
      var FN = {};

      FN.cleanData = function(lineData, convertFn) {
        var min, max;
        lineData.forEach(function(d) {
          d.x = convertFn(d.x);
          d.y.forEach(function(dy, i) {
            d.y[i] = +parseFloat(d.y[i]);
            if(min === undefined || dy < min) { min = dy; }
            if(max === undefined || dy > max) { max = dy; }
          });
        });
        lineData.yExtent = [min, max];
      };


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
