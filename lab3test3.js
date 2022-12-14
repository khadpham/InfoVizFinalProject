$(function () {
    var ncol = 2;
	var x = $('#displayarea').width();
	var w = Math.floor(x/ncol);	
	var h = Math.floor(w*9/16);
	$(document).ready(function() {
        document.title = "InfoViz Final Project: KDP";
		var year = 2014;
		var start = 1965;
		var finish = 2020;
		var seriesPath = 'https://gist.githubusercontent.com/khadpham/26ee27c053eba2ee940d5b43cf849b79/raw/maps.json';
		localStorageTest();
		clearStorage();
	
		$('#displayarea').append('<div id="year1" class="year"></div>');
		$('#year1').css('height', h+'px');
		$('#year1').css('width', w+'px');
		$('#year1').css('left',  0+'px');
		$('#year1').css('top', (14+h)*0+'px');
	
		// addMapMenuItems(start, finish);
		addSlider(start, finish, year);
		runSeries(start, finish, year);
		getMapSeries(year, seriesPath);
	
		function prepMapData(year){
			// Prepare data
	
			var allData = getObject('allData');
			var selectedData = [];
			// OECD series runs from 1980 =>
	
			for (var i=0; i<allData.length; i++){
				// need to generate: {"iso-a3": "xxx", "value": nnnnn}
				selectedData.push({"iso-a3":allData[i][0].iso3, "value":allData[i][0].data[year-1965]});
				//console.log({"iso-a3":allData[i][0].iso3, "value":allData[i][0].data[year-1980]});
			};
			//console.log(JSON.stringify(selectedData));
			return selectedData;
		};
	
		function drawMap(year, selectedData){
			// Initiate the chart
			$('#year1').highcharts('Map', {
				title: {
					text: 'Natural Gas Consumption in Europe '+year,
                    style: {fontSize: '20px'},
				},
	
				subtitle: {
					text: 'Source map: <a href="https://code.highcharts.com/mapdata/custom/europe.js">Europe</a>'
				},
	
				mapNavigation: {
					enabled: true,
					buttonOptions: {
						verticalAlign: 'top',
                        // align: 'left'
					}
				},
				credits: { enabled: false},
				legend: {
					layout: 'vertical',
					align: 'left',
					verticalAlign: 'bottom',
				},
				colorAxis: {
					min: 100,
					max: 900,
					minColor: '#FFFFFF',
					maxColor: '#DC3220',
				},
	
				series: [{
					data: selectedData,
					mapData: Highcharts.maps['custom/europe'],
					joinBy: 'iso-a3',
					name: 'Natural Gas Consumption '+year,
					states: {
						hover: {
							color: 'palegreen'
						}
					},
					dataLabels: {
						enabled: false,
						format: '{point.name}'
					}
				}]
			});
		};
	
		// function addMapMenuItems(start, finish){
		// 	var startTag = '<input type="radio" name="selectYear"';
		// 	var endTag = '</input>';
		// 	$('#menubox2').empty();
		// 	$('#menubox2').append('<h3>Year to display</h3>');
		// 	$('#menubox2').append('<button type="button" id="yearListSelect">Display</button>');
		// 	$('#menubox2').append('<br />');
		
		// 	$('#yearListSelect').on( 'click', function() {
		// 		$('#displayarea2').empty();
		// 		var year = $('input[name="selectYear"]:checked').val();
		// 		console.log('84', year)
		// 		selectedData = prepMapData(year);
		// 		drawMap(year, selectedData);
		// 	});
		
		// 	for (i=start; i<=finish; i++){
		// 		if (i%2){
		// 			var button = startTag+'value="'+i+'">'+i+endTag+'<br />';
		// 		} else {
		// 			var button = startTag+'value="'+i+'">'+i+endTag;
		// 		};
		// 		$('#menubox2').append(button);
		// 	};
		// };
	
		function getMapSeries(year, seriesPath){
		// fetch the series data from the server
			console.log('getting series '+seriesPath);
			$.getJSON(seriesPath, function (data) {
				//console.log(seriesPath, JSON.stringify(data));
				clearObject('allData');
				setObject('allData', data);
				drawMap(year, prepMapData(year));
			})
			.fail(function(jqXHR, textStatus, errorThrown) { 
				console.log('getJSON request failed! ' + textStatus); 
			});	
		};
		
		function addSlider(start, finish, year) {
			console.log(start, finish, year);
			$('#sliderbox').empty();
			$('#sliderbox').append('<div id="slider"></div>');
			$('#sliderbox').append('<div id="sliderStartVal"></div>');
			$('#sliderbox').append('<div id="sliderEndVal"></div>');
			$('#sliderStartVal').append(start);
			$('#sliderEndVal').append(finish);
	
			$('#slider').append('<div id="custom-handle" class="ui-slider-handle"></div>');
			//$('#sliderbox').append(finish);
			var handle = $('#custom-handle');
			$('#slider').slider({
				min: start,
				max: finish,
				value: year,
				create: function() {
					handle.text($(this).slider('value') );
				},
				slide: function(event, ui) {
					handle.text(ui.value);
					//console.log (ui.value);
					drawMap(ui.value, prepMapData(ui.value));
				}
			});		
		};
	
		function runSeries(start, finish){
			$('#sliderbox').append('<button type="button" id="runSeries">&gtcc;</button>');
			$('#runSeries').on('click', function() {
				var i = start;
				var intervalID = setInterval(function () {
					addSlider(start, finish, i);
					drawMap(i, prepMapData(i));
					i++;
					if (i > finish){
						clearInterval(intervalID);
						// need to put the runSeries button back at the end
						runSeries(start, finish);
					}
				}, 100);
			});
		
		};
	});
	$(document).ready(function() {
		// calculate the space to leave on left and at top of chart
		$('#displayarea').append('<div id="year2" class="year"></div>');
		$('#year2').css('height', h+'px');
		$('#year2').css('width', w+'px');
		$('#year2').css('left',  (w) +'px');
		$('#year2').css('top',(14+h)*0+'px');
		var colors = Highcharts.getOptions().colors;
        var demand_uk = {
			chart: {
				type: 'area',
				zoomType: 'x',
			},
			title: {
				text: 'UK demand for natural gas',
				style: {fontSize: '30px'},
			},
			legend: {
				// layout: 'vertical',
				align: 'center',
				verticalAlign: 'top',
                style: {fontSize: '2em'},
				// x: 175,
				y: 60,
				floating: true,
				borderWidth: 1,
				backgroundColor:
					Highcharts.defaultOptions.legend.backgroundColor || '#FFFACD'
			},
			xAxis: {
				categories: ['2011 Q1','2011 Q2','2011 Q3','2011 Q4','2012 Q1','2012 Q2','2012 Q3','2012 Q4','2013 Q1','2013 Q2','2013 Q3','2013 Q4','2014 Q1','2014 Q2','2014 Q3','2014 Q4','2015 Q1','2015 Q2','2015 Q3','2015 Q4','2016 Q1','2016 Q2','2016 Q3','2016 Q4','2017 Q1','2017 Q2','2017 Q3','2017 Q4','2018 Q1','2018 Q2','2018 Q3','2018 Q4','2019 Q1','2019 Q2','2019 Q3','2019 Q4','2020 Q1','2020 Q2','2020 Q3','2020 Q4','2021 Q1','2021 Q2','2021 Q3','2021 Q4'],
				// plotBands: [{ // visualize the weekend
				// 	from: 4,
				// 	to: 4,
				// 	color: 'rgba(68, 170, 213, .2)'}],
				maxPadding: 0.05,
				// showLastLabel: true,
				tickInterval: 4, // one week
				tickWidth: 1,
				gridLineWidth: 2,
				labels: {
					align: 'left',
					x: 3,
					y: 15
				},
				tickmarkPlacement: 'on',
				title: {
					enabled: false
				}
			},
			yAxis: [{
				title: {
					text: 'TWh units',
					style: {fontSize: '20px'},
					x: -10,
					},
				
				labels: {
					align: 'left',
				},
				showFirstLabel: false
			},  { // right y axis
				linkedTo: 0,
				gridLineWidth: 0,
				opposite: true,
				title: {
					text: null
				},
				labels: {			
				},
				showFirstLabel: false
				}],

			tooltip: {
				split: true,
				valueSuffix: ' Twh',
				crosshairs: true,
				headerFormat: '<b>{point.x}</b><br/>',
		        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal} Twh'
			},
			credits: {
				enabled: false
			},
			plotOptions: {
				area: {stacking: 'normal'},
				series: {
					cursor: 'pointer',
					className: 'popup-on-click',
					marker: {
						lineWidth: 1
					}
				},
				},
			series: [{
				name: 'Domestic',
				data: [137.97,45.07,29.83,95.98,129.91,65.39,32.71,115.17,154.45,63.36,26.62,100.08,119.08,45.99,24.49,94.13,134.74,51.31,27.16,84.38,128.34,53.39,21.45,102.70,121.23,46.57,25.68,101.59,144.50,43.05,21.84,95.88,117.98,51.27,20.09,105.53,123.17,48.75,23.32,104.05,137.07,65.07,20.56,95.04]
			},	{
				name: 'Energy Generation',
				data: [108.67,101.42,100.62,93.88,83.38,75.56,68.20,76.11,83.47,72.54,62.61,71.83,71.16,71.36,80.49,79.41,76.98,72.98,76.04,81.65,98.03,93.12,89.11,109.80,104.05,88.63,83.90,100.38,102.94,87.96,81.07,94.03,101.57,89.92,80.04,95.46,81.54,70.89,81.47,89.12,92.02,81.50,79.02,84.99]
			}, 	{
				name: 'Industry',
				data: [38.41,20.49,17.62,28.21,35.10,21.36,15.90,30.22,37.16,20.88,18.03,28.92,34.92,19.91,17.69,28.11,34.89,19.04,17.30,26.66,34.81,20.40,17.38,27.96,35.61,20.47,18.40,28.58,36.28,20.88,18.67,28.36,36.18,20.68,18.22,28.09,34.52,15.96,17.40,26.93,33.75,18.88,20.08,27.05]
			},  {
				name: 'Other',
				data: [30.32,18.09,15.08,27.88,29.84,24.76,16.72,33.58,37.58,24.71,15.15,30.24,29.18,18.55,14.08,29.47,33.30,20.35,16.05,27.33,32.65,21.28,13.09,32.42,29.89,19.16,15.40,32.81,32.03,18.43,14.48,32.17,29.85,19.97,14.11,33.93,30.71,16.13,14.72,32.55,31.10,22.69,16.28,29.68]
			}]
		};
        var supply_uk = {
			chart: {
				type: 'line',
				zoomType: 'x',
			},
			title: {
				text: 'UK supply for natural gas',
				style: {fontSize: '30px'},
			},
			colors: [colors[0],
					colors[2],
					colors[8]],
			legend: {
				// layout: 'vertical',
				align: 'center',
				verticalAlign: 'top',
                style: {fontSize: '2em'},
				// x: 175,
				y: 60,
				floating: true,
				borderWidth: 1,
				backgroundColor:
					Highcharts.defaultOptions.legend.backgroundColor || '#FFFACD'
			},
			xAxis: {
				categories: ['2011 Q1','2011 Q2','2011 Q3','2011 Q4','2012 Q1','2012 Q2','2012 Q3','2012 Q4','2013 Q1','2013 Q2','2013 Q3','2013 Q4','2014 Q1','2014 Q2','2014 Q3','2014 Q4','2015 Q1','2015 Q2','2015 Q3','2015 Q4','2016 Q1','2016 Q2','2016 Q3','2016 Q4','2017 Q1','2017 Q2','2017 Q3','2017 Q4','2018 Q1','2018 Q2','2018 Q3','2018 Q4','2019 Q1','2019 Q2','2019 Q3','2019 Q4','2020 Q1','2020 Q2','2020 Q3','2020 Q4','2021 Q1','2021 Q2','2021 Q3','2021 Q4'],
				// plotBands: [{ // visualize the weekend
				// 	from: 4,
				// 	to: 4,
				// 	color: 'rgba(68, 170, 213, .2)'}],
				maxPadding: 0.05,
				// showLastLabel: true,
				tickInterval: 4, // one week
				tickWidth: 1,
				gridLineWidth: 2,
				labels: {
					align: 'left',
					x: 3,
					y: 15
				},
				tickmarkPlacement: 'on',
				title: {
					enabled: false
				}
			},
			yAxis: [{
				title: {
					text: 'TWh units',
					style: {fontSize: '20px'},
					x: -10,
					},
				
				labels: {
					align: 'left',
				},
				showFirstLabel: false
			},  { // right y axis
				linkedTo: 0,
				gridLineWidth: 0,
				opposite: true,
				title: {
					text: null
				},
				labels: {			
				},
				showFirstLabel: false
				}],

			tooltip: {
				split: true,
				valueSuffix: ' Twh',
				crosshairs: true,
				headerFormat: '<b>{point.x}</b><br/>',
		        pointFormat: '{series.name}: {point.y}'
			},
			credits: {
				enabled: false
			},
			plotOptions: {
				line: {
					lineWidth: 10,
					states: {
						hover: {lineWidth: 8}
					},
					marker: {
						enabled: false
					},
				},
				},
			series: [ 
                {name: 'Imports',data: [187.07,132.70,124.79,159.38,173.58,125.55,98.68,168.86,185.71,135.50,80.10,146.91,146.60,108.82,92.07,141.45,158.92,95.21,104.65,142.79,162.52,113.80,87.74,165.37,162.47,92.85,99.18,163.66,194.28,91.32,81.10,152.33,165.85,119.95,64.64,160.74,147.47,95.37,72.43,162.92,199.97,125.16,75.03,157.62]},
                {name: 'Indigenous Production',data: [146.73,127.40,101.19,136.04,128.43,110.76,89.43,106.32,109.77,108.90,86.89,104.90,112.35,105.34,91.18,106.64,112.57,118.54,99.30,121.03,118.59,112.60,110.39,121.74,124.55,120.19,98.06,122.18,119.31,111.86,104.74,115.25,111.78,105.56,96.99,120.46,115.44,115.75,97.41,109.73,99.59,68.90,86.80,107.83]},
                {name: 'Exports',data: [21.45,53.18,51.60,51.01,30.05,37.31,44.14,20.21,19.40,33.00,28.62,18.56,19.25,37.60,37.72,21.37,25.46,38.60,52.14,40.16,19.04,27.52,52.07,15.85,14.57,40.63,51.51,17.71,8.79,20.20,44.30,9.60,10.29,39.89,25.48,14.73,14.47,48.86,29.99,12.58,13.65,11.96,17.53,32.53]}
            ]
		};     
        var choosenData = demand_uk;
    	// add the charts
	    addMenuItems();
        makeChart(choosenData);
        
        function makeChart(choosenData){
          $('#year2').highcharts(choosenData);       
        };

        function addMenuItems(){
            $('#menubox').empty();
            //add the select button
            //$('#menubox').append('<button name="select" onclick="getMenuChoices()">Select series</button> ');
            $('#menubox').append('<button name="select" id="menuListSelect">Display Change</button><br /><br />');

            $('#menubox').append('<b>Select the dataset to display</b><br/>');
            $('#menubox').append('<input type="radio" name="cdata" value="demand_uk">demand_uk</input><br />');
            $('#menubox').append('<input type="radio" name="cdata" value="supply_uk">supply_uk</input>');
            // $('#menubox').append('<select size="1" name="cdata" id="datas"  ></select><br>');
            // $('#datas').append('<option value="Demand">demand_uk</option>');
            // $('#datas').append('<option value="Supply">supply_uk</option>');
            $('#menuListSelect').on( 'click', function() {
                $('#year2').empty();
                $('input[name="cdata"]:checked').each(function(){
                    if ($(this).val()=== 'demand_uk'){
                        var choosenData=demand_uk;
                        makeChart(choosenData);
                    } else {
                        var choosenData=supply_uk;
                        makeChart(choosenData);
                    }
                });
            });
        };
	});
    $(document).ready(function() {
    	$('#displayarea').append('<div id="year3" class="year"></div>');
		$('#year3').css('height', h+'px');
		$('#year3').css('width', w+'px');
		$('#year3').css('left',  (w)*0+'px');
		$('#year3').css('top',(34+h)*1+'px');
    var pipeline =  [ {name: 'Norway',data: [81.76,34.38,50.08,83.43,100.88,58.11,51.70,101.05,108.56,69.40,48.40,92.27,97.07,46.71,40.41,94.63,96.53,54.57,65.13,91.71,102.11,73.19,53.18,118.53,126.02,68.75,79.85,118.80,127.97,71.19,71.28,102.91,102.51,65.77,44.59,83.06,76.57,36.37,46.28,104.28,104.80,72.44,67.33,110.43],
    color: 'rgb(115, 105, 211)'},
    {name: 'Netherlands',data: [18.38,15.09,13.61,21.92,26.97,17.60,10.32,23.37,30.71,15.90,10.51,24.39,29.79,14.67,9.13,16.70,22.60,3.30,0.26,9.78,22.39,5.48,0.31,19.26,9.34,0.09,0.06,11.28,22.11,0.79,0.23,6.97,14.09,0.03,0.59,2.86,1.11,0.00,0.00,9.96,21.06,0.88,0.00,3.98],
    color: 'rgb(0, 153, 153)'}, 	
    {name: 'Belgium',data: [3.97,0.00,0.00,0.06,0.34,0.12,0.07,13.74,27.92,1.58,0.28,5.60,3.22,0.00,0.00,0.73,2.11,0.00,0.00,0.00,0.84,0.18,0.00,14.40,12.58,0.00,0.00,16.85,34.55,0.52,0.00,0.46,3.23,0.00,0.00,0.00,0.37,0.00,0.00,3.18,19.07,0.78,0.00,0.22],
    color: 'rgb(237, 145, 200)'}]

    var shipping = [ {name: 'Other',data: [12.40,14.39,1.44,2.32,1.74,0.13,0.49,0.00,0.76,0.00,0.88,0.19,0.00,0.00,0.48,0.06,0.60,0.00,0.44,0.00,0.91,1.89,0.99,1.06,1.30,0.00,0.97,0.00,0.27,1.34,0.00,5.77,7.55,2.76,0.99,7.00,8.50,2.93,0.00,1.98,0.98,0.00,0.88,10.11],
    color: 'rgb(255, 186, 8)'},
     {name: 'Algeria',data: [1.23,1.46,0.00,0.00,0.00,0.79,0.52,0.00,1.82,1.21,1.47,0.00,2.26,0.00,1.10,2.42,1.26,0.00,2.63,0.91,0.98,1.85,0.00,0.00,0.88,0.50,0.52,0.56,0.00,1.36,1.08,0.00,3.65,4.64,0.87,1.73,0.00,0.00,0.00,0.49,0.00,5.09,1.13,1.97],
    color: 'rgb(0, 0, 153)'},
     {name: 'Trinidad & Tobago',data: [5.04,0.86,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.17,0.04,0.89,1.18,0.00,0.23,2.60,3.37,0.00,0.00,1.64,1.43,0.00,0.00,0.00,0.00,0.62,0.91,1.72,0.00,3.79,0.00,2.91,0.73,1.07,0.00,8.06,5.70,2.86,0.00,2.63,0.77,0.91,0.00,0.00],
    color: 'rgb(179, 179, 255)'},
      {name: 'Russia',data: [0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,1.07,2.32,1.43,2.17,10.76,11.61,3.17,3.01,13.60,9.79,3.19,0.00,11.66,16.78,9.55,0.00,7.43],
    color: 'rgb(120, 235, 137)'},
     {name: 'USA',data: [1.58,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,1.00,0.00,0.85,0.93,0.00,11.42,5.92,1.09,1.34,22.79,24.92,3.77,2.46,22.29,22.52,6.92,0.91,8.90],
    color: 'rgb(255, 128, 191)'}, 	
     {name: 'Qatar',data: [59.30,66.03,59.37,49.38,37.49,47.16,34.21,27.57,13.65,42.82,17.04,21.69,9.48,43.97,38.35,21.80,30.39,36.58,36.14,38.44,32.75,30.74,33.16,11.25,11.90,22.75,15.81,12.91,4.89,9.39,6.29,11.12,16.58,41.41,13.26,21.65,20.50,46.25,23.70,6.46,13.99,28.60,4.79,14.58],
    color: 'rgb(217, 38, 38)'}]
    var AllImport= [{name: 'Other',data: [12.40,14.39,1.44,2.32,1.74,0.13,0.49,0.00,0.76,0.00,0.88,0.19,0.00,0.00,0.48,0.06,0.60,0.00,0.44,0.00,0.91,1.89,0.99,1.06,1.30,0.00,0.97,0.00,0.27,1.34,0.00,5.77,7.55,2.76,0.99,7.00,8.50,2.93,0.00,1.98,0.98,0.00,0.88,10.11],
    color: 'rgb(255, 186, 8)'},
     {name: 'Algeria',data: [1.23,1.46,0.00,0.00,0.00,0.79,0.52,0.00,1.82,1.21,1.47,0.00,2.26,0.00,1.10,2.42,1.26,0.00,2.63,0.91,0.98,1.85,0.00,0.00,0.88,0.50,0.52,0.56,0.00,1.36,1.08,0.00,3.65,4.64,0.87,1.73,0.00,0.00,0.00,0.49,0.00,5.09,1.13,1.97],
    color: 'rgb(250, 163, 7)'},
     {name: 'Trinidad & Tobago',data: [5.04,0.86,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.17,0.04,0.89,1.18,0.00,0.23,2.60,3.37,0.00,0.00,1.64,1.43,0.00,0.00,0.00,0.00,0.62,0.91,1.72,0.00,3.79,0.00,2.91,0.73,1.07,0.00,8.06,5.70,2.86,0.00,2.63,0.77,0.91,0.00,0.00],
    color: 'rgb(244, 140, 6)'},
      {name: 'Russia',data: [0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,1.07,2.32,1.43,2.17,10.76,11.61,3.17,3.01,13.60,9.79,3.19,0.00,11.66,16.78,9.55,0.00,7.43],
    color: 'rgb(120, 235, 137)'},
     {name: 'USA',data: [1.58,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,1.00,0.00,0.85,0.93,0.00,11.42,5.92,1.09,1.34,22.79,24.92,3.77,2.46,22.29,22.52,6.92,0.91,8.90],
    color: 'rgb(208, 0, 0)'}, 	
     {name: 'Qatar',data: [59.30,66.03,59.37,49.38,37.49,47.16,34.21,27.57,13.65,42.82,17.04,21.69,9.48,43.97,38.35,21.80,30.39,36.58,36.14,38.44,32.75,30.74,33.16,11.25,11.90,22.75,15.81,12.91,4.89,9.39,6.29,11.12,16.58,41.41,13.26,21.65,20.50,46.25,23.70,6.46,13.99,28.60,4.79,14.58],
    color: 'rgb(157, 2, 8)'},
    {name: 'Norway',data: [81.76,34.38,50.08,83.43,100.88,58.11,51.70,101.05,108.56,69.40,48.40,92.27,97.07,46.71,40.41,94.63,96.53,54.57,65.13,91.71,102.11,73.19,53.18,118.53,126.02,68.75,79.85,118.80,127.97,71.19,71.28,102.91,102.51,65.77,44.59,83.06,76.57,36.37,46.28,104.28,104.80,72.44,67.33,110.43],
       color: 'rgb(98, 71, 170)'},
       {name: 'Netherlands',data: [18.38,15.09,13.61,21.92,26.97,17.60,10.32,23.37,30.71,15.90,10.51,24.39,29.79,14.67,9.13,16.70,22.60,3.30,0.26,9.78,22.39,5.48,0.31,19.26,9.34,0.09,0.06,11.28,22.11,0.79,0.23,6.97,14.09,0.03,0.59,2.86,1.11,0.00,0.00,9.96,21.06,0.88,0.00,3.98],
       color: 'rgb(177, 133, 219)'}, 	
       {name: 'Belgium',data: [3.97,0.00,0.00,0.06,0.34,0.12,0.07,13.74,27.92,1.58,0.28,5.60,3.22,0.00,0.00,0.73,2.11,0.00,0.00,0.00,0.84,0.18,0.00,14.40,12.58,0.00,0.00,16.85,34.55,0.52,0.00,0.46,3.23,0.00,0.00,0.00,0.37,0.00,0.00,3.18,19.07,0.78,0.00,0.22],
       color: 'rgb(210, 183, 229)'}]
    var dataset = pipeline;
    addMenu2();
    makeChart2(dataset);
    function makeChart2(dataset){
        $('#year3').highcharts({
			chart: {
				type: 'column',
				zoomType: 'x',
			},
			title: {
				text: 'UK Gas Import Origins ',
				style: {fontSize: '30px'},
			},
			legend: {
				layout: 'horizontal',
				align: 'left',
				verticalAlign: 'top',
                title:25,
				x: 100,
				y: 50,
				floating: true,
				borderWidth: 1,
				backgroundColor:
					Highcharts.defaultOptions.legend.backgroundColor || '#FFFACD'
			},
            annotations: [{
                labels: [{point:{
                        xAxis: 0,
                        yAxis: 0,
                        x: 0,
                        y: 150},
                text: 'Oranges are Shipping Imports - Liquefied Natural Gas'}],
			labelOptions: {
			backgroundColor: 'rgb(208, 0, 0)',
			style: {fontSize: '3ex'} 
			}}, {
                labels: [{point:{
                        xAxis: 0,
                        yAxis: 0,
                        x: 16,
                        y: 110},
                text: 'Violets are Pipeline Imports - Forties Pipeline System'}],
			labelOptions: {
			backgroundColor: 'rgb(75,0,130)',
			style: {fontSize: '3ex'} 
			}},
			// verticalAlign: 'bottom',

			],
			xAxis: {
				categories: ['2011 Q1','2011 Q2','2011 Q3','2011 Q4','2012 Q1','2012 Q2','2012 Q3','2012 Q4','2013 Q1','2013 Q2','2013 Q3','2013 Q4','2014 Q1','2014 Q2','2014 Q3','2014 Q4','2015 Q1','2015 Q2','2015 Q3','2015 Q4','2016 Q1','2016 Q2','2016 Q3','2016 Q4','2017 Q1','2017 Q2','2017 Q3','2017 Q4','2018 Q1','2018 Q2','2018 Q3','2018 Q4','2019 Q1','2019 Q2','2019 Q3','2019 Q4','2020 Q1','2020 Q2','2020 Q3','2020 Q4','2021 Q1','2021 Q2','2021 Q3','2021 Q4'],
				// plotBands: [{ // visualize the weekend
				// 	from: 4,
				// 	to: 4,
				// 	color: 'rgba(68, 170, 213, .2)'}],
				maxPadding: 0,
				// showLastLabel: true,
				tickInterval: 4, // one week
				tickWidth: 1,
				gridLineWidth: 3,
				labels: {
					align: 'left',
					x: 3,
					y: 15
				},
				tickmarkPlacement: 'on',
				title: {
					enabled: false
				}
			},
			yAxis: [{
				title: {
					text: 'TWh units',
					style: {fontSize: '20px'},
					x: -10,
					},
				labels: {
					align: 'left',
				},
				showFirstLabel: false
			},  { // right y axis
				linkedTo: 0,
				gridLineWidth: 0,
				opposite: true,
				title: {
					text: null
				},
				labels: {			
				},
				showFirstLabel: false
				}],
			tooltip: {
				// split: true,
				valueSuffix: ' Twh',
				crosshairs: true
			},
			credits: {
				enabled: false
			},
			plotOptions: {
				column: {stacking: 'normal',
						dataLabels: { enabled: false},
                        pointPadding: 0,
                        borderWidth: 0 },
				// series: {
				// 	cursor: 'pointer',
				// 	className: 'popup-on-click',
				// 	marker: {
				// 		lineWidth: 1
				// 	}
				// },
				// areaspline: {
				// 	fillOpacity: 0.5
				// }
			},
			series: dataset
	    });
    }
    function addMenu2(){
        $('#menubox2').empty();
        //add the select button
        //$('#menubox').append('<button name="select" onclick="getMenuChoices()">Select series</button> ');

        $('#menubox2').append('<b>Select the dataset to display</b><br />');
        $('#menubox2').append('<input type="radio" name="cdata2" value="pipeline">pipeline</input><br />');
        $('#menubox2').append('<input type="radio" name="cdata2" value="shipping">shipping</input><br />');
        $('#menubox2').append('<input type="radio" name="cdata2" value="AllImport">AllImport</input>');

        // $('#menubox').append('<select size="1" name="cdata" id="datas"  ></select><br>');
        // $('#datas').append('<option value="Demand">demand_uk</option>');
        // $('#datas').append('<option value="Supply">supply_uk</option>');
        $('#menuListSelect').on( 'click', function() {
            $('#year3').empty();
            $('input[name="cdata2"]:checked').each(function(){
                if ($(this).val()=== 'pipeline'){
                    var dataset= pipeline;
                } else if($(this).val()=== 'shipping'){
                    var dataset= shipping;
                } else {var dataset= AllImport};
            makeChart2(dataset);
            });
        });
    };
	
    });
    $(document).ready(function() {
		$('#displayarea').append('<div id="year4" class="year"></div>');
		$('#year4').css('height', h+'px');
		$('#year4').css('width', w+'px');
		$('#year4').css('left',  (w)*1+'px');
		$('#year4').css('top',(34+h)*1+'px');
		var colors = Highcharts.getOptions().colors;
        var pipeline = [{name: 'Netherlands',data: [18.38 ,15.09 ,13.61 ,21.92 ,26.97 ,17.60 ,10.32 ,23.37 ,30.71 ,15.90 ,10.51 ,24.39 ,29.79 ,14.67 ,9.13 ,16.70 ,22.60 ,3.30 ,0.26 ,9.78 ,22.39 ,5.48 ,0.31 ,19.26 ,9.34 ,0.09 ,0.06 ,11.28 ,22.11 ,0.79 ,0.23 ,6.97 ,14.09 ,0.03 ,0.59 ,3.75 ,1.11 ,0.00 ,0.00 ,9.96 ,21.06 ,0.88 ,0.00 ,3.98]}, 	
                        {name: 'Norway',data: [82.95 ,40.98 ,50.08 ,85.75 ,102.62 ,58.11 ,51.70 ,101.05 ,108.56 ,69.40 ,49.28 ,92.47 ,97.07 ,46.71 ,40.41 ,94.63 ,97.13 ,54.57 ,65.13 ,91.71 ,103.02 ,74.18 ,54.09 ,118.53 ,126.02 ,68.75 ,79.85 ,118.80 ,128.24 ,72.09 ,71.28 ,105.00 ,105.36 ,66.67 ,45.57 ,84.85 ,79.23 ,36.37 ,46.28 ,104.28 ,104.80 ,72.44 ,67.33 ,110.43]},
                        {name: 'Belgium',data: [3.97 ,0.00 ,0.00 ,0.06 ,0.34 ,0.12 ,0.07 ,13.74 ,27.92 ,1.58 ,0.28 ,5.60 ,3.22 ,0.00 ,0.00 ,0.73 ,2.11 ,0.00 ,0.00 ,0.00 ,0.84 ,1.07 ,0.00 ,14.40 ,12.58 ,0.00 ,0.00 ,16.85 ,34.55 ,0.52 ,0.00 ,0.46 ,3.23 ,0.00 ,0.00 ,0.00 ,3.33 ,0.98 ,0.00 ,3.18 ,20.05 ,0.78 ,0.00 ,0.22]}
                    ];
        var shipping = [{name: 'Algeria',data: [1.23,1.46,0.00,0.00,0.00,0.79,0.52,0.00,1.82,1.21,1.47,0.00,2.26,0.00,1.10,2.42,1.26,0.00,2.63,0.91,0.98,1.85,0.00,0.00,0.88,0.50,0.52,0.56,0.00,1.36,1.08,0.00,3.65,4.64,0.87,1.73,0.00,0.00,0.00,0.49,0.00,5.09,1.13,1.97],},
                        {name: 'Russia',data: [0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,1.07,2.32,1.43,2.17,10.76,11.61,3.17,3.01,13.60,9.79,3.19,0.00,11.66,16.78,9.55,0.00,7.43],},
                        {name: 'Qatar',data: [59.30,66.03,59.37,49.38,37.49,47.16,34.21,27.57,13.65,42.82,17.04,21.69,9.48,43.97,38.35,21.80,30.39,36.58,36.14,38.44,32.75,30.74,33.16,11.25,11.90,22.75,15.81,12.91,4.89,9.39,6.29,11.12,16.58,41.41,13.26,21.65,20.50,46.25,23.70,6.46,13.99,28.60,4.79,14.58],},    
                        {name: 'USA',data: [1.58,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,1.00,0.00,0.85,0.93,0.00,11.42,5.92,1.09,1.34,22.79,24.92,3.77,2.46,22.29,22.52,6.92,0.91,8.90],},
                        {name: 'Trinidad & Tobago',data: [5.04,0.86,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.17,0.04,0.89,1.18,0.00,0.23,2.60,3.37,0.00,0.00,1.64,1.43,0.00,0.00,0.00,0.00,0.62,0.91,1.72,0.00,3.79,0.00,2.91,0.73,1.07,0.00,8.06,5.70,2.86,0.00,2.63,0.77,0.91,0.00,0.00],},
                        {name: 'Other',data: [11.20,7.79,1.44,0.00,0.00,0.13,0.49,0.00,0.76,0.00,0.00,0.00,0.00,0.00,0.48,0.06,0.00,0.00,0.44,0.00,0.00,0.00,0.07,1.06,1.30,0.00,0.97,0.00,0.00,0.44,0.00,3.68,4.70,1.85,0.00,4.31,2.88,1.95,0.00,1.98,0.00,0.00,0.88,10.11]},
         	        ];
        var AllImport= [{name: 'Russia',data: [0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,1.07,2.32,1.43,2.17,10.76,11.61,3.17,3.01,13.60,9.79,3.19,0.00,11.66,16.78,9.55,0.00,7.43],},
                        {name: 'USA',data: [1.58,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,1.00,0.00,0.85,0.93,0.00,11.42,5.92,1.09,1.34,22.79,24.92,3.77,2.46,22.29,22.52,6.92,0.91,8.90],},
                        {name: 'Qatar',data: [59.30,66.03,59.37,49.38,37.49,47.16,34.21,27.57,13.65,42.82,17.04,21.69,9.48,43.97,38.35,21.80,30.39,36.58,36.14,38.44,32.75,30.74,33.16,11.25,11.90,22.75,15.81,12.91,4.89,9.39,6.29,11.12,16.58,41.41,13.26,21.65,20.50,46.25,23.70,6.46,13.99,28.60,4.79,14.58],},    
                        {name: 'Norway',data: [82.95 ,40.98 ,50.08 ,85.75 ,102.62 ,58.11 ,51.70 ,101.05 ,108.56 ,69.40 ,49.28 ,92.47 ,97.07 ,46.71 ,40.41 ,94.63 ,97.13 ,54.57 ,65.13 ,91.71 ,103.02 ,74.18 ,54.09 ,118.53 ,126.02 ,68.75 ,79.85 ,118.80 ,128.24 ,72.09 ,71.28 ,105.00 ,105.36 ,66.67 ,45.57 ,84.85 ,79.23 ,36.37 ,46.28 ,104.28 ,104.80 ,72.44 ,67.33 ,110.43]},
                        {name: 'Netherlands',data: [18.38 ,15.09 ,13.61 ,21.92 ,26.97 ,17.60 ,10.32 ,23.37 ,30.71 ,15.90 ,10.51 ,24.39 ,29.79 ,14.67 ,9.13 ,16.70 ,22.60 ,3.30 ,0.26 ,9.78 ,22.39 ,5.48 ,0.31 ,19.26 ,9.34 ,0.09 ,0.06 ,11.28 ,22.11 ,0.79 ,0.23 ,6.97 ,14.09 ,0.03 ,0.59 ,3.75 ,1.11 ,0.00 ,0.00 ,9.96 ,21.06 ,0.88 ,0.00 ,3.98]}, 	
                        {name: 'Belgium',data: [3.97 ,0.00 ,0.00 ,0.06 ,0.34 ,0.12 ,0.07 ,13.74 ,27.92 ,1.58 ,0.28 ,5.60 ,3.22 ,0.00 ,0.00 ,0.73 ,2.11 ,0.00 ,0.00 ,0.00 ,0.84 ,1.07 ,0.00 ,14.40 ,12.58 ,0.00 ,0.00 ,16.85 ,34.55 ,0.52 ,0.00 ,0.46 ,3.23 ,0.00 ,0.00 ,0.00 ,3.33 ,0.98 ,0.00 ,3.18 ,20.05 ,0.78 ,0.00 ,0.22]},
                        {name: 'Other',data: [17.47 ,10.11 ,1.44 ,0.00 ,0.00 ,0.92 ,1.01 ,0.00 ,2.57 ,1.38 ,1.51 ,0.89 ,3.43 ,0.00 ,1.80 ,5.08 ,4.63 ,0.00 ,3.07 ,2.56 ,2.41 ,1.85 ,0.07 ,1.06 ,2.18 ,1.11 ,2.39 ,2.28 ,0.00 ,5.60 ,1.08 ,6.58 ,9.07 ,7.57 ,0.87 ,14.11 ,8.58 ,4.81 ,0.00 ,5.09 ,0.77 ,6.00 ,2.01 ,12.09]},                    
                    ];
        var colorAll = [
            // Shipping Countries
            Highcharts.color(colors[2]).brighten(0.0).get(),
            Highcharts.color(colors[8]).brighten(0.0).get(),
            Highcharts.color(colors[8]).brighten(-0.4).get(),
            // Pipeline 
            Highcharts.color(colors[4]).brighten(-0.25).get(),
            Highcharts.color(colors[4]).brighten(0.0).get(),
            Highcharts.color(colors[4]).brighten(0.2).get(),
            // Others
            colors[6]
        ];
        var colorPipe = [
            // Pipeline 
            Highcharts.color(colors[7]).brighten(0.15).get(),
            Highcharts.color(colors[4]).brighten(0.0).get(),
            Highcharts.color(colors[5]).brighten(0.2).get(),
        ];
        var colorShip = [
            // Shipping Countries
            Highcharts.color(colors[4]).brighten(-0.3).get(),
            Highcharts.color(colors[2]).brighten(0.0).get(),
            Highcharts.color(colors[8]).brighten(-0.1).get(),
            // Pipeline 
            Highcharts.color(colors[5]).brighten(0.3).get(),
            Highcharts.color(colors[4]).brighten(0.15).get(),
            // Others
            colors[6]
        ];
        var dataset = pipeline;
        var color = colorPipe;
        addMenu2();
        makeChart3(dataset);
        function makeChart3(dataset){
            $('#year4').highcharts({
                chart: {
                    type: 'streamgraph',
                    zoomType: 'x',
                    marginBottom: 30
                },
                title: {floating: true,
                    align: 'center',
                    text: 'UK Dependency of Gas Importers',
                    style: {fontSize: '30px'},
                },
				legend: {
					layout: 'horizontal',
					align: 'left',
					verticalAlign: 'top',
					title:25,
					x: 100,
					y: 50,
					floating: true,
					borderWidth: 1,
					backgroundColor:
						Highcharts.defaultOptions.legend.backgroundColor || '#FFFACD'
				},
                colors: color,
                xAxis: {
                    categories: ['2011 Q1','2011 Q2','2011 Q3','2011 Q4','2012 Q1','2012 Q2','2012 Q3','2012 Q4','2013 Q1','2013 Q2','2013 Q3','2013 Q4','2014 Q1','2014 Q2','2014 Q3','2014 Q4','2015 Q1','2015 Q2','2015 Q3','2015 Q4','2016 Q1','2016 Q2','2016 Q3','2016 Q4','2017 Q1','2017 Q2','2017 Q3','2017 Q4','2018 Q1','2018 Q2','2018 Q3','2018 Q4','2019 Q1','2019 Q2','2019 Q3','2019 Q4','2020 Q1','2020 Q2','2020 Q3','2020 Q4','2021 Q1','2021 Q2','2021 Q3','2021 Q4'],
                    type: 'category',
                    crosshair: true,
                    maxPadding: 0.05,
                    // showLastLabel: true,
                    tickInterval: 4, // one week
                    tickWidth: 1,
                    gridLineWidth: 2,
                    labels: {
                        align: 'left',
                        // rotation: 270
                        reserveSpace: false,
                        },
                    tickmarkPlacement: 'on',
                    margin: 20,
                    // title: {enabled: false}
                },
                yAxis: {
                    visible: false,
                    startOnTick: true,
                    endOnTick: true
                },
                tooltip: {
                    valueSuffix: ' Twh',
                    crosshairs: true
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    series:	{
                        marker: {lineWidth: 1},
                        label: {minFontSize: 20,
                                maxFontSize: 35,
                                // style: {color: 'rgba(255,255,255,0.75)'}
                            },
                        cursor: 'pointer',
                        className: 'popup-on-click'
                        },
                    accessibility: {exposeAsGroupOnly: true}
                },
                series: dataset
            });
        }
        function addMenu2(){
            $('#menubox2').empty();
            //add the select button
            //$('#menubox').append('<button name="select" onclick="getMenuChoices()">Select series</button> ');
    
            $('#menubox2').append('<b>Select the dataset to display</b><br />');
            $('#menubox2').append('<input type="radio" name="cdata2" value="pipeline">pipeline</input><br />');
            $('#menubox2').append('<input type="radio" name="cdata2" value="shipping">shipping</input><br />');
            $('#menubox2').append('<input type="radio" name="cdata2" value="AllImport">AllImport</input>');
    
            // $('#menubox').append('<select size="1" name="cdata" id="datas"  ></select><br>');
            // $('#datas').append('<option value="Demand">demand_uk</option>');
            // $('#datas').append('<option value="Supply">supply_uk</option>');
            $('#menuListSelect').on( 'click', function() {
                $('#year4').empty();
                $('input[name="cdata2"]:checked').each(function(){
                    if ($(this).val()=== 'pipeline'){
                        dataset= pipeline;
                        color = colorPipe;
                    } else if($(this).val()=== 'shipping'){
                         dataset= shipping;
                         color = colorShip;
                    } else { dataset= AllImport;
                        color = colorAll};
                makeChart3(dataset);
                });
            });
        };
    });
   
});
