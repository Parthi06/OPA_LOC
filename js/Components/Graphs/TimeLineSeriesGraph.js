import React from "react";
import { Picker } from "native-base";
import { View, Text, Dimensions, Button, Alert, Image, TouchableOpacity, StyleSheet, processColor } from "react-native";
import update from 'immutability-helper';
import {LineChart} from 'react-native-charts-wrapper';

var TemperatureValuesArr = [];
export default class TimeLineSeriesGraph extends React.Component
{
	constructor()
	{
		super();		
		this.state = 
		{
			data: {},
			dataSource:[],
			legend:
			{
				enabled: true,
				form: 'SQUARE',
				formSize: 14,
				formToTextSpace: 10,
				maxSizePercent: 0.25,
				textColor: processColor('red'),
				textSize: 11,
				wordWrapEnabled: true,
				xEntrySpace: 10,
				yEntrySpace: 15
			},
			loading: true,
            orientation: '',
			screenHeight: Dimensions.get('window').height,
			screenWidth: Dimensions.get('window').width,
			selectedEntry: "",
			yAxis:
			{
				right: {enabled: false},
			}
		}
		this.onScreenOrientationChange = this.onScreenOrientationChange.bind(this);
    }
    
    getOrientation = () =>
    {
        this.setState(
			{
				screenHeight: Dimensions.get('window').height,
				screenWidth: Dimensions.get('window').width
			}
		);
    }

	onScreenOrientationChange(e)
	{
		this.setState(
			{
				screenHeight: Dimensions.get('window').height,
				screenWidth: Dimensions.get('window').width
			}
		);
	}

	// componentWillReceiveProps()
	componentDidMount()
	{
		this.interval = setInterval(() =>
		{
			this.getOrientation();
	
			Dimensions.addEventListener( 'change', () =>
			{
				this.getOrientation();
			});
			this.setState(
				update(this.state,
				{
					data: 
					{
						$set:
						{
							dataSets: [
							{
								config:
								{
									circleColor: processColor(this.props.dataConfigCircleColor),
									circleRadius: this.props.dataConfigCircleRadius,
									color: processColor(this.props.dataConfigColor),
									drawFilled: this.props.dataConfigDrawFilled,
									drawHighlightIndicators: this.props.dataConfigDrawHighlightIndicators,
									drawValues: this.props.dataConfigDrawValues,
									fillColor: processColor(this.props.dataConfigFillColor),
									fillAlpha: this.props.dataConfigFillAlpha,
									highlightEnabled: this.props.dataConfigHighlightEnabled,
									lineWidth: this.props.dataConfigLineWidth,
									valueTextSize: this.props.dataConfigValueTextSize,
									valueFormatter: this.props.dataConfigValueFormatter
								},
								label: this.props.graphLabel,
								values: this.props.moteLineGraphData
							}],
						}
					},
					xAxis:
					{
						$set:
						{
							labelCount: this.props.labelCount,
							labelCountForce: this.props.xAxisLabelCountForce,
							labelRotationAngle: this.props.xAxisLabelRotationAngle,
							position: this.props.xAxisPosition,
							spaceBetweenLabels: this.props.xAxisSpaceBetweenLabels,
							valueFormatter: this.props.xAxisValueFormatter,
							valueFormatterPattern: this.props.xAxisValueFormatterPattern,
						}
					},
					yAxis:
					{
						$set:
						{
							left: 
							{
								axisMaximum:this.props.yAxisMaximum,
								axisMinimum: this.props.yAxisMinimum,
								valueFormatter: this.props.yAxisValueFormatter
							},
							right: {enabled: false},
						}
					}
				})
			);
		}, 500);		
	}
	componentWillUnmount()
	{
		clearInterval(this.interval);
	}
	// componentDidMount()
    // {
    //     this.getOrientation();
  
    //     Dimensions.addEventListener( 'change', () =>
    //     {
    //         this.getOrientation();
    //     });
	// 	var valuesArrJson = this.props.moteLineGraphData;
	// 	this.setState(
	// 		// update(this.state,
	// 		// {
	// 		// 	data: 
	// 		// 	{
	// 		// 		$set:
	// 		// 		{
	// 		// 			dataSets: [
	// 		// 			{
	// 		// 				config:
	// 		// 				{
	// 		// 					circleColor: processColor('red'),
	// 		// 					circleRadius: 5,
	// 		// 					color: processColor('red'),
	// 		// 					drawFilled: true,
	// 		// 					drawHighlightIndicators: true,
	// 		// 					drawValues: true,
	// 		// 					fillColor: processColor('red'),
	// 		// 					fillAlpha: 0,
	// 		// 					highlightEnabled: true,
	// 		// 					lineWidth: 1,
	// 		// 					valueTextSize: 10,
	// 		// 					valueFormatter: "###.0F"
	// 		// 				},
	// 		// 				label: this.props.graphLabel, //'Temperature',
	// 		// 				values: valuesArrJson
	// 		// 			}],
	// 		// 		}
	// 		// 	}
	// 		// })
	// 	);
	// }
	
	handleSelect(event)
    {
        let entry = event.nativeEvent
        if (entry == null)
        {
            this.setState({...this.state, selectedEntry: null})
        } else 
        {
            this.setState({...this.state, selectedEntry: JSON.stringify(entry)})
        }
	}
	
	render()
	{
		let borderColor = processColor("red");
		return (
			<View  onLayout={this.onScreenOrientationChange}>
				<LineChart
					borderColor = {borderColor}
					borderWidth = {1}
					chartDescription = {{text: ''}}
					data = {this.state.data}
					drawBorders = {true}
					drawGridBackground = {true}
					legend = {this.state.legend}
					onSelect = {this.handleSelect.bind(this)}
					onChange = {(event) => console.log(event.nativeEvent)}
					ref = "chart"
					style = {{ flex:1, width:this.state.screenWidth-25, height:300 }}
					yAxis = {this.state.yAxis}
					xAxis = {this.state.xAxis}
				/>
			</View>
		);
	}
}