requirejs.config({
    baseUrl: 'js/',
    urlArgs: "bust=v5", // use this to force a reload of all js files
    paths: {
        // vendors
        d3                : 'libs/d3/d3.v3.min',
        // data
        set               : 'widged/data/Set',
        // charts
        colorscheme       : 'widged/chart/ColorScheme',
        legend            : 'widged/chart/Legend',
        chartbase         : 'widged/chart/ChartBase',
        barchart          : 'widged/chart/BarChart',
        mapchart          : 'widged/chart/MapChart',
        timeseries        : 'widged/chart/TimeSeries',
        linechart         : 'widged/chart/LineChart',
        // utils
        classutil           : 'widged/util/ClassUtil',
        domutil             : 'widged/util/DomUtil'
    },
    shim: {
        d3: {
            exports: 'd3'
        }
    }
});

