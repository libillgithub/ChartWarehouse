define(['gscharts', 'handsontable'], function (gscharts) {
    var chartRecord = {
        id : 'gscharts1', 
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
    
    function getTableData(data) {
        data = data || [];
        var length = data.length, i = 0, temp = [], target = [], result = [];
        for (; i < length; i++) {
            temp = data[i];
            if (temp[0] !== null && temp[1] !== null) {
                target = [];
                for (var j = 0; j < temp.length; j++) {
                    if (temp[j] !== null) {
                        target.push(temp[j]);
                    } else {
                        result.push(target);
                        break;
                    }
                }
            } else {
                break;
            }
        }
        return result;
    }
    
    function renderDataEditor(chartData) {
        chartData = chartData || {columns : [], rows : []};
        var data = [], firstRow = [];
        if (chartData.rows.length > 0) {
            data = data.concat([chartData.columns], chartData.rows);
        }
        
        $('#sidebarContent').empty().append('<div id="handsontable"></div>');
        //TO DO: transform data for null value;(预处理null值为空字符串)
        $("#handsontable").handsontable({
            data: data,
            minRows: 5,
            minCols: 5,
            manualColumnResize: true,
            manualRowResize: true,
            rowHeaders: true,
            colHeaders: true,
            minSpareRows: 50,
            minSpareCols: 15,
            contextMenu: true
        }); 
        // $('#handsontable').handsontable('loadData', data);
        var instance = $("#handsontable").handsontable('getInstance');
        instance.addHook('afterChange', function(changes, source) {
            var changesData = instance.getData();
            changesData = getTableData(changesData);
            changesData = changesData.concat();
            console.log('changes data now.');
            console.dir(changesData);
            chartRecord.chartData = {
                columns : changesData.shift(),
                rows : changesData
            };
            
            renderLocalChart();
        });
    }
    
    function renderLocalChart() {
        var chartOpts = {
            container : chartRecord.id, 
            widgetType : chartRecord.widgetType,
            chartType : chartRecord.chartType,
            chartData : chartRecord.chartData,
            chartConfig : chartConfig
        };
        gscharts.renderChart(chartOpts,
            {
                title : {'text' : 'demo1'}
            }
        );
        
        chartOpts.container = 'gscharts2';
        chartOpts.chartType = 'line';
        gscharts.renderChart(chartOpts,
            {
                title : {'text' : 'demo1'}
            }
        );
        
        chartOpts.container = 'gscharts3';
        chartOpts.chartType = 'pie';
        gscharts.renderChart(chartOpts,
            {
                title : {'text' : 'demo1'}
            }
        );
    }
    
    function fabricate () {
        //数据编辑开关操作
        $('#closeSidebar').on('click', function (e) {
            var $sidebar = $('#sidebar').toggleClass('sidebar-hidden');
            if ($sidebar.hasClass('sidebar-hidden')) {
                $('#main').removeClass().addClass('col-sm-12 col-md-12 main');
            } else {
                $('#main').removeClass().addClass('col-sm-8 col-sm-offset-4 col-md-8 col-md-offset-4 main');
            }
        });
        $('#navbar').on('click', '.chart-handle', function (e) {
            var $this = $(this);
            if ($this.hasClass('chart-handle-add')) {
                console.log('add chart.');
            } else if ($this.hasClass('chart-handle-edit')) {
                if ($('#sidebar').hasClass('sidebar-hidden')) {
                    $('#sidebar').removeClass('sidebar-hidden');
                    $('#main').removeClass().addClass('col-sm-8 col-sm-offset-4 col-md-8 col-md-offset-4 main');
                    renderLocalChart();
                    renderDataEditor(chartRecord.chartData);
                }
            }
        });

        renderLocalChart();
    }
    
    return {
        fabricate : fabricate
    }
});