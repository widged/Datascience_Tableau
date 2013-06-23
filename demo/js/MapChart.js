(function () {

  function MapChart() {

    var data, $el, width, height,fillScale;

    function chart() {

    }

    chart.render = function() {
        $el.attr("class", "barChart");

        var projection = d3.geo.albersUsa();

        var svg = $el.append("svg")
            .attr("width", width)
            .attr("height", height);

        var g = svg.append("g");

        g.attr("tranfsorm", "scale(.3, .3)");

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

    chart.fillScale = function(extend, scheme) {
      if (!arguments.length) return fillScale;
      var min = extend[0], max = extend[1];
      fillScale = d3.scale.linear()
                .domain([min, (min + max) / 2, max])
                .range([scheme[0], '#d6d6d6' ,scheme[1]]);
      return chart;
    };


    return chart;
  }

  chartlib.MapChart = MapChart;
}(chartlib));
