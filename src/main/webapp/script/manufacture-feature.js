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
                editHandle : function (event, chartOpts, optionalParams) {
                    console.log('invoke editHandle.');
                    renderHTDataEditor(event, chartOpts, optionalParams);
                },
                closeHandle : function (event, chartOpts, optionalParams) {
                    console.log('invoke closeHandle.');
                }
            };
            gschartsTool.renderExtendedChart(chartOpts, optionalParams, extendedOpts);
        }
    }
    
    //transform data for null value;(预处理null值为空字符串)
    function getCleanTableData(data) {
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
                continue;
            }
        }
        return result;
    }
    
    function renderHTDataEditor(event, chartOpts, optionalParams) {
        $('#sidebar').removeClass('sidebar-hidden');
        $('#sidebarContent').empty().append('<div id="handsontable" class="handsontable"></div>');
        $('#main').removeClass().addClass('col-sm-8 col-sm-offset-4 col-md-8 col-md-offset-4 main');
        // due to different scale screen, It need to rerender.
        // renderLocalChart();
        
        //Todo: It should get chartdata from detail chart, e.g., $('#chartId').data('gsData');
        var chartData = chartOpts.chartData, sourceData = [], height = $('#sidebarContent').css('height'),
            $gswidget = $(event.delegateTarget);
        chartData = $.extend(true, {}, chartData);
        if (chartData.rows.length > 0) {
            sourceData = sourceData.concat([chartData.columns], chartData.rows);
        }
        
        $('#handsontable').handsontable({
            data: sourceData,
            minRows : 50,
            minCols : 12,
            minSpareRows : 1,
            minSpareCols : 1,
            stretchH : "last",
            copyRowsLimit : 3e3,
            copyColsLimit : 3e3,
            manualColumnResize: true,
            manualRowResize: true,
            rowHeaders: true,
            colHeaders: true,
            contextMenu: true,
            height : parseFloat(height) //must set the height value for it's own scoller bar.
        }); 
        
        // $('#handsontable').handsontable('loadData', data);
        var instance = $('#handsontable').handsontable('getInstance');
        instance.addHook('afterChange', function(changes, source) {
            var changesData = instance.getData();
            changesData = getCleanTableData(changesData);
            changesData = changesData.concat();
            chartOpts.chartData = {
                columns : changesData.shift() || [],
                rows : changesData
            };
            
            gscharts.renderChart(chartOpts, optionalParams);
        });
    }
    
    function fabricate () {
        $('#closeSidebar').on('click', function (e) {
            var $sidebar = $('#sidebar').addClass('sidebar-hidden');
            $('#main').removeClass().addClass('col-sm-12 col-md-12 main');
            // due to different scale screen, It need to rerender.
            // renderLocalChart();
        });
        
        $('#navbar').on('click', '.chart-handle', function (e) {
            var $this = $(this);
            if ($this.hasClass('chart-handle-add')) {
                var chartId = 'new_chart_' + new Date().getTime();
                var chartOpts = {
                    container : chartId, 
                    widgetType : 'highcharts',
                    chartType : 'line',
                    chartData : gsdata.chartData,
                    chartConfig : {'xAxes' : [1], 'yAxes' : [2], 'series' : [0]}
                },
                optionalParams = {title : {'text' : 'new demo'}};
                gschartsTool.chooseChart(chartOpts, optionalParams, {
                    'title' : '添加报表',
                    'callback' : function (chartOpts, optionalParams) {
                        $('#chartContainer').append('<div id="' + chartId +'" class="chart"></div>');
                        var extendedOpts = {
                            editHandle : function (event, chartOpts, optionalParams) {
                                console.log('invoke editHandle.');
                                renderHTDataEditor(event, chartOpts, optionalParams);
                            },
                            closeHandle : function (event, chartOpts, optionalParams) {
                                console.log('invoke closeHandle.');
                            }
                        };
                        gschartsTool.renderExtendedChart(chartOpts, optionalParams, extendedOpts);
                    }
                });
            } else if ($this.hasClass('chart-handle-save')) {
                console.log('save chart.');
            }
        });

        renderLocalChart();
    }
    
    return {
        fabricate : fabricate
    }
});