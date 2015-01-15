require.config({
    baseUrl: 'script/',
    paths: {
        'jquery': 'plugins/jquery-1.10.2.min',
        'jquery-migrate': 'plugins/jquery-migrate-1.2.1.min',
        'jquery-ui': 'plugins/jquery-ui/jquery-ui-1.10.3.custom.min',
        'bootstrap': 'plugins/bootstrap-3.3.1/js/bootstrap.min',
        'underscore': 'plugins/underscore-min',
        'highcharts': 'plugins/highcharts-4.0.4/highcharts',
        'highcharts-more': 'plugins/highcharts-4.0.4/highcharts-more',
        'exporting': 'plugins/highcharts-4.0.4/modules/exporting',
        'handsontable': 'plugins/handsontable/dist/handsontable.full.min',
        'gscharts': 'common/gscharts',
        'gscharts-tool': 'common/gscharts-tool',
        'gsdata': 'common/gsdata',
        'manufacture': 'manufacture-feature'
    },
    shim: {
        'jquery-migrate': ['jquery'],
        'jquery-ui':['jquery'],
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
    'jquery-migrate',
    'jquery-ui',
    'bootstrap'
], function (jquery, manufacture) {
    manufacture.fabricate();
});