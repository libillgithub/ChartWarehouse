require.config({
    baseUrl: 'script/',
    paths: {
        'jquery': 'plugins/jquery-1.10.2.min',
        'bootstrap': 'plugins/bootstrap-3.3.1/js/bootstrap.min',
        'underscore': 'plugins/underscore-min',
        'highcharts': 'plugins/highcharts-4.0.4/highcharts',
        'highcharts-more': 'plugins/highcharts-4.0.4/highcharts-more',
        'exporting': 'plugins/highcharts-4.0.4/modules/exporting',
        'handsontable': 'plugins/handsontable/dist/handsontable.full.min',
        'gscharts': 'common/gscharts',
        'manufacture': 'manufacture-feature'
    },
    shim: {
        'bootstrap': ['jquery'],
        'highcharts-more': ['highcharts'],
        'exporting': ['highcharts'],
        'handsontable': ['jquery']
    },
    priority: [
        'jquery'
    ]
});

require([
    'jquery',
    'manufacture',
    'bootstrap'
], function (jquery, manufacture) {
    manufacture.fabricate();
});