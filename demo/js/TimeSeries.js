(function () {

  function TimeSeries() {

    var data, $el,
        width, height,
        xConfig, yConfig;

    function chart() {

    }

    chart.render = function() {
      $el.attr("class", "timeSeries");

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

      var line = d3.svg.line()
          .x(function(d) { return x(d.x); })
          .y(function(d) { return y(d.y); });

      var svg = $el.append("svg")
          .attr("width", width)
          .attr("height", height)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        data.forEach(function(d) {
          d.x = xConfig.convert(d.x);
          d.y = +d.y;
        });

        data.sort(function(a, b) {
          return a.x - b.x;
        });


        x.domain([data[0].x, data[data.length - 1].x]);
        y.domain(d3.extent(data, function(d) {  return d.y; }));

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

        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);
    };

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

    chart.data = function(_) {
      if (!arguments.length) return data;
      data = _;
      return chart;
    };

    chart.$element = function(_) {
      if (!arguments.length) return $el;
      $el = _;
      return chart;
    };

    chart.width = function(_) {
      if (!arguments.length) return width;
      width = _;
      return chart;
    };

    chart.height = function(_) {
      if (!arguments.length) return height;
      height = _;
      return chart;
    };

    chart.yConfig = function(_) {
      if (!arguments.length) return yConfig;
      yConfig = _;
      return chart;
    };

    chart.xConfig = function(_) {
      if (!arguments.length) return xConfig;
      xConfig = _;
      if(xConfig.convert === undefined) { xConfig.convert = function(x) { return x; }; }
      return chart;
    };



    return chart;
  }

  chartlib.TimeSeries = TimeSeries;
}(chartlib));
