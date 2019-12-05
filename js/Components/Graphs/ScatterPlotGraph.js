import React from 'react';
import { AppRegistry, StyleSheet, Text, View, processColor, Dimensions} from 'react-native';
import update from 'immutability-helper';

import _ from 'lodash';
import {ScatterChart} from 'react-native-charts-wrapper';

var valuesArr = [];
export default class ScatterPlotGraph extends React.Component {

	constructor()
	{
		super();

		this.state = {
			legend: {
				enabled: false,
				form: 'CIRCLE',
				textSize: 14,
				wordWrapEnabled: true
			},
			marker:
			{
				enabled: true,
				type: 'com.github.reactNativeMPAndroidChart.example.marker.OvalBlueMarker'
            },
			screenHeight: Dimensions.get('window').height,
			screenWidth: Dimensions.get('window').width,
			xAxis:
			{
                labelCount: 10,
                labelCountForce: true,
				labelRotationAngle: 315,
				position: "BOTTOM",
				spaceBetweenLabels: 10,
				valueFormatter: "date",
				valueFormatterPattern: "MM-dd-yyyy HH:mm:ss"
            }
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
		const size = 30;
		const range = 20;        
		var valuesArrJson = this.props.moteLineGraphData;
		var temperatureValues = valuesArrJson[0].graphs.lineGraph[0].Temperature.values;
		for (var i = 0; i < temperatureValues.length; i++)
		{
			valuesArr.push(
				{
					x : temperatureValues[i].x,
					y : temperatureValues[i].y,
					marker : temperatureValues[i].y + ".0ºF"
				}
			);		
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
								color: processColor('gray'),
								scatterShape: 'X'
							},
							label: 'Temperature',
							values: valuesArr
                        }, 
                        // {
                        //     config:
                        //     {
                        //         color: processColor('blue'),
                        //         scatterShape: 'CIRCLE',
                        //         scatterShapeHoleColor: processColor('teal'),
                        //         scatterShapeHoleRadius: 6
                        //     },
                        //     label: 'RPM',
                        //     values: this._randomYValues(range, size)
                        // }, 
                        // {
                        //     config:
                        //     {
                        //         color: processColor('green'),
                        //         drawHighlightIndicators: false,
                        //         scatterShape: 'SQUARE',
                        //         scatterShapeSize: 8
                        //     },
                        //     label: 'CF',
                        //     values: this._randomYValues(range, size)
						// }
					],
					}
				}
			})
		);
	}

	_randomYValues(range: number, size: number)
	{
		return _.times(size, () =>
		{
			return {y: Math.random() * range}
		});
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
				{/* <View style={{height:80}}>
					<Text> selected entry</Text>
					<Text> {this.state.selectedEntry}</Text>
				</View> */}
				<View style={styles.container}>
					<ScatterChart
						// style={styles.chart}
						chartDescription={{text: ''}}
                        data={this.state.data}
						legend={this.state.legend}
						marker={this.state.marker}
						onChange={(event) => console.log(event.nativeEvent)}
						// onSelect={this.handleSelect.bind(this)}
                        style={{ flex:1, width:this.state.screenWidth-25, height:300 }}
						xAxis={this.state.xAxis}
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create(
    {
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