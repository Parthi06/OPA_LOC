import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Container, Header, Title, Button, Icon, Left, Right, Body, Subtitle  } from "native-base";
import { FlatList, Text, ActivityIndicator, Dimensions, View, AppState } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import * as assetActions from '../../Actions/AssetActions';
import * as userActions from '../../Actions/UserActions';
import * as loginActions from '../../Actions/LoginActions';
import AssetListItem from "./AssetListItem";
import * as constants from '../../Utils/Constants';
import { SearchBar } from 'react-native-elements';
import { applyAssetListFilter, applyAssetListFilterByparamPrognosis } from './Filters';
const dimensions = parseInt(Dimensions.get('window').height / 80);
import ForceUpgrade from '../GenericComponents/ForceUpgrade';

class Asset extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      isFabButtonActive: false,
      refreshing: false,
      limit: 15,
      page: 1,
      curScreen: (this.props.navigation.state.params == undefined) ? constants.ASSET_SCREEN : this.props.navigation.state.params.currentScreen,
      paramPrognosis: (this.props.navigation.state.params != undefined) ? (this.props.navigation.state.params.prognosis != undefined) ? this.props.navigation.state.params.prognosis : null : null,
      label: null,
      status: false,
      assetTag:"",
      assetForAssetList:[],
      showUpgradeWindow:true,
      appState: AppState.currentState
    }
    AppState.addEventListener('change', this._handleAppStateChange);
  }
  static navigationOptions = ({ navigation }) => {

    var heading = "";
    if (navigation.state.params == undefined)
      return { title: "" };
    else if (navigation.state.params.currentScreen == constants.DASHBOARD_SCREEN)
    {
      if(navigation.state.params.prognosis == constants.ALL)
      {
        heading = "Assets";
      } else
      {
        heading = "Asset " + ((navigation.state.params.prognosis == "Urgent_Attention") ? "Urgent" : navigation.state.params.prognosis) + " Condition";
      }
    }
    return {
      title: heading
    };
  };

  
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
      console.log('Disable later button     -        -            - ')
      this.setState( { showUpgradeWindow : false } )
      this.props.loginActions.checkForAppUpgradation();
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
    NetInfo.isConnected.fetch().done(
      (isConnected) => {
        this.setState({ status: isConnected });
        if (isConnected) {
          this.fetchRemoteData();
        } else if (!isConnected && this.props.assets.length == 0) {
          this.setState({ label: "Please Verify your Internet Connection!" });
        }
      }
    );
  }
  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
  }

  handleConnectionChange = (isConnected) => {
    this.setState({ status: isConnected });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.props.assets.assetId == nextProps.assets.assetId && this.props.assets.checkupTime != nextProps.assets.checkupTime) {
  //     console.log("True")
  //     return true;
  //   }
  //   console.log("False")
  //   return false;
  // }

  componentWillReceiveProps(nextProps) {
    this.setState({ state: this.state })
  }

  fetchRemoteData = () => {
    this.props.assetActions.loadAssetsFromApi(this.props.userAuth.customerId, this.state.page, this.state.limit);
  }

  handleListEmpty = () => {
    return (this.props.isAssetsLoading) ? <ActivityIndicator size="large" color="#3498DB" /> :
    (this.state.assetTag.length > 0)  ?  
    <Text style= {{padding:20}}> No results found for  - ' {this.state.assetTag} '</Text>
    : <Text style= {{padding:20}}> No Assets </Text>
  }

  handleLoadMore = () => {
    this.setState({
      page: this.state.page + 1
    }, () => {
      this.fetchRemoteData();
    });
  }


  renderItem = ({ item }) => {  
    return <AssetListItem asset={item} navigation={this.props.navigation} />
  }

  // Filter asset by asset tag 
  searchFilterFunction = filter => {
    let assetsFiltered = [];
    let data = this.props.assets;
    assetsFiltered = data.filter((item)=>{
        return item.assetTag.toUpperCase().includes(filter.toUpperCase())
    })
    this.setState({
        assetTag:filter,
        assetForAssetList:assetsFiltered
    })
  };

  //clear searchbar text
  clearFilterFunction = filter => {

    this.setState( {assetTag : filter} )
  };
  



  render() {

    const deviceWidth = Dimensions.get('window').width;
    return (
      this.props.appUpgradationStatus.forceUpgrade  
      ?  <ForceUpgrade forceUpgrade = { true } />
      :  this.props.appUpgradationStatus.laterUpgrade  && this.state.showUpgradeWindow
      ?  <ForceUpgrade forceUpgrade = { false } updateLaterHandler = { this.updateLaterHandler }/>
      :
      <Container style={{ backgroundColor: "#ffffff" }}>
        {(this.state.curScreen == constants.DASHBOARD_SCREEN) ? null :
          <Header style={{ backgroundColor: '#FBFAFA' }}>
            <Left style={{ flex: 1 }}><Icon active name="ios-menu" style={{ color: "black" }} onPress={() => this.props.navigation.toggleDrawer()} /></Left>
            <Body style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Title style={{ color: 'black' }}>ASSETS</Title></Body>
            <Right><Button transparent></Button></Right>
          </Header>
        }
        { (this.state.curScreen == constants.DASHBOARD_SCREEN) ? null :
        <View style   = {{flex: .1, flexDirection: 'row',height: 50,marginBottom:60 }}>
              <View style = {{width: deviceWidth-50, height: 50}} >
                 <SearchBar  
                     containerStyle = {  {
                                           width          :  deviceWidth -50, 
                                          padding         :  2,
                                          alignContent    : "space-between",
                                          backgroundColor : "#FFFFFF",
                                          borderBottomColor :'#FFFFFF'}}
                      inputStyle    = {{   backgroundColor   : "#FFFFFF",
                                        fontSize          :  15 }}
                      placeholder   = " Type asset tag here..."   
                      onChangeText  = {text => this.searchFilterFunction(text)}
                      autoCorrect   = {false}
                      value         = {this.state.assetTag}
                      clearIcon     = {false}
                      platform      = "android"
                      lightTheme
                      round />
              </View>
              <View style = {{width: 50, height: 50}} >     
                  <Icon  
                        onPress = { () => this.clearFilterFunction('') }
                          name  = 'close'   
                          type  = 'EvilIcons'
                          style = {{ 
                                    //fontSize: 25, 
                                    color: "grey" ,
                                   paddingTop:15, 
                                  height:35,width:35}}  />
              </View>
        </View>
      }
        {(this.state.label == null) ?
          <FlatList data={
            (this.state.curScreen == constants.DASHBOARD_SCREEN) ? 
                    applyAssetListFilterByparamPrognosis(this.props.customerAssets, this.state.paramPrognosis) :
                     (this.state.assetForAssetList.length == 0 && this.state.assetTag.length == 0) ? 
                      this.props.assets : 
                      (this.state.assetForAssetList.length == 0 && this.state.assetTag.length > 0) ?
                      this.state.assetForAssetList :
                      (this.state.assetForAssetList.length > 0 && this.state.assetTag.length > 0) ?
                      this.state.assetForAssetList:
                      this.props.assets
                    } 
            keyExtractor={(item, index) => index.toString()}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={50}
            removeClippedSubviews={true}
            renderItem={this.renderItem}
            extraData={this.state}
            scrollEnabled={true}
            initialNumToRender={dimensions}
            ListEmptyComponent={this.handleListEmpty}
            ListFooterComponent={this.renderFooter}
            windowSize={5} />
          : <Text note style={{ textAlign: "center" }}>{this.state.label}</Text>
        }
        {/* <Button small style={styles.fabButton} onPress={() => this.setState({ isFabButtonActive: !this.state.isFabButtonActive })}>
          <Icon name="md-add" />
        </Button>
        {(this.state.isFabButtonActive) ?
          <Button small rounded style={styles.fabChildButton}>
            <Text style={{ color: '#ffffff' }}>Add Asset</Text>
          </Button> : null
        } */}
      </Container>
    );
  }
}

function mapStateToProps(state, ownProps) { 
  return {
    assets: state.loadAssetListReducer,
    isAssetsLoading: state.assetPending,
    userAuth: state.loginReducer,
    customerAssets: state.loadAllAssetsByCustomerId,
    appUpgradationStatus: state.appUpgradationStatus
  }
};

function mapDispatchToProps(dispatch) {

  return {
    assetActions: bindActionCreators(assetActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch),
    loginActions: bindActionCreators(loginActions, dispatch)
  };
};

Asset = connect(mapStateToProps, mapDispatchToProps)(Asset);
export default Asset;
