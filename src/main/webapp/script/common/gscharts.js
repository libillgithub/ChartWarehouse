define(['highcharts', 'underscore'], function () {
	var defaultOption = {
			title: {
				text: ''
			},
			credits: {
				enabled: false
			},
			tooltip: {
				// valueSuffix: ' customize'
				// pointFormat: '{series.name} produced <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
			}
		}, 
		defaultPlotOptions = {
            area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                    lineWidth: 1,
                    lineColor: '#666666'
                }
            },
			areaspline: {
                fillOpacity: 0.5
            },
			pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                },
				slicedOffset : 20
				/*,showInLegend: true
                ,startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%'] */
            },
			columnrange: {
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        return this.y;//+ '°C';
                    }
                }
            }
        };
	
	//deal with transforming between different charts
	function _preprocess(option, chartOpts) {
		var chartType = chartOpts.chartType || 'line',
			chartConfig = chartOpts.chartConfig || {}, yAxes = chartConfig.yAxes || [];
		
		//To handle the situation about that the chartConfig is null; 
		if (_.isEmpty(chartConfig)) {
			var chartData = chartOpts.chartData || {}, list = chartData.rows || [], temp = [], targetIndex = null;
			if (list.length > 0) {
				temp = list[0];
				for (var i = 0; i < temp.length; i++) {
					if (Number(temp[i])) {
						targetIndex = i;
						break;
					}
				}
				targetIndex = targetIndex || 0;
				chartOpts.chartConfig = {'xAxes' : [], 'yAxes' : [targetIndex], 'series' : []};
				yAxes = chartOpts.chartConfig.yAxes;
			} else {
				chartOpts.chartConfig = {'xAxes' : [], 'yAxes' : [], 'series' : []};
			}
		}
		
		if (chartType === 'scatter' || chartType === 'bubble') {
			if (yAxes.length === 1) {
				if (chartType === 'bubble') {
					yAxes.push(yAxes[0], yAxes[0]);
				} else {
					yAxes.push(yAxes[0]);
				}
			} else if (yAxes.length === 2 && chartType === 'bubble') {
				yAxes.push(yAxes[1]);
			} else if (yAxes.length === 3 && chartType === 'scatter') {
				yAxes.pop();
			}
		} else if (chartType === 'columnrange' || chartType === 'arearange') {
			if (yAxes.length === 1) {
				yAxes.unshift('noneExist');
			} else if (yAxes.length === 3) {
				yAxes.pop();
			}
		} else {
			if (yAxes.length > 1) {
				chartConfig.yAxes = [yAxes[0]];
			}
		}
	}
	
	//get series, get xAxis's of series, get set of xAxis(Note: default xAsix and series's max number is one, yAsix's max number is three)
	function _prepareOption(option, chartOpts) {
		var chartType = chartOpts.chartType || 'line',
			chartData = chartOpts.chartData || {}, list = chartData.rows || [],
			chartConfig = chartOpts.chartConfig || {}, yAxes = chartConfig.yAxes || [],
			xAxes = chartConfig.xAxes || [], series = chartConfig.series || [], 
			seriesCol = series[0], withSeries = series.length > 0, seriesColVal = null, 
			xAxisCol = xAxes[0], withxAxis = xAxes.length > 0, xAxisColVal = null,
			
			existSeries = {}, seriesResult = [], seriesWithCatas = {},
			existCategories = {}, catagoriesResult = [], catagoriesObj = {}, //record all catagories.
			length = list.length || 0, i = 0, temp = {}, defaultValue = 0,
			xAxisType = withxAxis ? 'category' : 'linear'; //Other way: catagoriesResult.length > 0
			
		if (yAxes.length === 2) {
			defaultValue = [0, 0];
		} else if (yAxes.length === 3) {
			defaultValue = [0, 0, 0];
		}
		
		if (chartType === 'scatter' || chartType === 'bubble') { // scatter chart only have series and yAsex, xAsix can't work in this chart.
			withxAxis = false;
			xAxisType = 'linear';
		}
		
		for (; i < length; i++) {
			//Todo : check each column type
			temp = list[i];
			if (withSeries) {
				seriesColVal = temp[seriesCol];
				existSeries[seriesColVal] || seriesResult.push(seriesColVal);
				existSeries[seriesColVal] = true;
				
				if (withxAxis) {
					xAxisColVal = temp[xAxisCol];
					existCategories[xAxisColVal] || (catagoriesResult.push(xAxisColVal) && (catagoriesObj[xAxisColVal] = defaultValue));
					existCategories[xAxisColVal] = true;
					/* if (seriesWithCatas[seriesColVal]) {
						seriesWithCatas[seriesColVal].push(xAxisColVal);
					} else {
						seriesWithCatas[seriesColVal] = [xAxisColVal];
					} */
				}
			} else {
				if (withxAxis) {
					xAxisColVal = temp[xAxisCol];
					existCategories[xAxisColVal] || (catagoriesResult.push(xAxisColVal) && (catagoriesObj[xAxisColVal] = defaultValue));
					existCategories[xAxisColVal] = true;
				}
			}
		}
		
		option.preparedOptions = {
			'seriesResult' : seriesResult,
			'catagoriesResult' : catagoriesResult,
			'catagoriesObj' : catagoriesObj,
			'seriesWithCatas' : seriesWithCatas,
			'xAxisType' : xAxisType,
			'withxAxis' : withxAxis,
			'withSeries' : withSeries
		};
	}
	
	function _addPlotOptions(option, chartOpts) {
		var chartType = chartOpts.chartType || 'line';
		option.plotOptions = {};
		defaultPlotOptions[chartType] && (option.plotOptions[chartType] = defaultPlotOptions[chartType]);
	}
	
	function _addxAxis(option, chartOpts) {
		var preOptions = option.preparedOptions, xAxis = {};
		
		if (preOptions.withxAxis) {
			xAxis.categories = preOptions.catagoriesResult;
		}
		xAxis.type = preOptions.xAxisType;
		option.xAxis = xAxis;
	}
	
	function _addyAxis(option, chartOpts) {
		option.yAxis = {
			title: {
				text: 'customize' //customize
			}
		};
	}
	
	function _addSeries(option, chartOpts) { //Note: four situation about series and xAxis's combination
		var chartType = chartOpts.chartType || 'line', chartData = chartOpts.chartData || {}, rows = chartData.rows || [],
			chartConfig = chartOpts.chartConfig || {}, xAxisCol = chartConfig.xAxes[0], seriesCol = chartConfig.series[0], 
			yAxes = chartConfig.yAxes || [], optionSeries = [], preOptions = option.preparedOptions,
			seriesArray = preOptions.seriesResult, categories = preOptions.catagoriesResult;
		
		var aggregate = function (type, leftOper, rightOper) { //This is the default aggregate function for the yAsix value which has the same xAsix value.
			var result = rightOper;
			if (leftOper.length === undefined) {
				result = leftOper + rightOper;
			} else if (leftOper.length === 2) {
				result = [leftOper[0] + rightOper[0], leftOper[1] + rightOper[1]];
			} else if (leftOper.length === 3) {
				result = [leftOper[0] + rightOper[0], leftOper[1] + rightOper[1], leftOper[2] + rightOper[2]];
			}
			return result;
		};
		
		if (preOptions.withSeries) {
			if (preOptions.withxAxis) { //WithSeries && With xAxis, 'result' include all the yAxis values that match the series value and xAxis value; (using aggregate defaultly)
				optionSeries = _.map(seriesArray, function (value, index, listObj) {
					var i = 0, length = rows.length, temp = {}, result = [], yAxisValue = null, existCatagories = {},
						categoriesJson = $.extend({}, preOptions.catagoriesObj);
					for (; i < length; i++) {
						temp = rows[i];
						if (temp[seriesCol] === value && (temp[xAxisCol] in categoriesJson)) {
							if (yAxes.length === 1) {
								yAxisValue = Number(temp[yAxes[0]]) || 0;
							} else if (yAxes.length === 2) {
								yAxisValue = [Number(temp[yAxes[0]]) || 0, Number(temp[yAxes[1]]) || 0];
							} else {// if (yAxes.length === 3) 
								yAxisValue = [Number(temp[yAxes[0]]) || 0, Number(temp[yAxes[1]]) || 0, Number(temp[yAxes[2]]) || 0];
							}
							categoriesJson[temp[xAxisCol]] = existCatagories[temp[xAxisCol]] ? aggregate('sum', categoriesJson[temp[xAxisCol]], yAxisValue) : yAxisValue; // 这里可以做同一个x值对应的y值的聚合
							existCatagories[temp[xAxisCol]] = true;
						}
					}
					for (var key in categoriesJson) {//Note: be careful for the order of the json loop iteration.
						if (chartType === 'pie') { //Note: use all series's catagories union set, not the each series owner catagories.
							result.push([key, categoriesJson[key]]);
						} else if (chartType === 'columnrange') {
							result.push(categoriesJson[key] && categoriesJson[key].sort());
						} else {
							result.push(categoriesJson[key]);
						}
					}
					
					return {
						name : value,
						data : result
					};
				});
			} else {  //WithSeries && Without xAxis, 'result' include all the yAxis values that match the series value;
				optionSeries = _.map(seriesArray, function (value, index, listObj) {
					var i = 0, length = rows.length, temp = {}, result = [], yAxisValue = null;
					for (; i < length; i++) {
						temp = rows[i];
						if (temp[seriesCol] === value) {
							if (yAxes.length === 1) {
								yAxisValue = Number(temp[yAxes[0]]) || 0;
							} else if (yAxes.length === 2) {
								yAxisValue = [Number(temp[yAxes[0]]) || 0, Number(temp[yAxes[1]]) || 0];
							} else {// if (yAxes.length === 3) 
								yAxisValue = [Number(temp[yAxes[0]]) || 0, Number(temp[yAxes[1]]) || 0, Number(temp[yAxes[2]]) || 0];
							}
							if (chartType === 'pie') {
								result.push(['value' + i, yAxisValue]); //or result.push(yAxisValue);
							} else if (chartType === 'columnrange') {
								result.push(yAxisValue && yAxisValue.sort());
							} else {
								result.push(yAxisValue);
							}
						}
					}
					
					return {
						name : value,
						data : result
					};
				});
			}
		} else {
			if (preOptions.withxAxis) { //WithoutSeries && With xAxis, 'result' include all the yAxis values that match xAxis value; (using aggregate defaultly)
				var i = 0, length = rows.length, temp = {}, result = [], yAxisValue = null, existCatagories = {},
					categoriesJson = $.extend({}, preOptions.catagoriesObj);
				for (; i < length; i++) {
					temp = rows[i];
					if (temp[xAxisCol] in categoriesJson) {
						if (yAxes.length === 1) {
							yAxisValue = Number(temp[yAxes[0]]) || 0;
						} else if (yAxes.length === 2) {
							yAxisValue = [Number(temp[yAxes[0]]) || 0, Number(temp[yAxes[1]]) || 0];
						} else {// if (yAxes.length === 3) 
							yAxisValue = [Number(temp[yAxes[0]]) || 0, Number(temp[yAxes[1]]) || 0, Number(temp[yAxes[2]]) || 0];
						}
						categoriesJson[temp[xAxisCol]] = existCatagories[temp[xAxisCol]] ? aggregate('sum', categoriesJson[temp[xAxisCol]], yAxisValue) : yAxisValue; // 这里可以做同一个x值对应的y值的聚合
						existCatagories[temp[xAxisCol]] = true;
					}
				}
				for (var key in categoriesJson) { //Note: be careful for the order of the json loop iteration.
					if (chartType === 'pie') {
						result.push([key, categoriesJson[key]]);
					} else if (chartType === 'columnrange') {
						result.push(categoriesJson[key] && categoriesJson[key].sort());
					} else {
						result.push(categoriesJson[key]);
					}
				}
				
				optionSeries = [
					{
						name : 'none series',
						data : result
					}
				];
			} else {//WithoutSeries && Without xAxis, 'result' include all the yAxis values
				var i = 0, length = rows.length, temp = {}, result = [], yAxisValue = null;
				for (; i < length; i++) {
					temp = rows[i];
					if (yAxes.length === 1) {
						yAxisValue = Number(temp[yAxes[0]]) || 0;
					} else if (yAxes.length === 2) {
						yAxisValue = [Number(temp[yAxes[0]]) || 0, Number(temp[yAxes[1]]) || 0];
					} else {// if (yAxes.length === 3) 
						yAxisValue = [Number(temp[yAxes[0]]) || 0, Number(temp[yAxes[1]]) || 0, Number(temp[yAxes[2]]) || 0];
					}
					if (chartType === 'pie') {
						result.push(['value' + i, yAxisValue]); //or result.push(yAxisValue);
					} else if (chartType === 'columnrange') {
						result.push(yAxisValue && yAxisValue.sort());
					} else {
						result.push(yAxisValue);
					}
				}
				
				optionSeries = [
					{
						name : 'none series',
						data : result
					}
				];
			}
		}
		
		option.series = optionSeries;
	}
	
	function _generateOption(chartOpts) {
		var widgetType = chartOpts.widgetType || 'highcharts',
			chartType = chartOpts.chartType || 'line';
		
		var option = $.extend(true, {}, defaultOption);
		option.chart = {type : chartType};
		chartOpts = $.extend(true, {}, chartOpts);
		
		_preprocess(option, chartOpts);
		_prepareOption(option, chartOpts);
		_addPlotOptions(option, chartOpts);
		if (chartType !== 'pie') {
			_addxAxis(option, chartOpts);
			_addyAxis(option, chartOpts);
		}
		_addSeries(option, chartOpts);
		return option;
	}
	
	function renderChart(chartOpts) {
		var container = chartOpts.container,
			chartType = chartOpts.chartType || 'line',
			option = {};
		
		// chartOpts.chartData = $.extend(true, {}, gsdata.chartData); //simulated data
		option = _generateOption(chartOpts);
		option.title =  {
			text: chartType, //+ ' Chart: ' + container
		};
		console.dir(option);
		
		$('#' + container).highcharts(option);
	}
	
	return {
		renderChart : renderChart
	};
});