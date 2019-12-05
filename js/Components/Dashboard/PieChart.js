import React, { Component } from "react";
import { Dimensions } from 'react-native';
import { VictoryPie } from "victory-native";
import styles from "./styles";
const dimensions = Dimensions.get('window');
const PieChart =(props)=>
	<VictoryPie
		data={[
			{ x: props.urgentPercent <= 0 ? " " : " ", y: props.urgentPercent},
			{ x: props.checkupPercent <= 0 ? " " : " ", y: props.checkupPercent},
			{ x: props.goodPercent <= 0 ? " " : " ", y: props.goodPercent},
			{ x: props.unknownPercent <= 0 ? " " : " ", y: props.unknownPercent}
		]}
		colorScale={["#ce0202", "#e0dd35", "#0dc416", "#A9A9A9"]}
		// innerRadius={dimensions.width * 0.0825}
		// labelRadius={dimensions.width * 0.20}
		// width={dimensions.width * 0.5}
		// height={dimensions.width * 0.5}
		innerRadius={props.innerRadius}
		labelRadius={props.labelRadius}
		width={props.width}
		height={props.height}
	/>
export default PieChart;