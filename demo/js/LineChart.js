(function () {

  function LineChart() {

    var data, $el,
        width, height,
        xConfig, yConfig;

    function instance() { }

    instance.render = function() {
      $el.attr("class", "lineChart");

      var margin = {top: 20, right: 50, bottom: 30, left: 50},
            innerWidth = width - margin.left - margin.right,
            innerHeight = height - margin.top - margin.bottom;

      var x = getScale(xConfig.type, 0, innerWidth);
      var y = getScale(yConfig.type, innerHeight, 0);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      var svg = $el.append("svg")
          .attr("width", width)
          .attr("height", height)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        data.data.sort(function(a, b) {
          return a.x - b.x;
        });

        var lineData = data.data;
        cleanData(lineData);

        x.domain([lineData[0].x, lineData[lineData.length - 1].x]);
        y.domain(lineData.yExtent);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + innerHeight + ")")
            .call(xAxis);

        svg.append("g")
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

        svg.append("path")
            .datum(lineData)
            .attr("class", "line")
            .attr("d", line)
            .attr("stroke",colors(i));
      });

      return svg;
    };

/* -----------------------------*/
/* ---    Getters, Setters    --*/
/* -----------------------------*/

    instance.data = function(_) {
      if (!arguments.length) return data;
      data = _;
      return instance;
    };

    instance.$element = function(_) {
      if (!arguments.length) return $el;
      $el = _;
      return instance;
    };

    instance.width = function(_) {
      if (!arguments.length) return width;
      width = _;
      return instance;
    };

    instance.height = function(_) {
      if (!arguments.length) return height;
      height = _;
      return instance;
    };

    instance.yConfig = function(_) {
      if (!arguments.length) return yConfig;
      yConfig = _;
      return instance;
    };

    instance.xConfig = function(_) {
      if (!arguments.length) return xConfig;
      xConfig = _;
      if(xConfig.convert === undefined) { xConfig.convert = function(x) { return x; }; }
      return instance;
    };

/* -----------------------------*/
/* ---    Utilities           --*/
/* -----------------------------*/

      function cleanData(lineData) {
        var min, max;
        lineData.forEach(function(d) {
          d.x = xConfig.convert(d.x);
          d.y.forEach(function(dy, i) {
            d.y[i] = +parseFloat(d.y[i]);
            if(min === undefined || dy < min) { min = dy; }
            if(max === undefined || dy > max) { max = dy; }
          });
        });
        lineData.yExtent = [min, max];
      }


    function getScale(type, min, max) {
      var out;
      if(type === "time") {
         out = d3.time.scale()
                .range([min, max]);
      } else {
        out = d3.scale.linear()
                .range([min, max]);
      }
      return out;
    }


    return instance;
  }

  chartlib.LineChart = LineChart;
}(chartlib));
