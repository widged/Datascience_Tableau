(function () {

function Legend() {

  var $el, data, right, width;

  function instance() {}

  instance.render = function() {

  // add legend   
  var legend = $el.append("g")
    .attr("class", "legend")
    .attr('transform', 'translate(-20,50)');

    legend.selectAll('rect')
      .data(data.lines)
      .enter()
      .append("rect")
    .attr("x", right - width)
      .attr("y", function(d, i){ return i *  20;})
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function(d, i) {
        return data.colors(i);
      });

    legend.selectAll('text')
      .data(data.lines)
      .enter()
      .append("text")
      .attr("x", right - width + 12)
      .attr("y", function(d, i){ return i *  20 + 9;})
    .text(function(d) {
        return d;
      });
  };

    instance.$element = function(_) {
      if (!arguments.length) return $el;
      $el = _;
      return instance;
    };

    instance.data = function(_) {
      if (!arguments.length) return data;
      data = _;
      return instance;
    };

    instance.width = function(_) {
      if (!arguments.length) return width;
      width = _;
      return instance;
    };

    instance.right = function(_) {
      if (!arguments.length) return right;
      right = _;
      return instance;
    };

    return instance;
}

  chartlib.Legend = Legend;
}(chartlib));
