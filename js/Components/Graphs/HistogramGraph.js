import React from 'react';
import { AppRegistry, StyleSheet, Text, View, processColor, Dimensions } from 'react-native';
import {BarChart} from 'react-native-charts-wrapper';
import update from 'immutability-helper';

var temperatureArr = [];
var dateArr = [];
export default class HistogramGraph extends React.Component
{
	constructor()
	{
		super();
		this.state =
		{
			data: {},
			highlights: [{x: 3}, {x: 6}],
			legend:
			{
				enabled: true,
				form: 'SQUARE',
				formSize: 14,
				formToTextSpace: 5,
				maxSizePercent: 0.5,
				textSize: 14,
				wordWrapEnabled: true,
				xEntrySpace: 10,
				yEntrySpace: 5
			},
			xAxis:
			{
				granularity : 1,
				granularityEnabled: false,
				labelCount: 10,
                labelCountForce: true,
				labelRotationAngle: 315,
				position: "BOTTOM",
                valueFormatter: "date",
                valueFormatterPattern:"MM-dd-yyyy HH:mm"
            },
			yAxis:
			{
				left: {axisMaximum:100, axisMinimum: 0},
				right: {enabled: false}
			},
			screenHeight: Dimensions.get('window').height,
            screenWidth: Dimensions.get('window').width
		};
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
        var valuesArrJson = this.props.moteLineGraphData;
		var temperatureValues = valuesArrJson[0].graphs.lineGraph[0].Temperature.values;
		for (var i = 0; i < temperatureValues.length; i++)
		{
			temperatureArr.push({
				y : temperatureValues[i].y,
				marker : "Temperature"
			});
			dateArr.push({
				y : temperatureValues[i].x,
				marker : "Date"
			});			
		}
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
								barShadowColor: processColor('lightgrey'),
								circleColor: processColor('red'),
								circleRadius: 5,
								color: processColor('teal'),
								drawFilled: true,
								drawHighlightIndicators: true,
								drawValues: true,
								fillColor: processColor('red'),
								fillAlpha: 0,
								highlightAlpha: 90,
								highlightColor: processColor('red'),
								highlightEnabled: true,
								lineWidth: 1,
								valueFormatter: "###.0F",
								valueTextSize: 10,
							},
							label: 'Temperature',
							values: temperatureArr
						}],
					}
				},
				xAxis:
				{
					$set:
					{
						values: dateArr
					}
				}
			})
		);
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
					<BarChart
						animation={{durationX: 2000}}
						chartDescription = {{text: ''}}
						data={this.state.data}
						drawBarShadow={false}
						drawHighlightArrow={true}
						drawValueAboveBar={true}
						gridBackgroundColor={processColor('#ffffff')}
						highlights={this.state.highlights}
						legend={this.state.legend}
						onChange={(event) => console.log(event.nativeEvent)}
						// onSelect={this.handleSelect.bind(this)}
						style={{ flex:1, width:this.state.screenWidth-25, height:300 }}
						visibleRange={{x: { min: 5, max: 5 }}}
						xAxis={this.state.xAxis}
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF'
	},
	chart: {
		flex: 1
	}
});