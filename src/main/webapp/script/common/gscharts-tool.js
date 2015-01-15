define(['gscharts', 'gsdata', 'underscore'], function (gscharts, gsdata) {
	var _chartTypes = ['line', 'spline', 'bar', 'column', 'area', 'areaspline', 'pie', 'columnrange', 'arearange', 'scatter', 'bubble'];
	
	//deal with the null chartConfig
	function _preprocess(options) {
		var chartRecord = options.chartRecord || {}, chartConfig = options.chartConfig || {}, yAxes = chartConfig.yAxes || [];
		
		//To handle the situation about that the chartConfig is null; 
		if (_.isEmpty(chartConfig)) {
			var chartData = chartRecord.chartData || {}, list = chartData.rows || [], temp = [], targetIndex = null;
			if (list.length > 0) {
				temp = list[0];
				for (var i = 0; i < temp.length; i++) {
					if (Number(temp[i])) {
						targetIndex = i;
						break;
					}
				}
				targetIndex = targetIndex || 0;
				options.chartConfig = {'xAxes' : [], 'yAxes' : [targetIndex], 'series' : []};
			} else {
				options.chartConfig = {'xAxes' : [], 'yAxes' : [], 'series' : []};
			}
		}
	}
	
	function _generateDialog(options) {
		var chartRecord = options.chartRecord || {}, chartConfig = options.chartConfig || {},
			$container = $( '#' + options.dialogCon).empty().removeData(),
			chartData = chartRecord.chartData || {},
			columnTpls = [], columns = chartData.columns || [], length = columns.length, i = 0,
			xAxesTpls = [], yAxesTpls = [], seriesTpls = [], chartTypes = [], 
			temp = null, tempTpl = '';
		
		//set the dialog's default state;
		for (; i < length; i++) {
			columnTpls.push('<h5 class="customize-plot-field" index="' + i + '">' + columns[i] + '</h5>');
		}
		chartTypes = _.map(_chartTypes, function (value, index, listObj) {
			var selectedTpl = (value === chartRecord.chartType) ? 'selected="selected"' : ''; 
			return '<option ' + selectedTpl + '>' + value + '</option>';
		});
		
		for (i = 0; i < chartConfig.xAxes.length; i++) {
			temp = chartConfig.xAxes[i];
			tempTpl = '<h5 class="droppable-item"><span class="droppable-item-content" index="' + temp + '" order="'+ i + '">' + columns[temp] + '</span><button type="button" class="close"></button></h5>';
			xAxesTpls.push(tempTpl);
		}
		for (i = 0; i < chartConfig.yAxes.length; i++) {
			temp = chartConfig.yAxes[i];
			tempTpl = '<h5 class="droppable-item"><span class="droppable-item-content" index="' + temp + '" order="'+ i + '">' + columns[temp] + '</span><button type="button" class="close"></button></h5>';
			yAxesTpls.push(tempTpl);
		}
		for (i = 0; i < chartConfig.series.length; i++) {
			temp = chartConfig.series[i];
			tempTpl = '<h5 class="droppable-item"><span class="droppable-item-content" index="' + temp + '" order="'+ i + '">' + columns[temp] + '</span><button type="button" class="close"></button></h5>';
			seriesTpls.push(tempTpl);
		}

		var tpl = [
			'<div class="modal fade customize-plot" id="gschart-customize-plot" tabindex="-1" role="basic" aria-hidden="true">                          ',
			'	<div class="modal-dialog modal-lg">                                                                                                     ',
			'		<div class="modal-content">                                                                                                         ',
			'			<div class="modal-header">                                                                                                      ',
			'				<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>                                       ',
			'				<h4 class="modal-title">定制图表</h4>                                                                                       ',
			'			</div>                                                                                                                          ',
			'			<div class="modal-body">                                                                                                        ',
			'				<div class="row">                                                                                                           ',
			'					<div class="col-md-6 col-sm-12">                                                                                        ',
			'						<div class="row">                                                                                                   ',
			'							<div class="col-md-6 col-sm-12">                                                                                ',
			'								<h4>选择列：</h4><div class="customize-plot-item customize-plot-fields">' + columnTpls.join('') + '</div>   ',
			'							</div>                                                                                                          ',
			'							<div class="col-md-6 col-sm-12 customize-plot-draggableZone">                                                                                ',
			'								<h4>xAxes：</h4><div maxLimit="1" class="customize-plot-item customize-plot-xAxes">' + xAxesTpls.join('') + '</div>     	',
			'								<h4>yAxes：</h4><div maxLimit="3" class="customize-plot-item customize-plot-yAxes">' + yAxesTpls.join('') + '</div>      ',                                            
			'								<h4>series：</h4><div maxLimit="1" class="customize-plot-item customize-plot-series">' + seriesTpls.join('') + '</div>   ',                                              
			'							</div>                                                                                                          ',
			'						</div>                                                                                                              ',
			'					</div>                                                                                                                  ',
			'					<div class="col-md-6 col-sm-12">                                                                                        ',
			'						<div class="customize-plot-chart" id="gschart-customizePlotChart"></div>                                            ',
			'					</div>                                                                                                                  ',
			'				</div>                                                                                                                      ',
			'				<div class="row" style="margin-top: 10px;">                                                                                                           ',
			'					<div class="col-md-6 col-sm-12">                                                                                        ',
			'						<h4 style="width: 20%; display: inline-block;">报表类型：</h4>                                                      ',
			'						<select id="customize-plot-charttype" class="form-control" style="width: 79.25%; display: inline-block;">           ',
										chartTypes.join(''),
			'						</select>  																											',                                                                               
			'					</div>                                                                                                                  ',
			'					<div class="col-md-6 col-sm-12"></div>                                                                                  ',
			'				</div>                                                                                                                      ',
			'			</div>                                                                                                                          ',
			'			<div class="modal-footer" style="margin-top:0;">                                                                                ',
			'				<button id="modalSaveBtn" type="button" class="btn blue" data-dismiss="modal">保存</button>                                                ',
			'				<button type="button" class="btn default" data-dismiss="modal">关闭</button>                                                ',
			'			</div>                                                                                                                          ',
			'		</div>                                                                                                                              ',
			'	</div>                                                                                                                                  ',
			'</div>                                                                                                                                     '
		].join('');
		$container.append(tpl);
	}

	function _activeInteractions(options) {
		var chartRecord = options.chartRecord || {}, chartConfig = options.chartConfig || {};
		var $customizePlot = $('#gschart-customize-plot');
		
		$('#modalSaveBtn', $customizePlot).on('click', function (e) {
			options.callback && options.callback(options);
		});
		
		$('#customize-plot-charttype', $customizePlot).on('change', function (e) {
			var $this = $(this);
			chartRecord.chartType = $this.val();
			_updateChart(chartRecord, chartConfig);
		});
		
		//The listener which is listening to remove exist draggableZone items
		$('.customize-plot-draggableZone', $customizePlot).on('click', '.close', function (e) {
			var $this = $(this), $removeItem = $this.prev(), $container = $this.closest('.customize-plot-item'),
				order = $removeItem.attr('order');
			$this.closest('h5').remove();
			
			if ($container.hasClass('customize-plot-xAxes')) {
				chartConfig.xAxes.splice(order);
			} else if ($container.hasClass('customize-plot-yAxes')) {
				chartConfig.yAxes.splice(order);
			} else { //customize-plot-series
				chartConfig.series.splice(order);
			}
			_updateChart(chartRecord, chartConfig);
		});
		
		//active draggable and droppable Interactions
		$('.customize-plot-fields .customize-plot-field', $customizePlot).draggable({
			appendTo : '#gschart-customize-plot',
			helper : 'clone'
			// ,stop: function( event, ui ) {}
		});
		$('.customize-plot-xAxes, .customize-plot-yAxes, .customize-plot-series', $customizePlot).droppable({
			activeClass: 'ui-state-default',
			hoverClass: 'ui-state-hover',
			accept: ':not(.ui-sortable-helper)',
			drop: function (event, ui) {
				var index = ui.draggable.attr('index'), text = ui.draggable.text(),
					maxLimit = this.getAttribute('maxLimit'), $this = $(this), $previousNode = null;
					length = this.children.length, tpl = '';
				
				if (this.children.length < maxLimit) {
					$this.find('.placeholder').remove();
					tpl = '<h5 class="droppable-item"><span class="droppable-item-content" index="' + index + '" order="'+ length + '">' + text + '</span><button type="button" class="close"></button></h5>';
					$(tpl).appendTo(this);
					
					if ($this.hasClass('customize-plot-xAxes')) {
						chartConfig.xAxes.push(index);
					} else if ($this.hasClass('customize-plot-yAxes')) {
						chartConfig.yAxes.push(index);
					} else { //customize-plot-series
						chartConfig.series.push(index);
					}
					_updateChart(chartRecord, chartConfig);
				} else {
					$previousNode = $this.prev();
					if ($previousNode.find('.alert-warning').length <= 0) {
						tpl = [
							'<div class="alert alert-warning alert-dismissible" role="alert">',
							'	<strong>注意：</strong> 限制数目为' + maxLimit,
							'	<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>  ',
							'</div>'
						].join('');
						$previousNode.append(tpl);
						setTimeout(function () {
							$previousNode.find('.alert-warning').remove();
						}, 1000);
					}
				}
			}
		}).sortable({
		  items: 'h5:not(.placeholder)',
		  sort: function() {
			// gets added unintentionally by droppable interacting with sortable
			// using connectWithSortable fixes this, but doesn't allow you to customize active/hoverClass options
			$(this).removeClass( 'ui-state-default' );
		  }
		});
	}
	
	function _updateChart(chartRecord, chartConfig) {
		var chartOpts = {
			container : 'gschart-customizePlotChart', 
			widgetType : chartRecord.widgetType,
			chartType : chartRecord.chartType,
			chartData : chartRecord.chartData,
			chartConfig : chartConfig
		};
		gscharts.renderChart(chartOpts);
	}
	
	function _customizePlot(options) {
		options.chartRecord.chartData = $.extend(true, {}, gsdata.chartData); //simulated data
		options = $.extend(true, {}, options);
		_preprocess(options);
		_generateDialog(options);
		//Note: The modal method is asynchronous mode. It should use the event "shown.bs.modal" listener to monitor. 
		//Because highcharts can't get the size of container before modal have been shown.			
		$('#gschart-customize-plot').modal('show').off('shown.bs.modal').on('shown.bs.modal', function (e) {
			var chartRecord = options.chartRecord || {}, chartConfig = options.chartConfig || {};
			_activeInteractions(options);
			_updateChart(chartRecord, chartConfig);
		});
	}
    
    /*
     *   Render extended chart , as follow.
    */
    function _extendToWidget(chartOpts, optionalParams) {
        var chartId = chartOpts.container;
        var chartTypes = _.map(_chartTypes, function (value, index, list) {
			// var selectedTpl = (value === chartRecord.chartType) ? 'selected="selected"' : ''; 
            return '<li><a href="javascript:void(0)" class="btn-gsconfig chartType" chartType="' + value + '">' + value + '</a></li>';
		});
        var widgetTpl = [
            // '<div id="<widgetId>" class="gswidget">', 
                '<div class="gswidget-tool">',
                    '<button type="button" class="btn btn-default gswidget-tool-btn"><i class="fa fa-cog"></i></button>',
                    '<button type="button" class="btn btn-default gswidget-tool-btn"><i class="fa fa-edit"></i></button>',
                    '<button type="button" class="btn btn-default gswidget-tool-btn"><i class="fa fa-close"></i></button>',
                '</div>',
                '<div class="gswidget-config">',
                    '<div class="btn-group"> ',
                    '  <button type="button" class="btn btn-default btn-gsconfig table-mode"><i class="fa fa-table"></i></button>',
                    '	<div class="btn-group">                                                                                       ',
                    '	  <button type="button" class="btn btn-default btn-gsconfig chart-mode"><i class="fa fa-bar-chart-o"></i></button>  ',
                    '	  <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false"> ',
                    '		<span class="caret"></span>                                                                               ',
                    '	  </button>                                                                                                   ',
                    '	  <ul class="dropdown-menu gscolumns"> ', /*pull-right*/
                            chartTypes.join(''),
                    '	  </ul> ',
                    '	</div> ',
                    '</div>',
                    '<div class="btn-group plotOptions"> ',
                    '  	<button type="button" class="btn btn-default btn-gsconfig options-mode">options</button>',
                    '</div> ',
                '</div>',
                '<div class="gswidget-table">',
                    '<table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered table-hover"></table>',
                '</div>',
                '<div class="gswidget-chart gswidget-subitem-shown">',
                    '<div id="gswidget_content_<widgetId>" class="gswidget-chart-container"></div>',
                '</div>'
            // '</div>'
        ].join('');
        widgetTpl = widgetTpl.replace(/<widgetId>/g, chartId);
        $('#' + chartId).empty().addClass('gswidget').append(widgetTpl);
    }
    
    function _renderExtendedChart(chartOpts, optionalParams) {
        
        _extendToWidget(chartOpts, optionalParams);
        
        chartOpts.container = 'gswidget_content_' + chartOpts.container;
        gscharts.renderChart(chartOpts, optionalParams);
        
    }
	
	return {
		customizePlot : _customizePlot,
        renderExtendedChart : _renderExtendedChart
	};
});