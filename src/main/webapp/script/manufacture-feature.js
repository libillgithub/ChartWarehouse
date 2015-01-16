define(['gscharts', 'gscharts-tool', 'gsdata', 'handsontable'], function (gscharts, gschartsTool, gsdata) {
    //render the local charts of the dashboard 
    function renderLocalChart() {
        var chartData = gsdata.chartData, dashboard = gsdata.dashboard, configs = dashboard.configs || {},
            charts = dashboard.charts || [], chartsLength = charts.length, 
            i = 0, chart = {}, tpl = '', chartOpts = {}, optionalParams = {}, extendedOpts = {};
        var $chartContainer = $('#chartContainer').empty(),
            chartTpl = '<div id="<chartId>" class="chart"></div>'; 
        
        for (; i < chartsLength; i++) {
            chart = charts[i];
            tpl = chartTpl.replace(/<chartId>/g, chart.id);
            $chartContainer.append(tpl);
            
            chartOpts = {
                container : chart.id, 
                widgetType : chart.widgetType,
                chartType : chart.chartType,
                chartData : chartData, //chart.chartData, //TODO: It can provide the detailed data set for the detailed chart.
                chartConfig : configs[chart.id] || {}
            };
            optionalParams = {title : {'text' : 'demo ' + i}};
            extendedOpts = {
                editHandle : function (chartOpts, optionalParams) {
                    console.log('invoke editHandle.');
                },
                closeHandle : function (chartOpts, optionalParams) {
                    console.log('invoke closeHandle.');
                }
            };
            gschartsTool.renderExtendedChart(chartOpts, optionalParams, extendedOpts);
        }
    }
    
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
                    // renderDataEditor(chartRecord.chartData);
                }
            }
        });

        renderLocalChart();
    }
    
    return {
        fabricate : fabricate
    }
});