define(['chartbase','classutil','d3'], function(ChartBase, ClassUtil, d3) {

  var Class = ChartBase.subclass();

  Class.instance = function() {

    var instance = Class.instanceGenerator(), s = {};

    function warnChange() { dataChange = true; }

    var access              = ClassUtil.accessMaker(s, instance);
    instance.fillScale      = access.getSet("fillScale", [beforeSetFillScale, warnChange]);
    instance.sizeScale      = access.getSet("sizeScale", [warnChange]);

    function beforeSetFillScale(extend, scheme, updateValue) {
      var min = extend[0], max = extend[1];
      var scale = d3.scale.linear()
                .domain([min, (min + max) / 2, max])
                .range([scheme[0], "#d6d6d6", scheme[1]]);
      updateValue(scale);
    }


    instance.render = function() {

        var data = instance.data(), width = instance.width(), height = instance.height(), fillScale = s.fillScale, sizeScale = s.sizeScale;


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

         var g = instance.viewPort("barChart");
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



    return instance;


  };

  return Class;

});
