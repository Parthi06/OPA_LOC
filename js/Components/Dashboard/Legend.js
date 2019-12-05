import React, { Component } from "react";
import {Image,View} from "react-native";
import { Container, Header, Title, Content, Text, Button, Icon, Left, Right, Body,Thumbnail } from "native-base";
import { Col, Row, Grid } from 'react-native-easy-grid';
import styles from "./styles";

const Legend = (props) =>
(
	<View style={[styles.prognosisBtnView]}>
		<Button transparent bordered style={[styles.prognosisBtn,styles.urgentColor]}  onPress= {()=>props.handleLegendClick(1)}>
			<Image small source={require("../Images/urgent.png")}/>
			<Text style={[ styles.urgentTextColor ]}>{"Urgent : "}</Text>
			<Text style={[ styles.urgentValueColor ]}>{props.urgentAssetCount}</Text>
		</Button>

    	<Button transparent bordered style={[styles.prognosisBtn,styles.checkupColor]} onPress= {()=>props.handleLegendClick(2)}>
      		<Image small source={require("../Images/checkup.png")}/>
      		<Text style={[ styles.checkupTextColor ]}>{"Checkup : "}</Text>
			<Text style={[ styles.checkupValueColor ]}>{props.checkupAssetCount}</Text>
    	</Button>

    	<Button transparent bordered  style={[styles.prognosisBtn,styles.healthyColor]} onPress= {()=>props.handleLegendClick(3)}>
      		<Image small source={require("../Images/good.png")}/>
      		<Text style={[ styles.healthyTextColor ]}>{"Good : "}</Text>
			<Text style={[ styles.healthyValueColor ]}>{props.goodAssetCount}</Text>
    	</Button>

    	<Button transparent bordered  style={[styles.prognosisBtn,styles.unknownColor]} onPress= {()=>props.handleLegendClick(4)}>
      		<Image small source={require("../Images/unknown-sm.png")}/>
      		<Text style={[ styles.unknownTextColor ]}>{"Unknown : "}</Text>
      		<Text style={[ styles.unknownValueColor ]}>{props.unknownAssetCount}</Text>
    	</Button>

    	{/* <Button transparent bordered  style={[styles.prognosisBtn,styles.blackcolor]} onPress= {()=>props.handleLegendClick(5)}>
      		<Image small source={require("../Images/blank.png")}/>
      		<Text style={[ styles.blackTextcolor ]}>{"Total count : "}</Text>
			<Text style={[ styles.blackValuecolor ]}>{props.totalAssets}</Text>
    	</Button> */}
  	</View>
)
export default Legend;