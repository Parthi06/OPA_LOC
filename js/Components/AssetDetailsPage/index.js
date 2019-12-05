import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Container, Header, Content, Text, Icon, Left, Right, Body, Thumbnail, Button, Spinner } from "native-base";
import { View, ActivityIndicator, TouchableOpacity, FlatList, Dimensions, Switch, Image, AppState, PermissionsAndroid } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import AssetDetailsFooter from './AssetDetailsFooter';
import * as assetActions from '../../Actions/AssetActions';
import * as ticketActions from '../../Actions/TicketActions'
import * as constants from '../../Utils/Constants';
import * as eventActions from '../../Actions/EventActions';
import * as appConstants from '../../Utils/AppConstants';
import * as AppUtils from '../../Utils/AppUtils';
import LineGraph from './LineGraph';
import ProgressBar from './ProgressBar';
import PMSchedule from './PMSchedule';
import ToggleButton from '../GenericComponents/ToggleButton'
import SectionSeparator from '../General/SectionSeparator';
import ReportDownload from './ReportDownload';
import * as  mockData from './pm_schedule';
import _ from 'lodash';
import * as faultEnumActions from '../../Actions/FaultEnumActions';
import ForceUpgrade from '../GenericComponents/ForceUpgrade';
import * as loginActions from '../../Actions/LoginActions';
import * as helpActions from '../../Actions/HelpActions';

const dimensions = parseInt(Dimensions.get('window').width / 50);

const startTime = " 00:00:00";
const endTime = " 23:59:59"

class AssetDetailsPage extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			moteLineGraphData: [],
			moteFrequencyData: [],
			yFreqMax: 0,
			yFreqMin: 0,
			zoomDomain: {},
			lineGraphDomain: {},
			selectedParam: 0,
			paramsForLineGraph: [],
			flag: 0,
			ticketsFiltered: [],
			fetchedDataLimit:1, // fetch first 15 if it is 1, next 15 if it is 2
			showUpgradeWindow : true,
			appState  : AppState.currentState,
		}
		this.onAssetHistoryClick = this.onAssetHistoryClick.bind(this);
		this.ticketEventCallback = this.ticketEventCallback.bind(this);
		this.prepareMoteFrequencyData = this.prepareMoteFrequencyData.bind(this);
		this.getDomainDefaultAxisRange = this.getDomainDefaultAxisRange.bind(this);
		this.changeLineGraph = this.changeLineGraph.bind(this);
		AppState.addEventListener('change', this._handleAppStateChange);
	}

	static navigationOptions = {
		header: null
	};

	componentWillMount() {  //TODO Change
		this.setState({
			//assetDetails: this.props.navigation.state.params.assetParam,
			feedDetails: this.props.navigation.state.params.feedParam
		});
	}

	componentDidMount() {
		// Load feed events for asset history page
		this.props.assetActions.loadAssetsByIdFromApi(this.state.feedDetails.assetId);
		this.props.eventActions.loadFeedEventsByAssetId(this.state.feedDetails.assetId, this.props.userAuth.userId, this.state.fetchedDataLimit, 15)
		this.props.assetActions.loadAllProcessedDataForAnAsset([]);
		this.props.assetActions.loadProcessedDataFromAPI( this.state.feedDetails.assetId, true );
		this.props.assetActions.loadAssetOperationalInfoFromApi(this.state.feedDetails.assetId);
		this.props.faultEnumActions.loadFaultEnumsFromApi();
		this.props.helpActions.loadGraphMetricsDetails();
	}

	getEventById = () => {
		this.props.assetActions.loadAssetsByIdFromApi(this.state.feedDetails.assetId); //Crash error point 1
		this.props.assetActions.loadAssetOperationalInfoFromApi(this.state.feedDetails.assetId);
		this.props.assetActions.loadProcessedDataFromAPI(this.state.feedDetails.assetId, false);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (((nextProps.assetDetailsById.assetId === this.props.assetDetailsById.assetId) && (nextProps.assetDetailsById.checkupTime != this.props.assetDetailsById.checkupTime))){
			this.setState({
				assetDetails: nextProps.assetDetailsById
			});
			return true;
		}

		if ((nextProps.processedData !== this.props.processedData)
		|| (nextProps.processedData.graphs !== this.props.processedData.graphs)
		|| (nextState.moteLineGraphData !== this.state.moteLineGraphData)
		|| (nextState.moteFrequencyData !== this.state.moteFrequencyData)) {
			return true;
		}
		if (this.props.assetOperationalInfoList != nextProps.assetOperationalInfoList) {
			return true;
		}
		return false;
	}

componentWillReceiveProps(nextProps) {
	// Ticket 210
	if (  nextProps.processedData.prognosis ) {
		if( (typeof nextProps.processedData.prognosis.prognosisSummary1 )){
			this.setState({
				prognosisSummary1: nextProps.processedData.prognosis.prognosisSummary1
			})
		} 
		
		if(  (typeof nextProps.processedData.prognosis.prognosisDetails1) ) {
			this.setState({
				prognosisDetails1: nextProps.processedData.prognosis.prognosisDetails1
			})
		}
	}
	
	if ((!nextProps.isGraphLoading) && (nextProps.processedData != null) && nextProps.processedData.moteId != null) {
	
	if (nextProps.processedData.graphs != null && nextProps.processedData.graphs.bubbleGraph != null)
		this.prepareMoteFrequencyData(nextProps.processedData.graphs.bubbleGraph);
	if (nextProps.processedData.graphs != null && nextProps.processedData.graphs.lineGraph != null) {
		this.prepareMoteLineGraphData(nextProps.processedData.graphs.lineGraph, nextProps.processedData.lineGraphParams, this.state.selectedParam);
	}
	if (this.props.assetOperationalInfoList.dateTimeState !== nextProps.assetOperationalInfoList.dateTimeState) {
		this.setState(this.state);
	}
	} else {
		this.setState({
			moteLineGraphData: []
		})
	}

	let filteredAssociatedTickets = [];
	for (eachTicket in this.props.assetDetailsById.ticketIdAndStatus) {
		if (this.props.assetDetailsById.ticketIdAndStatus[eachTicket].status === 'OPEN' || this.props.assetDetailsById.ticketIdAndStatus[eachTicket].status === 'REOPENED') {
			filteredAssociatedTickets.push( this.props.assetDetailsById.ticketIdAndStatus[eachTicket].id );
		}
	}
	this.setState({
		ticketsFiltered: filteredAssociatedTickets
	})
}

downloadReportAPI = (startDate, endDate) => {
	var that = this;
	async function request_storage_runtime_permission() {
		const granted = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
//              ,
//              {
//                  'title': 'OPA Access Permission Request',
//                  'message': 'Allow OPA to write into your device'
//              }
		);
		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			that.props.helpActions.downloadReportAPI( that.props.userAuth.token, startDate + startTime, endDate + endTime, that.state.feedDetails.assetId, that.state.feedDetails.assetTag);
		} else {
			alert("Measurement data will not be downloaded if permission is denied.");
		}
	}
	request_storage_runtime_permission();
}

prepareMoteFrequencyData(moteFrequencyReportProps) {

	var freqPeakAccPsdArr = [];
	var freqArr = [];
	var xMax = 25;
	var xMin = 1;
	var yMax = 0;
	var yMin = 0;
	var percent = 0;
	var outputSize = 0;
	// var newDataTemp = moteFrequencyReportProps.map((entry) => {
	//   freqPeakAccPsdArr.push(entry.opacity);
	//   freqArr.push(entry.y);
	// });
	min = Math.min(...freqPeakAccPsdArr);
	max = Math.max(...freqPeakAccPsdArr);
	yMax = Math.max(...freqArr);
	yMin = Math.min(...freqArr);
	var newData = moteFrequencyReportProps.map((entry) => {
		percent = (entry.opacity - min) / (max - min);
		outputSize = percent * (xMax - xMin) + xMin;

		return (
			{
				x: new Date(entry.x),
				y: parseInt(entry.y),
				psd: entry.opacity,
				labelPoint: entry.label,
				size: 7,
				opacity: outputSize,
				fill: "blue"
			}
		);
	});

	var dateXAxis = null;
	if ((newData != null) && (typeof newData[0] != "undefined"))
	dateXAxis = [newData[0].x, newData[newData.length - 1].x];
	this.setState({
		moteFrequencyData: newData,
		zoomDomain: { x: dateXAxis, y: [parseInt(yMin), parseInt(yMax)] }
	})
}

changeLineGraph(param) {
	this.setState({ selectedParam: param });
	this.prepareMoteLineGraphData(this.props.processedData.graphs.lineGraph, this.props.processedData.lineGraphParams, param);
}

parseDateTime(dt) {
	var date = false;
	if (dt) {
		var c_date = new Date(dt);
		var hrs = c_date.getHours();
		var min = c_date.getMinutes();
		if (isNaN(hrs) || isNaN(min) || c_date === "Invalid Date") {
			return null;
		}
		var type = (hrs <= 12) ? " AM" : " PM";
		date = ((+hrs % 12) || hrs) + ":" + min + type;
	}
	return new Date(c_date.getMonth() + '-' + c_date.getDate() + '-' + c_date.getFullYear() + " " + date);
}

prepareMoteLineGraphData(moteReportProps, lineGraphParams, selectedLineGraphParam) {
	var yMax = 0.0;
	var yMin = 0.0;
	var yValues = [];

	if (lineGraphParams != null) {
		var param = lineGraphParams[parseInt(selectedLineGraphParam)];
		var filteredData = (moteReportProps).filter(entry => entry.param == param);
		var newData = (filteredData).map((entry, index) => {
			yValues.push(parseFloat(entry.y));
			return (
			{
				x: entry.x,
				y: parseFloat(entry.y),
				param: entry.param,
				unit: entry.label
			});
		});

		yMin = Math.min(0.75 * _.mean(yValues), Math.min(...yValues));
		yMax = Math.max(1.25 * _.mean(yValues), Math.max(...yValues));

		// yMax = Math.max(...yValues);
		// yMin = Math.min(...yValues);

		var dateXAxis = null;
		if ((newData != null) && (typeof newData[0] != "undefined"))
			dateXAxis = [newData[0].x, newData[newData.length - 1].x];
		
		this.setState({
			moteLineGraphData   : newData,
			lineGraphDomain     : { x: dateXAxis, y: [yMin, yMax] },
			paramsForLineGraph  : lineGraphParams
		}) 
	}
}

getDomainDefaultAxisRange(date1Temp, date2Temp) {
	var date1 = new Date(date1Temp.getFullYear(), date1Temp.getMonth(),
	date1Temp.getDate() - 1, date1Temp.getHours(), date1Temp.getMinutes(), date1Temp.getSeconds());
	var date2 = new Date(date2Temp.getFullYear(), date2Temp.getMonth(),
	date2Temp.getDate() + 1, date2Temp.getHours(), date2Temp.getMinutes(), date2Temp.getSeconds())
	var dateTemp = [date1, date2];
	return dateTemp;
}

onAssetHistoryClick = () => {
	this.props.navigation.navigate("FeedWithoutDrawNav", { 
	currentScreen : constants.ASSET_HISTORY_SCREEN, 
	assetParam    : { 
		assetHistoryDetails : this.props.assetHistoryDetails,
		assetTag            : this.props.assetDetailsById.assetTag,
		assetId             : this.props.assetDetailsById.assetId,
		fetchedDataLimit    : this.state.fetchedDataLimit
		} 
	});
}


ticketEventCallback = (ticketId) => {
	this.setState({ flag: 1 });
	this.props.ticketActions.fetchTicketEventFromAPI(ticketId);
	setTimeout(() => {
		if (this.props.ticketEvent !== null && this.props.ticketEvent !== undefined) {
			this.setState({ flag: 0 });
			console.log('---------asett page--------'+JSON.stringify(this.props.ticketEvent))
			this.props.navigation.navigate({ routeName: 'TicketDetailsPage', params: { ticketParam: this.props.ticketEvent, assetParam: this.state.assetDetails } })
		}
	}, 2000);
}

moteStatusChangeHandler = ( assetId, moteId, currentStatus) => {
	if(currentStatus != appConstants.MOTE_STATE_DEPLOYED) {
		if (typeof moteId !== "undefined" && typeof currentStatus !== "undefined") {
			this.props.assetActions.updateMoteStatus(assetId, moteId, "A")
		}
	}
}

feedBackBtnClickHandler = () => {
	this.props.navigation.navigate( { routeName: 'FeedBacks',
		params              : {
			assetDetails          : this.props.assetDetailsById,
			faultEnums            : this.props.faultEnums,
			userAuth              : this.props.userAuth ,
			assetActions          : this.props.assetActions
		}
	});
}

//App foreground-background change handler
_handleAppStateChange = ( nextAppState ) => {
	console.log('App changed!' + this.state.appState);
	if ( this.state.appState.match(/inactive|background/) && nextAppState === 'active' ) {
		console.log('\nApp has come to the foreground!');
		this.setState( { showUpgradeWindow : true } )
		this.props.loginActions.checkForAppUpgradation();
	}
	this.setState( { appState : nextAppState } );
};


updateLaterHandler = () =>  {
	console.log('Later button clicked -         -             -        -')
	this.setState( { showUpgradeWindow : false } )
	this.props.loginActions.checkForAppUpgradation();
}

render() {
	return (
		<Container style={{ backgroundColor: '#ffffff' }}>
			<Header style={{ backgroundColor: '#ffffff', elevation: 0 }}>
			<Left style = {{ flex: 1 }}>
			{
				(this.props.appUpgradationStatus.forceUpgrade  ||   (this.props.appUpgradationStatus.laterUpgrade  && this.state.showUpgradeWindow ))
				? null
				:
				<View>
				<TouchableOpacity><Icon style={{ fontSize: 30, paddingLeft: 5 }} name="close" onPress={() => this.props.navigation.goBack()} /></TouchableOpacity>
				</View>
			}
			</Left>
			<Body><Text style={{ fontWeight: "bold" }}>Asset Details</Text></Body>
			<Right><Icon style={{ fontSize: 25, color: "white" }} name="md-checkmark" /></Right>
			</Header>
			<Header style={{ backgroundColor: '#ffffff', elevation: 0, height: 0 }}>
			<ProgressBar getEventById={this.getEventById}></ProgressBar>
			</Header>
			{
			this.props.appUpgradationStatus.forceUpgrade  
			?  <ForceUpgrade forceUpgrade = { true } />
			:  this.props.appUpgradationStatus.laterUpgrade  && this.state.showUpgradeWindow
			?  <ForceUpgrade forceUpgrade = { false } updateLaterHandler = { this.updateLaterHandler } showLoader = { this.state.showLoader }/>
			:
			<Content padder>
			<Grid size={300}>
				{(this.props.userAuth.customerType == "PRIMARY") ? <Row size={20} style={{ paddingTop: 10 }}>
				<Col size={7}><Text style={{ fontWeight: "bold" }}>Customer Name</Text></Col>
				<Col size={11}><Text>	{(this.props.assetDetailsById != null && this.props.assetDetailsById.customerName != "") ? this.props.assetDetailsById.customerName : "-"}</Text></Col>
				</Row> : <Row></Row>}
				<Row size={20}>
				<Col size={7}><Text style={{ fontWeight: "bold" }}>Asset</Text></Col>
				<Col size={11}><Text>{(this.props.assetDetailsById != null && this.props.assetDetailsById.assetTag != "") ? this.props.assetDetailsById.assetTag : "-"}</Text></Col>
				</Row>
				<Row size={20}>
				<Col size={7}><Text style={{ fontWeight: "bold" }}>Type</Text></Col>
				<Col size={11}><Text>{(this.props.assetDetailsById != null && this.props.assetDetailsById.assetType != "") ? this.props.assetDetailsById.assetType : "-"}</Text></Col>
				</Row>
				<Row size={20}>
				<Col size={7}><Text style={{ fontWeight: "bold" }}>Address</Text></Col>
				<Col size={11}><Text>{(this.props.assetDetailsById != null && this.props.assetDetailsById.assetAddress != "") ? this.props.assetDetailsById.assetAddress : "-"}</Text></Col>
				</Row>
				<SectionSeparator sectionHeader={"Condition"} />
				<Row size={20}>
				<Col size={7}><Text style={{ fontWeight: "bold" }}>Prognosis</Text></Col>
				<Col size={11}><Thumbnail style={{ height: 25, width: 25 }} small
					source={
					(this.state.prognosisSummary1 == "Checkup") ?
						(
						(this.state.prognosisDetails1 != undefined) ?
							(
							this.state.prognosisDetails1.toUpperCase().includes("CALIBRATING") ?
								require("../AssetList/Images/calibrating-checkup-sm.png") :
								require("../AssetList/Images/checkupAsset.png")
							)
							:
							require("../AssetList/Images/checkupAsset.png")
						) :
						(this.state.prognosisSummary1 == "Urgent_Attention") ?
						(
							(this.state.prognosisDetails1 != undefined) ?
							(
								this.state.prognosisDetails1.toUpperCase().includes("CALIBRATING") ?
								require("../AssetList/Images/calibrating-urgent-sm.png") :
								require("../AssetList/Images/emergencyAsset.png")
							) :
							require("../AssetList/Images/emergencyAsset.png")
						) :
						(this.state.prognosisSummary1 == "Good") ?
							(
							(this.state.prognosisDetails1 != undefined) ?
								(
								this.state.prognosisDetails1.toUpperCase().includes("CALIBRATING") ?
									require("../AssetList/Images/calibrating-good-sm.png") :
									require("../AssetList/Images/goodAsset.png")
								) :
								require("../AssetList/Images/goodAsset.png")
							) :
							(this.state.prognosisSummary1 == "Unknown") ?
							(
								(this.state.prognosisDetails1 != undefined) ?
								(
									this.state.prognosisDetails1.toUpperCase().includes("CALIBRATING") ?
									require("../AssetList/Images/calibrating-unknown-sm.png") :
									require("../AssetList/Images/Unknown.png")
								) :
								require("../AssetList/Images/Unknown.png")
							)
							: null
					} />
				</Col>
				</Row>
				<Row size={20}>
				<Col size={7}><Text style={{ fontWeight: "bold" }}></Text></Col>
				<Col size={11}><Text>{(this.props.assetDetailsById.prognosisTimelineDataTime != null && this.props.assetDetailsById.prognosisTimelineDataTime != "") ? AppUtils.convertTimestampToDateTime(this.props.assetDetailsById.prognosisTimelineDataTime) : " "}</Text></Col>
			</Row>
				<Row size={20}>
				<Col size={7}><Text style={{ fontWeight: "bold" }}></Text></Col>
				<Col size={11}><Text>{(this.state.prognosisDetails1 != null && this.state.prognosisDetails1 != "") ? this.state.prognosisDetails1 : " "}</Text></Col>
				</Row>

				<Row size={20}>
				<Col size={7}><Text style={{ fontWeight: "bold" }}></Text></Col>
				<Col size={11}><Text>{(this.props.assetDetailsById.prognosisTimelineNote != null && this.props.assetDetailsById.prognosisTimelineNote != "") ? this.props.assetDetailsById.prognosisTimelineNote : " "}</Text></Col>
				</Row>

				<Row size={20}>
					<Col size={7}><Text style={{ fontWeight: "bold" }}>Last Feedback</Text></Col>
					<Col size={11}><Text>{(this.props.assetDetailsById.interventionTimeline && (this.props.assetDetailsById.interventionTimeline.dateTime != null && this.props.assetDetailsById.interventionTimeline.dateTime != "")) ? AppUtils.convertTimestampToDateTime(this.props.assetDetailsById.interventionTimeline.dateTime) : " "}</Text></Col>
			</Row>
				<Row size={20}>
					<Col size={7}><Text style={{ fontWeight: "bold" }}></Text></Col>
					<Col size={11}><Text>{(this.props.assetDetailsById.interventionTimeline && (this.props.assetDetailsById.interventionTimeline.checkupResult != null && this.props.assetDetailsById.interventionTimeline.checkupResult != "")) ? this.props.assetDetailsById.interventionTimeline.checkupResult : " "}</Text></Col>
				</Row>
				<Row size={20}>
				<Col size={7}><Text style={{ fontWeight: "bold" }}></Text></Col>
				<Col size={11}><Text>{(this.props.assetDetailsById.interventionTimeline && (this.props.assetDetailsById.interventionTimeline.checkupFaultDiagnosisEnum != null && this.props.assetDetailsById.interventionTimeline.checkupFaultDiagnosisEnum >= 0)) ?
					this.props.faultEnums.map(faultEnumsItem => {
					if (faultEnumsItem.id === this.props.assetDetailsById.interventionTimeline.checkupFaultDiagnosisEnum)
						return faultEnumsItem.faultString;
					}) : " "}</Text></Col>
				</Row>
				<Row size={20}>
				<Col size={7}><Text style={{ fontWeight: "bold" }}></Text></Col>
				<Col size={11}><Text>{(this.props.assetDetailsById.interventionTimeline && (this.props.assetDetailsById.interventionTimeline.notes != null && this.props.assetDetailsById.interventionTimeline.notes != "")) ? this.props.assetDetailsById.interventionTimeline.notes : " "}</Text></Col>
				</Row>     
				<SectionSeparator sectionHeader = {"Operational Info"}/>
				<Row size={20}>
				<Col size={7}><Text style={{ fontWeight: "bold" }}>Current State</Text></Col>
				<Col size={11}><Text>{(this.props.assetOperationalInfoList.stateStr != null) ? this.props.assetOperationalInfoList.stateStr : " "}</Text></Col>
				</Row>
				<Row size={20}>
				<Col size={7}><Text style={{ fontWeight: "bold" }}>State Start Time</Text></Col>
				<Col size={11}><Text>{(this.props.assetOperationalInfoList.dateTimeState != null) ? AppUtils.convertTimestampToDateTime(this.props.assetOperationalInfoList.dateTimeState) : "-"}</Text></Col>
				</Row>
				<Row size={20}>
				<Col size={7}><Text style={{ fontWeight: "bold" }}>Last State</Text></Col>
				<Col size={11}><Text>{(this.props.assetOperationalInfoList.lastStateStr != null) ? this.props.assetOperationalInfoList.lastStateStr : "-"}</Text></Col>
				</Row>
				<Row size={20}>
				<Col size={7}><Text style={{ fontWeight: "bold" }}>Last State Start Time</Text></Col>
				<Col size={11}><Text>{(this.props.assetOperationalInfoList.dateTimeLastState != null) ? AppUtils.convertTimestampToDateTime(this.props.assetOperationalInfoList.dateTimeLastState) : "-"}</Text></Col>
				</Row>
				<Row size={20}>
				<Col size={7}><Text style={{ fontWeight: "bold" }}>Total Activity Time</Text></Col>
				<Col size={11}><Text>{(this.props.assetOperationalInfoList.cumulativeActive != null) ? AppUtils.convertSecondsToTime(this.props.assetOperationalInfoList.cumulativeActive) : "-"}</Text></Col>
				</Row>
				<Row size={20}>
				<Col size={7}><Text style={{ fontWeight: "bold" }}>Total Inactivity Time</Text></Col>
				<Col size={11}><Text>{(this.props.assetOperationalInfoList.cumulativeInactive != null) ? AppUtils.convertSecondsToTime(this.props.assetOperationalInfoList.cumulativeInactive) : "-"}</Text></Col>
				</Row>
				<SectionSeparator sectionHeader={"Active Ticket(s) [" + ((typeof this.state.ticketsFiltered != 'undefined') ? this.state.ticketsFiltered.length : 0) + "]"} />
				<Row size={20}>
				<FlatList
					columnWrapperStyle={{ flexWrap: 'wrap' }}
					data={this.state.ticketsFiltered}
					renderItem={({ item }) => (
					<TouchableOpacity key={item} onPress={() => this.ticketEventCallback(item)}><Text style={{ color: "blue", paddingRight: 7, paddingTop: 10 }}>{item}</Text></TouchableOpacity>
					)}
					keyExtractor={item => item}
					numColumns={dimensions} />
				</Row>
				<Row size={20}>  
				{
				(this.state.ticketsFiltered.length < 1)  ? 
				<Row  size={18} style={{paddingTop:5}}>
					<Text style={{ fontWeight: "bold" }}>No Open Tickets     </Text>
				<Text >  Quick feedback ?    </Text>   
				<TouchableOpacity onPress = { this.feedBackBtnClickHandler }>  
				
					<Image  style = {{ height: 50, width: 50}}  
					source = {appConstants.FEEDBACK_ICON} />
					
				</TouchableOpacity> 
				</Row>
				:
				null         
			}
				</Row>

				{(this.props.assetOperationalInfoList.customInfo && this.props.assetOperationalInfoList.customInfo != null) ?
				<PMSchedule pm_schedule={this.props.assetOperationalInfoList.customInfo} /> : <Text></Text>}
				<Row size={20}>
				<Col size={7}></Col>
				<Col size={11}>{(this.state.flag == 1) ? <View style={{ alignSelf: "flex-start" }}><ActivityIndicator size="small" color="#3498DB" /></View> : null}</Col>
				</Row>
				<SectionSeparator sectionHeader={"Monitoring Info"} />

				{(!this.props.isGraphLoading) ?
				<View>
					<Row size={10} style={{ paddingTop: 10 }}>
					<Col><Text style={{ fontWeight: "bold" }}>Install Location</Text></Col>

					<Col>{(this.props.processedData.moteId == 0 || this.props.processedData.moteId == null || this.props.processedData.locationLabel == "NULL") ? <Text note>{"Not Available"}</Text> : <Text>{this.props.processedData.locationLabel}</Text>}</Col>
					</Row>
					<Row size={10}>
					<Col><Text style={{ fontWeight: "bold" }}>Mote ID</Text></Col>
					<Col>{(this.props.processedData.moteId == 0 || this.props.processedData.moteId == null || this.props.processedData.state === "Not_Installed") ? <Text note>{"Not Available"}</Text> : <Text>{"0x" + parseInt(this.props.processedData.moteId).toString(16)}</Text>}</Col>
					</Row>
					<Row size={20}>                  
					<Col><Text style={{ fontWeight: "bold" }}>Mote Installed</Text></Col>

					<Col>
					{
					(this.props.processedData.moteId == 0 || this.props.processedData.moteId == null || this.props.processedData.moteId === undefined) ? <Text note>{"Not Available"}</Text>:
					<ToggleButton  stateOne="No  "  stateTwo="  Yes" 
					toggleSwitch = { () => { this.moteStatusChangeHandler ( this.state.feedDetails.assetId, this.props.processedData.moteId, this.props.processedData.state) }}
					toggleStatus =  { (this.props.processedData.state == appConstants.MOTE_STATE_DEPLOYED ) ? true : false} 

					/>  
					}
					</Col>
					</Row>

					<Row size={10}>
					<Col><Text style={{ fontWeight: "bold" }}>Last Rx Time</Text></Col>
					<Col>{(this.props.processedData.moteId == 0 || this.props.processedData.moteId == null || this.props.processedData.dateTime == null) ? <Text note>{"Not Available"}</Text> : <Text>{AppUtils.convertTimestampToDateTime(this.props.processedData.dateTime)}</Text>}</Col>
					</Row>
					<Row style={{ paddingTop: 30, flex: 1 }}>
					<LineGraph
						loadMetricsDetailsReducer={this.props.loadMetricsDetailsReducer}
						moteLineGraphData={this.state.moteLineGraphData}
						paramsForLineGraph={this.state.paramsForLineGraph}
						lineGraphDomain={this.state.lineGraphDomain}
						changeLineGraph={this.changeLineGraph} />
					</Row>
				</View> : <ActivityIndicator size="small" color="#3498DB" />
				}
				<SectionSeparator sectionHeader={"Measurement Data"} />
				<ReportDownload downloadReportAPI = { this.downloadReportAPI } />
			</Grid>
			</Content>
		}
		{
			(this.props.appUpgradationStatus.forceUpgrade  ||   (this.props.appUpgradationStatus.laterUpgrade  && this.state.showUpgradeWindow ))
			? null
			:
			<AssetDetailsFooter onAssetHistoryClick={this.onAssetHistoryClick} />
		}
		</Container>
		);
	}
}


function mapStateToProps(state, ownProps) {
	return {
		ticketEvent: state.fetchTicketEventReducer,
		processedData: state.processedDataReducer,
		isGraphLoading: state.processedDataPending,
		assetDetailsById: state.loadAssetById,
		assetOperationalInfoList: state.loadassetOperationalInfoReducer,
		userAuth: state.loginReducer,
		faultEnums: state.faultEnumReducer,
		assetHistoryDetails:state.assetHistoryDetailsReducer,
		appUpgradationStatus: state.appUpgradationStatus,
		loadMetricsDetailsReducer:state.loadMetricsDetailsReducer

	}
};

function mapDispatchToProps(dispatch) {
	return {
		eventActions: bindActionCreators(eventActions, dispatch),
		ticketActions: bindActionCreators(ticketActions, dispatch),
		assetActions: bindActionCreators(assetActions, dispatch),
		faultEnumActions: bindActionCreators(faultEnumActions, dispatch),
		loginActions: bindActionCreators(loginActions, dispatch),
		helpActions: bindActionCreators(helpActions, dispatch)

	};
};
export default connect(mapStateToProps, mapDispatchToProps)(AssetDetailsPage);
