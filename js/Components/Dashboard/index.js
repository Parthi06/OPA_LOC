import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Dimensions, ActivityIndicator, AppState } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { bindActionCreators } from "redux";
import { Container, Header, Title, Content, Text, Button, Icon, Left, Right, Body, Row } from "native-base";
import { Col,Grid } from 'react-native-easy-grid';
import * as assetActions from '../../Actions/AssetActions';
import * as userActions from '../../Actions/UserActions';
import Legend from './Legend';
import PieChart from './PieChart';
import * as constants from '../../Utils/Constants';
import styles from "./styles";
import ForceUpgrade from '../GenericComponents/ForceUpgrade';
import * as loginActions from '../../Actions/LoginActions';
import { withNavigationFocus } from 'react-navigation';
import DashboardBar from './DashboardBar';

class Dashboard extends React.PureComponent
{
	constructor(props)
	{
    	super(props);
		this.state = 
		{
      		goodAssetCount: 0,
      		checkupAssetCount: 0,
      		urgentAssetCount: 0,
      		status: false,
      		label: null,
      		showUpgradeWindow:true,
      		appState: AppState.currentState,
			curScreen: (this.props.navigation.state.params == undefined) ? constants.DASHBOARD_SCREEN : this.props.navigation.state.params.currentScreen,
			screenWidth: Dimensions.get('window').width,
			screenHeight: Dimensions.get('window').height,
			heightAdjVal:0.8
    	}
    	this.handleLegendClick = this.handleLegendClick.bind(this);
		AppState.addEventListener('change', this._handleAppStateChange);
		this.onScreenOrientationChange = this.onScreenOrientationChange.bind(this);
  	}

    onScreenOrientationChange(e)
	{
		if(Dimensions.get('window').width > Dimensions.get('window').height)
		{
			heightAdjVal = 0.7;
		} else
		{
			heightAdjVal = 0.8
		}
		this.setState(
			{
				screenWidth: Dimensions.get('window').width,
				screenHeight: Dimensions.get('window').height,
				heightAdjVal: heightAdjVal
			}
		);
	}
	
	static navigationOptions =
	{
		header: null
	};

  	componentDidUpdate(prevProps) 
  	{
    	if (this.props.isFocused && !prevProps.isFocused) 
    	{
      		this.loadInitialData()
    	}
  	}

  	componentDidMount()
  	{
    	setTimeout(() => this.loadInitialData(), 0);
  	}

  	loadInitialData()
  	{
    	NetInfo.isConnected.fetch().done(
				(isConnected) =>
				{
					this.setState({ status: isConnected });
					if (isConnected)
					{
						this.props.assetActions.fetchAssetsCount(this.props.userAuth.customerId);
						this.props.assetActions.fetchAllAssetByCustomerId(this.props.userAuth.customerId);
					} else if (!isConnected && this.props.assets.length == 0)
					{
						this.setState({ label: "Please Verify your Internet Connection!" });
					}
				}
			);
		}
		
		getEventById = () => {
			this.props.assetActions.fetchAssetsCount(this.props.userAuth.customerId);
			this.props.assetActions.fetchAllAssetByCustomerId(this.props.userAuth.customerId);			
		}

		handleLegendClick = (btnId) =>
		{
    		//alert(this.props.assets);
		switch (btnId)
		{
      		case 1:
        		this.props.navigation.navigate("AssetWithoutDrawNav", { currentScreen: constants.DASHBOARD_SCREEN, prognosis: constants.URGENT });
        		break;
      		case 2:
        		this.props.navigation.navigate("AssetWithoutDrawNav", { currentScreen: constants.DASHBOARD_SCREEN, prognosis: constants.CHECKUP });
        		break;
      		case 3:
        		this.props.navigation.navigate("AssetWithoutDrawNav", { currentScreen: constants.DASHBOARD_SCREEN, prognosis: constants.HEALTHY });
        		break;
      		case 4:
        		this.props.navigation.navigate("AssetWithoutDrawNav", { currentScreen: constants.DASHBOARD_SCREEN, prognosis: constants.UNKNOWN });
        		break;
      		default:
				this.props.navigation.navigate("AssetWithoutDrawNav", { currentScreen: constants.DASHBOARD_SCREEN, prognosis: constants.ALL });
				break;
    	}
  	}

	//App foreground-background change handler
	_handleAppStateChange = ( nextAppState ) =>
	{
  		console.log('App changed!' + this.state.appState);
		if ( this.state.appState.match(/inactive|background/) && nextAppState === 'active' )
		{
    		console.log('\nApp has come to the foreground!');
    		this.setState( { showUpgradeWindow : true } )
    		this.props.loginActions.checkForAppUpgradation();
  		}
  		this.setState( { appState : nextAppState } );
	};

	updateLaterHandler = () =>
	{
    	console.log('Disabling later button         -            -           -')
    	this.setState( { showUpgradeWindow : false } )
  	}

	render()
	{
		let totalAssets = this.props.assetPrognosisCount.urgentAssetCount + this.props.assetPrognosisCount.checkupAssetCount + this.props.assetPrognosisCount.healthyAssetCount + this.props.assetPrognosisCount.unknownAssetCount;
		let urgentPercent = (this.props.assetPrognosisCount.urgentAssetCount > 0) ? Math.round((this.props.assetPrognosisCount.urgentAssetCount / totalAssets) * 100) : 0;
		let checkupPercent = (this.props.assetPrognosisCount.checkupAssetCount > 0) ? Math.round((this.props.assetPrognosisCount.checkupAssetCount / totalAssets) * 100) : 0;
		let goodPercent = (this.props.assetPrognosisCount.healthyAssetCount > 0) ? Math.round((this.props.assetPrognosisCount.healthyAssetCount / totalAssets) * 100) : 0;
		let unknownPercent =(this.props.assetPrognosisCount.unknownAssetCount > 0) ? Math.round((this.props.assetPrognosisCount.unknownAssetCount / totalAssets) * 100) : 0;
		return (
      		<Container style={{ backgroundColor: '#ffffff', flex: 1 }}>
        		<Header style={{ backgroundColor: '#ffffff' }}>
							<Left style={{ flex: 1 }}><Icon active name="ios-menu" onPress={() => this.props.navigation.toggleDrawer()} /></Left>
							<Body style={{alignItems: "center", paddingRight:'5%' }}><Title style={{ color: 'black' }}>DASHBOARD</Title></Body>
							{/* <Right><Button transparent></Button></Right> */}
							<DashboardBar getEventById={this.getEventById}></DashboardBar>
        		</Header>
        		{this.props.appUpgradationStatus.forceUpgrade ?
					<ForceUpgrade forceUpgrade = { true } />
				:  
					this.props.appUpgradationStatus.laterUpgrade  && this.state.showUpgradeWindow ?
						<ForceUpgrade forceUpgrade = { false } updateLaterHandler = { this.updateLaterHandler }/>
          :
            <Content padder>
				<View style={{ flex: 1 }} onLayout={this.onScreenOrientationChange}>
                  <View style={{ height:this.state.screenHeight * this.state.heightAdjVal }}>
                  {(this.state.label == null) ?
                      <Grid style={{alignItems: 'center'}}>
                        {this.state.screenWidth < this.state.screenHeight ?
                          totalAssets > 0 ?
                            <Row size={50}>
                              <PieChart goodAssetCount={this.props.assetPrognosisCount.healthyAssetCount}
                                checkupAssetCount={this.props.assetPrognosisCount.checkupAssetCount}
                                urgentAssetCount={this.props.assetPrognosisCount.urgentAssetCount}
                                unknownAssetCount = {this.props.assetPrognosisCount.unknownAssetCount}
                                urgentPercent={urgentPercent}
                                checkupPercent={checkupPercent}
                                goodPercent={goodPercent} 
								unknownPercent = {unknownPercent}
								innerRadius={this.state.screenWidth * 0.0825}
								labelRadius={this.state.screenWidth * 0.20}
								width={this.state.screenWidth * 0.6}
								height={this.state.screenWidth * 0.6}								
                              />
                            </Row>
                          :	
                            <Row size={50}><Text note>No Assets</Text></Row>
                        :
                          totalAssets > 0 ?
                            <Col style={{alignItems:'center', width:this.state.screenWidth * 0.5}}>
                              <PieChart goodAssetCount={this.props.assetPrognosisCount.healthyAssetCount}
                                checkupAssetCount={this.props.assetPrognosisCount.checkupAssetCount}
                                urgentAssetCount={this.props.assetPrognosisCount.urgentAssetCount}
                                unknownAssetCount = {this.props.assetPrognosisCount.unknownAssetCount}
                                urgentPercent={urgentPercent}
                                checkupPercent={checkupPercent}
                                goodPercent={goodPercent} 
								unknownPercent = {unknownPercent}
								innerRadius={this.state.screenWidth * 0.0825}
								labelRadius={this.state.screenWidth * 0.20}
								width={this.state.screenWidth * 0.45}
								height={this.state.screenWidth * 0.45}
                              />
                            </Col>
                          : 	
                            <Col size={50}><Text note>No Assets</Text></Col>
                        }
                        {this.state.screenWidth < this.state.screenHeight ?
                          	<Row size={50}>
								<View style={{ alignItems: 'center' }}>
									<Legend handleLegendClick={this.handleLegendClick}
										goodAssetCount={this.props.assetPrognosisCount.healthyAssetCount}
										checkupAssetCount={this.props.assetPrognosisCount.checkupAssetCount}
										urgentAssetCount={this.props.assetPrognosisCount.urgentAssetCount}
										unknownAssetCount = {this.props.assetPrognosisCount.unknownAssetCount}
										totalAssets = { totalAssets }
										assets={this.props.assets}
									/>
								</View>
                          	</Row>
                        :
                          <Col style={{alignItems:'center', width:this.state.screenWidth * 0.5}} >
                            <Legend handleLegendClick={this.handleLegendClick}
                              goodAssetCount={this.props.assetPrognosisCount.healthyAssetCount}
                              checkupAssetCount={this.props.assetPrognosisCount.checkupAssetCount}
                              urgentAssetCount={this.props.assetPrognosisCount.urgentAssetCount}
                              unknownAssetCount = {this.props.assetPrognosisCount.unknownAssetCount}
                              totalAssets = { totalAssets }
                              assets={this.props.assets}
                            />
                          </Col>
                        }					
                      </Grid>
                  :
                    <Text style={{ textAlign: "center", paddingTop: 10 }} note>{this.state.label}</Text>
                  }
                  </View>
							</View>
            </Content>
      			}
      		</Container>
    	);
  	}
}

function mapStateToProps(state, ownProps)
{
	return {
		assetPrognosisCount: state.assetPrognosisCount,
		isAssetsCountLoading: state.assetCountPending,
		assets: state.loadAllAssetsByCustomerId,
		userAuth: state.loginReducer,
		appUpgradationStatus: state.appUpgradationStatus
  	}
};

function mapDispatchToProps(dispatch)
{
  	return {
		assetActions: bindActionCreators(assetActions, dispatch),
		userActions: bindActionCreators(userActions, dispatch),
		loginActions: bindActionCreators(loginActions, dispatch),
	};
};

export default withNavigationFocus(connect(mapStateToProps, mapDispatchToProps)(Dashboard));