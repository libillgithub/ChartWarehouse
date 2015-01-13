require.config({
    baseUrl: "script/",
    paths: {
        "jquery": "plugins/jquery-1.10.2.min",
        "bootstrap": "plugins/bootstrap-3.3.1/js/bootstrap.min",
        "prettify": "plugins/prettify",
		"underscore": "plugins/underscore-min",
        "highcharts": "plugins/highcharts-4.0.4/highcharts",
        "highcharts-more": "plugins/highcharts-4.0.4/highcharts-more",
        "exporting": "plugins/highcharts-4.0.4/modules/exporting",
        //core js
		"gscharts": "common/gscharts"
    },
    shim: {
        "bootstrap": ["jquery"],
        "highcharts-more": ["highcharts"],
        "exporting": ["highcharts"]
    },
    priority: [
        "jquery"
    ]
});
//window.name = "NG_DEFER_BOOTSTRAP!";
require([
    "jquery",
	"gscharts",
    "bootstrap",
    "prettify",
	"highcharts",
	"highcharts-more"
], function (jquery, gscharts) {
	$('pre').addClass('prettyprint linenums');
	prettyPrint();
	
	var chartRecord = {
			id : 'gscharts', 
			widgetType : 'highcharts',
			chartType : 'area', 
			chartData : {
				columns : ['device', 'browser', 'pv', 'uv', 'visits', 'bounceRate'],
				rows : [
					['computer', 'firefox', 1900, 2900, 3900, 0.956],
					['computer', 'chrome', 3800, 2800, 3800, 0.856],
					['computer', 'ie', 1700, 2700, 3700, 0.756],
					['computer', 'safari', 1600, 2600, 3600, 0.656],
					['computer', 'opera', 1500, 2500, 3500, 0.556],
					['computer', 'others1', 1400, 2400, 3400, 0.456],
					['computer', 'others1', 1900, 2400, 3400, 0.456], 
					//special the exist record
					['phone', 'firefox', 4900, 5900, 6900, 0.978],
					['phone', 'ie', 4800, 5800, 6800, 0.878],
					['phone', 'chrome', 4700, 5700, 6700, 0.778],
					['phone', 'safari', 4600, 5600, 6600, 0.678],
					['phone', 'opera', 4500, 5500, 6500, 0.578],
					['phone', 'others2', 4400, 5400, 6400, 0.478]
				]
			}
		},
		chartConfig = {'xAxes' : [1], 'yAxes' : [2], 'series' : [0]};

	//render custom widget
	var chartOpts = {
		container : chartRecord.id, 
		widgetType : chartRecord.widgetType,
		chartType : chartRecord.chartType,
		chartData : chartRecord.chartData,
		chartConfig : chartConfig
	};
	gscharts.renderChart(chartOpts);
});