define(['classutil','d3'], function(ClassUtil, d3) {
  var Class = {};

  Class.instance = function() {
    var instance = {}, s = {}, dataChange = false;

    function warnChange() { dataChange = true; }

    var access              = ClassUtil.accessMaker(s, instance);
    instance.appendTo       = access.getSet("appendTo", [warnChange]);
    instance.data           = access.getSet("data",   [warnChange]);
    instance.width          = access.getSet("width",  [warnChange]);
    instance.height         = access.getSet("height", [warnChange]);
    instance.right          = access.getSet("right", [warnChange]);

    instance.render = function() {

      var node = s.appendTo, data = s.data, right = s.right, width = s.width;

      // add legend   
      var legend = node.append("g")
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


    return instance;

  };


  return Class;


});
