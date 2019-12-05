import React from "react";
import { Picker } from "native-base";
import { VictoryLine, VictoryVoronoiContainer, VictoryChart, VictoryGroup, VictoryScatter, VictoryAxis } from "victory-native";
import { View, Text, Dimensions, Button, Alert, Image, TouchableOpacity } from "react-native";
import ChartPoint from './ChartPoint';
import { Col, Row } from 'react-native-easy-grid';
import * as appConstants from '../../Utils/AppConstants';
import TimeLineSeriesGraph from '../Graphs/TimeLineSeriesGraph';
import ScatterPlotGraph from '../Graphs/ScatterPlotGraph';
import HistogramGraph from '../Graphs/HistogramGraph';
import BoxPlotChart from '../Graphs/BoxPlotChart';

const dimensions = Dimensions.get('window').width;
var yAxisMaximum = 100, yAxisValueFormatter="###.0ºF", dataConfigValueFormatter="###.0ºF";

export default class LineGraph extends React.Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			selectedValue: "0",
			padding: 30
		};
		this.onValueChange = this.onValueChange.bind(this);
	}

	onValueChange(value) {
		this.setState({
			selectedValue: value
		});
		this.props.changeLineGraph(value);
		{ value == 1 ? this.setState({ padding: 70 }) : this.setState({ padding: 40 }) }
		if(value == 0)
		{
			yAxisMaximum = 100;
			yAxisValueFormatter = "###.0ºF";
			dataConfigValueFormatter = "###.0ºF";
		} else if(value == 1)
		{
			yAxisMaximum = 10000;
			yAxisValueFormatter = "###";
			dataConfigValueFormatter = "###";
		} else if(value == 2)
		{
			yAxisMaximum = 10;
			yAxisValueFormatter = "###";
			dataConfigValueFormatter = "##.#";
		} else if(value == 3)
		{
			yAxisMaximum == 10;
			yAxisValueFormatter = "###";
			dataConfigValueFormatter = "##.#";
		} else if(value == 4)
		{
			yAxisMaximum = 10;
			yAxisValueFormatter = "###";
			dataConfigValueFormatter = "##.#";			
		}
	}

	onPressShowDescription ( metricsObj )  {
		if( typeof(this.props.loadMetricsDetailsReducer) != 'undefined')  {
			const metricsInfo = this.props.loadMetricsDetailsReducer.metrics.slice()
			let dataForMetricsDialog = metricsInfo.find(
				item => { 
					return item.acronym.toUpperCase() === metricsObj.toUpperCase();

				})
			if( typeof(dataForMetricsDialog) != 'undefined' ) {
				Alert.alert(
						dataForMetricsDialog.acronym  + ' ( ' +dataForMetricsDialog.expanded + ' )',
						dataForMetricsDialog.explanation,
						[ { text: 'OK', onPress: () => console.log('OK Pressed')},], {cancelable: false},
				);
			} else {
					Alert.alert(
							'No Description',
							'No description found for the ' + metricsObj + ' !',
							[ { text: 'OK', onPress: () => console.log('OK Pressed')},], {cancelable: false},
					);
			}
		}
	}

	render() {
		console.log("dimensions", dimensions, dimensions / 4.5, dimensions / 6, this.state.selectedValue)
		return (
			<View style={{ paddingBottom: 20 }}>
				{this.props.moteLineGraphData.length < 1 ? <Text note>{"\nTemperature and RMS Graphs - Not Available"}</Text> :
					<View>
						<View>
							<Row size={10} style={{ paddingTop: 8 }}>
								<Col size={3} style={{ paddingTop: 10 }}>
									<Text>Performance Graph</Text></Col>
								<Col size={5}>
									<Picker
										mode="dropdown"
										selectedValue={this.state.selectedValue}
										onValueChange={this.onValueChange}
										style={{ width: 180, justifyContent: 'flex-start', alignItems: 'flex-start' }}
									>
										{this.props.paramsForLineGraph.map((item, index) => (
											<Picker.Item label={item} value={index} key={"param" + index} />))
										}
									</Picker>
									</Col> 
									<Col size={2}>
											<TouchableOpacity style={{paddingTop:10}} onPress={() => this.onPressShowDescription(this.props.paramsForLineGraph[parseInt(this.state.selectedValue)])}  color="#841584" title={this.props.paramsForLineGraph[parseInt(this.state.selectedValue)]}>
												<Image  style = {{ height: 25, width: 25}}  source = {appConstants.INFO_ICON} />
											</TouchableOpacity>
									</Col>
							</Row>             
						</View>
						<View>
							<TimeLineSeriesGraph
								moteLineGraphData={this.props.moteLineGraphData}
								paramsForLineGraph={this.state.paramsForLineGraph}
								graphLabel={this.props.paramsForLineGraph[parseInt(this.state.selectedValue)]}
								labelCount={10}
								xAxisLabelCountForce={false}
								xAxisLabelRotationAngle={315}
								xAxisPosition={"BOTTOM"}
								xAxisSpaceBetweenLabels={1}
								xAxisValueFormatter={"date"}
								xAxisValueFormatterPattern={"MM-dd-yyyy HH:mm:ss"}
								yAxisMaximum={yAxisMaximum}
								yAxisMinimum={0}
								yAxisValueFormatter={yAxisValueFormatter}
								dataConfigCircleColor={"red"}
								dataConfigCircleRadius={5}
								dataConfigColor={"red"}
								dataConfigDrawFilled={true}
								dataConfigDrawHighlightIndicators={true}
								dataConfigDrawValues={true}
								dataConfigFillColor={"red"}
								dataConfigFillAlpha={0}
								dataConfigHighlightEnabled={true}
								dataConfigLineWidth={1}
								dataConfigValueTextSize={10}
								dataConfigValueFormatter={dataConfigValueFormatter}

							></TimeLineSeriesGraph>
							{/* <HistogramGraph
								moteLineGraphData={this.props.moteLineGraphData}
							></HistogramGraph> */}
							{/* <ScatterPlotGraph
								moteLineGraphData={this.props.moteLineGraphData}
							></ScatterPlotGraph> */}
							{/* <BoxPlotChart></BoxPlotChart> */}
							{/* <VictoryChart domain={this.props.lineGraphDomain} domainPadding={{ x: 70, y: 10 }} scale={{ x: "time" }} fixLabelOverlap={false}
							containerComponent={<VictoryVoronoiContainer
									labels={(d) => (d.y)}  
									labelComponent={<ChartPoint chartType={2} paramName={this.props.paramsForLineGraph[parseInt(this.state.selectedValue)]} />}
									/>}>
								<VictoryAxis dependentAxis label={this.props.paramsForLineGraph[parseInt(this.state.selectedValue)] + ((this.props.moteLineGraphData && this.props.moteLineGraphData.length > 0) ? " " + this.props.moteLineGraphData[0].unit : "")}  style={{
									axis: { stroke: "#756f6a" },
									axisLabel: { padding: this.state.padding },
									grid: { stroke: "#EDFBFD" },
									ticks: { stroke: "grey", size: 5 },
									tickLabels: { padding: 1 }
								}}
									offsetX={parseInt((this.state.selectedValue == 1) ? 90 : 65)}
								/>
								<VictoryAxis label="Time" style={{
									axis: { stroke: "#756f6a" },
									axisLabel: { padding: 30 },
									grid: { stroke: "#EDFBFD" },
									ticks: { stroke: "grey", size: 5 },
									tickLabels: { padding: 5 }
								}}
								/>
								{
									(this.props.moteLineGraphData.length > 1) ?
										<VictoryGroup >
											<VictoryLine
												style={{
													data: { stroke: "tomato" } 
												}}
												fixLabelOverlap={true}
												data={this.props.moteLineGraphData}
											/>
											<VictoryScatter
												style={{ data: { fill: "#c43a31" } }}
												size={3}
												fixLabelOverlap={true}
												data={this.props.moteLineGraphData}
											/>
										</VictoryGroup> :
										<VictoryScatter
											style={{ data: { fill: "#c43a31" } }}
											size={4}
											fixLabelOverlap={true}
											data={this.props.moteLineGraphData}
										/>
								}
							</VictoryChart> */}
						</View>
					</View>
				}
			</View>

		);

	}

}
