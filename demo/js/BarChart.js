(function () {
  function BarChart() {

    var data, $el, fillScale, sizeScale, width, height;

    function instance() {

    }

    instance.render = function() {
        $el.attr("class", "barChart");

        var margin = {top: 20, right: 10, bottom: 10, left: 10},
            innerWidth = width - margin.left - margin.right,
            innerHeight = height - margin.top - margin.bottom;
            labelWidth = 120;

        var barExtent = d3.extent(data, function(d) { return d.barSize; });
        var x = d3.scale.linear()
                .range([0, innerWidth - labelWidth])
                .domain([0, barExtent[1]]).nice();

        var y = d3.scale.ordinal()
                .rangeRoundBands([0, innerHeight], 0.1)
                .domain(data.map(function(d) { return d.key; }));

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("top");

        var svg = $el.append("svg")
            .attr("width", width)
            .attr("height", height);

        var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

         var bar = g.selectAll(".bar")
              .data(data)
              .enter().append("g").attr("class", "bar");

            bar.append("rect")
              .attr("x", function(d) { return x(0); })
              .attr("y", function(d) { return y(d.key); })
              .attr("width", function(d) { return x(d.barSize); })
              .attr("height", y.rangeBand())
              .attr("fill", function(d) { return fillScale(d.fill); })
              .attr("transform", "translate(" + labelWidth + "," + 0 + ")");

            bar.append("text")
              .text(function(d) { return d.key; })
              .attr("x", x(0))
              .attr("y", function(d) { return (y(d.key)); })
              .attr("dominant-baseline","middle")
              .attr("text-anchor", "end")
              .attr("transform", "translate(" + (labelWidth - 10) + "," + Math.round(y.rangeBand() / 2) + ")");


          g.append("g")
              .attr("class", "x axis")
              .call(xAxis)
              .attr("transform", "translate(" + labelWidth + "," + 0 + ")");

          g.append("g")
              .attr("class", "y axis")
            .append("line")
              .attr("x1", x(0))
              .attr("y1", 0)
              .attr("x2", x(0))
              .attr("y2", innerHeight)
              .attr("fill", "#ff00FF")
              .attr("stroke", "#ff00FF")
              .attr("stroke-width", 1.5)
              .attr("transform", "translate(" + labelWidth + "," + 0 + ")");

          return;
    };


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

    instance.fillScale = function(extend, scheme) {
      if (!arguments.length) return fillScale;
      var min = extend[0], max = extend[1];
      fillScale = d3.scale.linear()
                .domain([min, (min + max) / 2, max])
                .range([scheme[0], "#d6d6d6", scheme[1]]);
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

    return instance;
  }
  chartlib.BarChart = BarChart;
}(chartlib));
