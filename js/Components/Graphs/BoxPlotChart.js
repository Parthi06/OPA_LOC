import React from 'react';
import { AppRegistry, StyleSheet, Text, Button, View, processColor, Dimensions } from 'react-native';
import update from 'immutability-helper';

import _ from 'lodash';
import {CandleStickChart} from 'react-native-charts-wrapper';

export default class BoxPlotChart extends React.Component
{
	constructor()
	{
		super();
		this.state =
		{
			data:
			{
				dataSets: [
				{
					config:
					{
						decreasingColor: processColor('#D14B5A'),
						highlightColor: processColor('darkgray'),
						increasingColor: processColor('#71BD6A'),
						increasingPaintStyle: 'FILL',
						shadowColor: processColor('black'),
						shadowColorSameAsCandle: true,
						shadowWidth: 1
					},
					label: 'Temperature',
					values: [
						{shadowH: 101.76, shadowL: 100.4, open: 100.78, close: 101.03, x: 1562309177000},
						{shadowH: 101.58, shadowL: 100.27, open: 101.31, close: 101.12, x: 1562395577000},
						{shadowH: 102.24, shadowL: 100.15, open: 101.41, close: 101.17, x: 1562481977000},
						{shadowH: 102.28, shadowL: 101.5, open: 102.24, close: 102.23, x: 1562568377000},
						{shadowH: 102.91, shadowL: 101.78, open: 101.91, close: 102.52, x: 1562654777000},
						{shadowH: 105.18, shadowL: 103.85, open: 103.96, close: 104.58, x: 1562741177000},
						{shadowH: 106.31, shadowL: 104.59, open: 104.61, close: 105.97, x: 1562827577000},
						{shadowH: 106.47, shadowL: 104.96, open: 105.52, close: 105.8, x: 1562913977000},
						{shadowH: 106.5, shadowL: 105.19, open: 106.34, close: 105.92, x: 1562913977000},
						// {shadowH: 107.65, shadowL: 105.1401, open: 105.93, close: 105.91},
						// {shadowH: 107.29, shadowL: 105.21, open: 105.25, close: 106.72},
						// {shadowH: 107.07, shadowL: 105.9, open: 106.48, close: 106.13},
						// {shadowH: 106.25, shadowL: 104.89, open: 105.47, close: 105.67},
						// {shadowH: 106.19, shadowL: 105.06, open: 106, close: 105.19},
						// {shadowH: 107.79, shadowL: 104.88, open: 104.89, close: 107.7},
						// {shadowH: 110.42, shadowL: 108.6, open: 108.65, close: 109.56},
						// {shadowH: 109.9, shadowL: 108.88, open: 109.72, close: 108.99},
						// {shadowH: 110, shadowL: 108.2, open: 108.78, close: 109.99},
						// {shadowH: 112.19, shadowL: 110.27, open: 110.42, close: 111.08},
						// {shadowH: 110.73, shadowL: 109.42, open: 109.51, close: 109.81},
						// {shadowH: 110.98, shadowL: 109.2, open: 110.23, close: 110.96},
						// {shadowH: 110.42, shadowL: 108.121, open: 109.95, close: 108.54},
						// {shadowH: 109.77, shadowL: 108.17, open: 108.91, close: 108.66},
						// {shadowH: 110.61, shadowL: 108.83, open: 108.97, close: 109.04},
						// {shadowH: 110.5, shadowL: 108.66, open: 109.34, close: 110.44},
						// {shadowH: 112.34, shadowL: 110.8, open: 110.8, close: 112.0192},
						// {shadowH: 112.39, shadowL: 111.33, open: 111.62, close: 112.1},
						// {shadowH: 112.3, shadowL: 109.73, open: 112.11, close: 109.85},
						// {shadowH: 108.95, shadowL: 106.94, open: 108.89, close: 107.48},
						// {shadowH: 108, shadowL: 106.23, open: 107.88, close: 106.91},
						// {shadowH: 108.09, shadowL: 106.06, open: 106.64, close: 107.13},
						// {shadowH: 106.93, shadowL: 105.52, open: 106.93, close: 105.97},
						// {shadowH: 106.48, shadowL: 104.62, open: 105.01, close: 105.68},
						// {shadowH: 105.65, shadowL: 104.51, open: 105, close: 105.08},
						// {shadowH: 105.3, shadowL: 103.91, open: 103.91, close: 104.35},
						// {shadowH: 98.71, shadowL: 95.68, open: 96, close: 97.82},
						// {shadowH: 97.88, shadowL: 94.25, open: 97.61, close: 94.8075},
						// {shadowH: 94.72, shadowL: 92.51, open: 93.99, close: 93.75},
						// {shadowH: 94.08, shadowL: 92.4, open: 93.965, close: 93.65},
						// {shadowH: 95.74, shadowL: 93.68, open: 94.2, close: 95.18},
						// {shadowH: 95.9, shadowL: 93.82, open: 95.2, close: 94.19},
						// {shadowH: 94.07, shadowL: 92.68, open: 94, close: 93.24},
						// {shadowH: 93.45, shadowL: 91.85, open: 93.37, close: 92.72},
						// {shadowH: 93.77, shadowL: 92.59, open: 93, close: 92.82},
						// {shadowH: 93.57, shadowL: 92.11, open: 93.33, close: 93.39},
						// {shadowH: 93.57, shadowL: 92.46, open: 93.48, close: 92.51},
						// {shadowH: 92.78, shadowL: 89.47, open: 92.72, close: 90.32},
						// {shadowH: 91.67, shadowL: 90, open: 90, close: 90.52}
					],
					xAxis: {},
					yAxis: {}
				}],
			},
			legend:
			{
				enabled: false,
				form: 'CIRCLE',
				textSize: 14,
				wordWrapEnabled: true
			},
			marker:
			{
				enabled: true,
				markerColor: processColor('#2c3e50'),
				textColor: processColor('white'),
			},
			screenHeight: Dimensions.get('window').height,
			screenWidth: Dimensions.get('window').width,
			zoomXValue : 0
		};
		this.x = 0;
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

	componentDidMount()
	{
		this.getOrientation();
		Dimensions.addEventListener( 'change', () =>
		{
			this.getOrientation();
		});	
		this.setState(
			update(this.state,
			{
				xAxis:
				{
					$set:
					{
						drawGridLines: true,
						drawLabels: true,
						labelRotationAngle: 315,
						limitLines: _.times(this.state.data.dataSets[0].values.length / 5, (i) => {
							return
							{
								label: (i + 1).toString();
								limit: 5 * (i + 1) + 0.5;
								lineColor: processColor('darkgray');
								lineWidth: 1;
							};
						}),
						position: 'BOTTOM',
						valueFormatter: "date",
						valueFormatterPattern:"MM-dd-yyyy HH:mm:ss",
						yOffset: 5
					}
				},
				yAxis:
				{
					$set:
					{
						left:
						{
							limitLines: [
							{
								limit: 105.4,
								lineColor: processColor('red'),
								lineDashLengths: [10,20],
								lineDashPhase: 2
							},
							{
								limit: 95.47,
								lineColor: processColor('red'),
								lineDashLengths: [10,20],
								lineDashPhase: 2
							}],
							valueFormatter: '###.0ºF'
						},
						right:
						{
							enabled: false
						},
					}
				},
				zoomXValue:
				{
					$set: 99999
				}
			}
		 ));
	}

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
		console.log(event.nativeEvent)
	}

	render()
	{
		return (
			<View style={{flex: 1}}>
				<View style={{height:80}}>
					<Text> selected entry</Text>
					<Text> {this.state.selectedEntry}</Text>
				</View>
				<View style={styles.container}>
					<CandleStickChart
						autoScaleMinMaxEnabled={true}
						chartDescription={{text: ''}}
						data={this.state.data}
						legend={this.state.legend}
						marker={this.state.marker}
						maxVisibleValueCount={16}
						onChange={(event) => console.log(event.nativeEvent)}
						// onSelect={this.handleSelect.bind(this)}
						ref="chart"
						style={{ flex:1, width:this.state.screenWidth-25, height:300 }}
						xAxis={this.state.xAxis}
						yAxis={this.state.yAxis}
						zoom={{scaleX: 15.41, scaleY: 1, xValue:  40, yValue: 916, axisDependency: 'LEFT'}}
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create
({
	container:
	{
		flex: 1,
		backgroundColor: '#F5FCFF'
	},
	chart:
	{
		flex: 1
	}
});