import React, { Component } from "react";
import ReactNative, { View, Text, ActivityIndicator, TouchableWithoutFeedback, AppState, Alert } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import update from 'immutability-helper';
import { Container } from "native-base";
import * as eventActions from '../../Actions/EventActions';
import * as userActions from '../../Actions/UserActions';
import * as loginActions from '../../Actions/LoginActions';
import * as ticketActions from '../../Actions/TicketActions';
import * as faultEnumActions from '../../Actions/FaultEnumActions';
import * as assetActions from '../../Actions/AssetActions';
import { mergeEvents, applyAssetTicketFilter, applyUserTicketFilter, applyAssetSpecificFilter, applyLastUpdateFilter, applyAssetFeedSpecificFilterByAssetId } from './Filters';
import FeedList from "./FeedList";
import FeedView from "./FeedView";
import * as constants from '../../Utils/Constants';
import NetworkConnectivityHelper from '../../Components/Util/NetworkConnectivityHelper';
import Toast, { DURATION } from 'react-native-easy-toast';
import ForceUpgrade from '../GenericComponents/ForceUpgrade';
//import * as  testData from "../../mockApi/testData";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      page: 1,
      limit: 5,
      error: null,
      refreshing: false,
      isFilterOn: false,
      isNewEventsAvailable: false,
      isAssetNewEventsTagClicked: false,
      isTicketNewFeedBadgeClicked: false,
      isUserNewEventsTagClicked: false,
      countOfAE: 0,
      countOfUE: 0,
      countOfT: 0,
      feedCountOnScreen: 0,
      // navigationParams: this.props.navigation.state.params,
      curScreen: (this.props.navigation.state.params == undefined) ? constants.HOME_SCREEN : this.props.navigation.state.params.currentScreen,
      paramAsset: (this.props.navigation.state.params != undefined) ? (this.props.navigation.state.params.assetParam != undefined) ?
        this.props.navigation.state.params.assetParam : null : null,
      latestEventTimestamp: 0,
      lastestEventId: 0,
      eventDataFilteredCount: 0,
      feedContentHeight: 0.0,
      feedPageTitle: "Feed",
      filterBtnStatus: { ticket: false, asset: false, user: false, follow: false },
      filterBtnDisabledStatus: { ticket: false, asset: false, user: false, follow: false },
      filterBtnVisibleStatus: { ticket: false, asset: false, user: false, follow: false },
      filterDataEmptyStatus: { ticket: false, asset: false, user: false, follow: false },
      status: false,
      label: null,
      temp: 0,
      loadMoreBtnColor: "#6a97ba",
      loadMoreBtnStatus: false,
      loadMoreText: "Load More",
      spliceBit: true,
      apiTotalPageCount: 0,
      /**
      |--------------------------------------------------
      |state.page is resetting on tab switch, so inorder to avoid api calls with same page number stage.page is checking with apiTotalPageCount. 
      |APi call will initiate only if state.page is greate than apiTotalPageCount
      |--------------------------------------------------
      */
      orientation: "portrait",
      historyPageScrollCount:1,
      showUpgradeWindow:true,
      appState: AppState.currentState
    };
    this.onFilterButtonClick = this.onFilterButtonClick.bind(this);
    this.fetchRemoteData = this.fetchRemoteData.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.loadNewEvents = this.loadNewEvents.bind(this);
    this.feedTimer = this.feedTimer.bind(this);
    this.getRemoteDataByPage = this.getRemoteDataByPage.bind(this);
    //this.updateLatestEventTimestamp = this.updateLatestEventTimestamp.bind(this);
    this.saveCommentCallback = this.saveCommentCallback.bind(this);
    this.saveFollowCallback = this.saveFollowCallback.bind(this);
    this.saveTicketCallback = this.saveTicketCallback.bind(this);
    this.filterDataAccordingTocurScreen = this.filterDataAccordingTocurScreen.bind(this);
    this.getFilteredData = this.getFilteredData.bind(this);
    this.onContentSizeChange = this.onContentSizeChange.bind(this);
    this.handleReadMore = this.handleReadMore.bind(this);
    this.saveUserEventCallback = this.saveUserEventCallback.bind(this);
    // this.handleListEmptyBtn = this.handleListEmptyBtn.bind(this);
    this.handleLoadingComplete = this.handleLoadingComplete.bind(this);
    // this.props.onFilterButtonClick(passdata);
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  static navigationOptions = ({ navigation }) => {

    var heading = "";
    if (navigation.state.params == undefined)
      return { title: "" };
    if (navigation.state.params.currentScreen == constants.ASSET_HISTORY_SCREEN)
      heading = "Asset Feed - " + navigation.state.params.assetParam.assetTag;

    return {
      title: heading
    };
  };

  isPortrait = () => {
    var dim = ReactNative.Dimensions.get("screen");
    this.setState({ orientation: (dim.height >= dim.width) ? "portrait" : "landscape" });
  }

  componentDidMount() {
    ReactNative.Dimensions.addEventListener("change", this.isPortrait);
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
    NetInfo.isConnected.fetch().done(
      (isConnected) => {
        this.setState({ status: isConnected });
        if (isConnected) {
          //start timer only in the home screen.
          this.props.assetActions.fetchAssetTagsByCustomerId( this.props.userAuth.customerId );
          this.props.faultEnumActions.loadFaultEnumsFromApi();
          this.setState({ page: this.props.curPage });
          if (this.state.curScreen == constants.HOME_SCREEN) {
            
            this.fetchRemoteData(true, this.state.limit); //isNewEventsAvail
            this.props.userActions.loadUserDetailsAPI(this.props.userAuth.customerId);
          let timer = setInterval(this.feedTimer, constants.FEEDS_REFRESH_TIMER);
            this.setState({ timer });
          }
        } else if (!isConnected && this.props.events != null) {
          this.setState({ label: "Please Verify your Internet Connection!" });
          // this.props.eventActions.loadEventsFromDb(this.props.userAuth.customerId, this.props.userAuth.userId, this.state.limit, true);
        }
      }
    );
  }


  handleConnectionChange = (isConnected) => {
    this.setState({ status: isConnected });
  }

  componentWillReceiveProps(nextProps) {
  //  console.log(JSON.stringify(nextProps.assetHistoryDetails))
    this.setState({ countOfUE: nextProps.newEventInfo.countOfUE });
    this.setState({ countOfT: nextProps.newEventInfo.countOfT });
    this.setState({ countOfAE: nextProps.newEventInfo.countOfAE });
  }

  // shouldComponentUpdate(nextProps, nextState){
  //     if ((this.props.events !== nextProps.events)||(this.props.isEventLoadingComplete != nextProps.isEventLoadingComplete )){
  //       return true;
  //     }
  //     if ((this.state.count !== nextState.count)||(this.state.filterBtnStatus !== nextState.filterBtnStatus)
  //     ||(this.state.isNewEventsAvailable !== nextState.isNewEventsAvailable)) {
  //       return true;
  //     }
  //     if (this.state !== nextState) {
  //       return true;
  //     }
  //    return true;
  // }


  componentWillUnmount = () => {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
    ReactNative.Dimensions.removeEventListener("change", this.isPortrait);
    if (this.state.curScreen == constants.HOME_SCREEN) {
      clearInterval(this.state.timer);
    }
  }

  feedTimer = () => {
    if (this.state.latestEventTimestamp != null)
        this.props.eventActions.checkForNewFeeds(this.props.userAuth.customerId, this.state.latestEventTimestamp,
        this.state.countOfAE, this.state.countOfUE, this.state.countOfT, this.props.userAuth.userId,
        this.props.eventLastUpdated);
    //  this.props.eventActions.checkForNewFeeds(this.state.tenantId,this.state.latestEventTimestamp);
  }

  fetchRemoteData = (isNewEventsAvail, limit) => {
    
    if ( this.state.curScreen == constants.ASSET_HISTORY_SCREEN ){
      let fetchedDataLimit = this.state.paramAsset.fetchedDataLimit + this.state.historyPageScrollCount
      this.props.eventActions.loadFeedEventsByAssetId(this.state.paramAsset.assetId,  this.props.userAuth.userId, fetchedDataLimit, 15 )
      this.setState({
          historyPageScrollCount: fetchedDataLimit
      })
      console.log('------------History page scroling - api calling \n\n\n' + fetchedDataLimit)
    } 
      console.log('------------Home page scroling - api calling \n\n\n')
      this.props.eventActions.loadEventsFromApi(this.props.userAuth.customerId, this.props.userAuth.userId, this.state.page, limit, isNewEventsAvail);
    
    
  }

  onContentSizeChange = (contentWidth, contentHeight) => {

  }


  updateLatestEventTimestamp = (btnId) => {
    this.props.eventActions.updateEventsStateWithNewFeeds(btnId, this.props.newEventInfo);
  }

  saveCommentCallback = (commentDataToSave, type) => {  
    let newState = null;
    newState = update(commentDataToSave, {
      userId: { $set: this.props.userAuth.userId }
    });
    if (type == "AT") {
      this.props.eventActions.saveTicketComentUsingAPI(newState, type);
    } else {
      this.props.eventActions.saveEventComentUsingAPI(newState, type);
    }
  }

  saveFollowCallback = (followDataToSave) => {

    let newState = null;
    newState = update(followDataToSave, {
      eventFollowId: { userId: { $set: this.props.userAuth.userId } }
    });
    this.props.eventActions.updateFollowToDB(newState);
  }

  saveTicketCallback = (ticketDataToSave, assetId, customerId) => {
    let newState = null;
    newState = update(ticketDataToSave, {
      ticketAssignee: { $set: this.props.userAuth.userId }
    });

    this.props.ticketActions.saveTicketDataToDB(newState, assetId);
    setTimeout(() => {
      //Check this function
      //this.props.assetActions.loadAllAssetsFromApi(customerId);
      if (this.props.ticketCreatedSuccess) {
        this.refs.toastSuccess.show('Dispatched Successfully!!', DURATION.LENGTH_LONG);
      }
      else {
        this.refs.toastError.show('Could not be Dispatched!!', DURATION.LENGTH_LONG);
      }
    }, 4000);
  }

  saveUserEventCallback = (userEvent) => {
    let newState = null;
      newState = update(userEvent, {
        userId: { $set: parseInt(this.props.userAuth.userId) }
      });
      this.props.eventActions.saveUserEventUsingAPI(newState);
      setTimeout(() => {
        if (this.props.userPostSaveSuccess) {
          this.refs.toastSuccess.show('Posted Successfully!!', DURATION.LENGTH_LONG);
        }
        else {
          this.refs.toastError.show('Could not be Posted!!', DURATION.LENGTH_LONG);
        }
      }, 3000);
  }

  onFilterButtonClick = (btnId) => {
    var newBtnState = null;
    let newDisabledState = null;
    this.setState({ spliceBit: true, page: 1 });
    switch (btnId) {
      case 1:
        // ticket is clicked && asset and user is not clicked
        //Ticket - filterBtnStatus true ie prevfilterbtn status -false,asset& User -filterBtnDisabledStatus -true
        if ((!this.state.filterBtnStatus.asset) && (!this.state.filterBtnStatus.user)) {
          newDisabledState = update(this.state.filterBtnDisabledStatus, { asset: { $set: !this.state.filterBtnStatus.ticket }, user: { $set: !this.state.filterBtnStatus.ticket } });
          this.setState({ feedPageTitle: (this.state.filterBtnStatus.follow) ? "Feed - Tickets Following" : "Feed - Tickets" })
        }
        newBtnState = update(this.state.filterBtnStatus, { ticket: { $set: !this.state.filterBtnStatus.ticket } });
        break;
      case 2:
        //1.When following is on, and asset is clicked, Ticket and user will be disabled and vice versa
        //2.When asset is clicked, disable user and vice versa
        newDisabledState = (this.state.filterBtnStatus.follow) ? update(this.state.filterBtnDisabledStatus, { ticket: { $set: (!this.state.filterBtnStatus.asset) }, user: { $set: (!this.state.filterBtnStatus.asset) } }) :
          update(this.state.filterBtnDisabledStatus, { user: { $set: (!this.state.filterBtnStatus.asset) } });
        newBtnState = update(this.state.filterBtnStatus, { asset: { $set: !this.state.filterBtnStatus.asset } });
        this.setState({ feedPageTitle: (this.state.filterBtnStatus.follow) ? "Feed - Assets Following" : "Feed - Assets" })
        break;
      case 3:
        //When user is clicked disable asset and ticket
        newDisabledState = update(this.state.filterBtnDisabledStatus, {
          asset: { $set: (!this.state.filterBtnStatus.user) }
        });
        newBtnState = update(this.state.filterBtnStatus, { user: { $set: !this.state.filterBtnStatus.user } });

        this.setState({ feedPageTitle: (this.state.filterBtnStatus.follow) ? "Feed - Users Following" : "Feed - Users" })
        break;
      case 4:
        //When asset is already clicked while clicking follow, disable ticket
        if (this.state.filterBtnStatus.asset) {
          newDisabledState = update(this.state.filterBtnDisabledStatus, { ticket: { $set: (!this.state.filterBtnStatus.follow) } });
        }
        newBtnState = update(this.state.filterBtnStatus, { follow: { $set: !this.state.filterBtnStatus.follow } });
        break;
    }


    let filterFlg = false;
    if (newBtnState != null) {
      filterFlg = (newBtnState.ticket || newBtnState.asset || newBtnState.user || newBtnState.follow);
      this.setState({ filterBtnStatus: newBtnState, isFilterOn: filterFlg });
    }

    if (newDisabledState != null)
      this.setState({ filterBtnDisabledStatus: newDisabledState });

    if ((this.state.countOfAE > 0 || this.state.countOfUE > 0 || this.state.countOfT > 0)) {
      this.updateLatestEventTimestamp(btnId);
    }

  }

  handleReadMore = () => {

  }

  handleLoadingComplete = () => (this.props.events.length <= 0) ? <Text>There are no Feeds</Text> : null;

  renderItem = ({ item, index }) => {
    return (
      <FeedList navigation={this.props.navigation}
        item={item}
        isFilterOn={this.state.isFilterOn}
        users={this.props.users}
        filterBtnStatus={this.state.filterBtnStatus}
        latestEventTimestamp={this.state.latestEventTimestamp}
        saveCommentCallback={this.saveCommentCallback}
        saveFollowCallback={this.saveFollowCallback}
        saveTicketCallback={this.saveTicketCallback}
        handleReadMore={this.handleReadMore}
        isNewEventsAvailable={this.state.isNewEventsAvailable}
        countOfAE={this.state.countOfAE}
        countOfUE={this.state.countOfUE}
        countOfT={this.state.countOfT}
        //assets={this.props.assets}
        assetTags={this.props.assetTags}
        faultEnums={this.props.faultEnums}
        ticketCreatedSuccess={this.props.ticketCreatedSuccess}
        customerType={this.props.userAuth.customerType}
        key={item.eventId}
        curScreen={this.state.curScreen}
      />
    )
  }

  loadNewEvents = (filterTagId) => {
    this.onFilterButtonClick(filterTagId);
    // this.getRemoteDataByPage(1, true, this.state.limit);
    if (filterTagId == 1) {
      this.setState({ countOfT: 0, isTicketNewFeedBadgeClicked: true });
    }
    else if (filterTagId == 2) {
      this.setState({ countOfAE: 0, isAssetNewEventsTagClicked: true });
    }
    else if (filterTagId == 3) {
      this.setState({ countOfUE: 0, isUserNewEventsTagClicked: true });
    }
    //  this.refs.flatListRef.scrollToOffset({x: 0, y: 0, animated: true})
  }

  renderSeparator = () => {
    return (
      <View style={{
        height: 1,
        width: "86%",
        backgroundColor: "#CED0CE",
        marginLeft: "14%"
      }} />
    );
  }

  renderFooter = () => {
    return (
      <View
        style={{
          paddingVertical: 10,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  handleLoadMore = () => {
    this.setState({ page: this.state.page + 1 });
    if ((this.state.page > this.state.apiTotalPageCount) && this.state.page > 2) {
      this.setState({ apiTotalPageCount: this.state.apiTotalPageCount });
      this.getRemoteDataByPage(this.state.page, false, this.state.limit)
    }
  } //true need to check TODO

  getRemoteDataByPage = (pageNo, isNewEventsAvail, limit) => {
    if (this.state.status)
      this.fetchRemoteData(isNewEventsAvail, limit);
    this.props.eventActions.loadCurrentPageNo(this.state.page);
  }

  filterDataAccordingTocurScreen(eventsList) {
    var shouldBeDisplayedOnScreen = true;
    //Home Screen
    if ((this.state.curScreen == constants.HOME_SCREEN) && (!this.state.isFilterOn)) {
      if (this.state.page <= 3)
        return mergeEvents(eventsList).splice(0, 8);
      else
        return mergeEvents(eventsList);
    }
    else if ((this.state.curScreen == constants.HOME_SCREEN) && (this.state.isFilterOn))
      return this.getFilteredData(eventsList, shouldBeDisplayedOnScreen);
    else if (this.state.curScreen == constants.ASSET_HISTORY_SCREEN && (!this.state.isFilterOn)) {
      return applyAssetSpecificFilter(eventsList, this.state.paramAsset.assetId);
    }
    else if (this.state.curScreen == constants.ASSET_HISTORY_SCREEN && (this.state.isFilterOn)) {
      let data  = applyAssetFeedSpecificFilterByAssetId( eventsList, this.state.paramAsset.assetId,this.state.filterBtnStatus.asset, this.state.filterBtnStatus.ticket, this.state.filterBtnStatus.follow );
      const assetId = this.state.paramAsset.assetId ;
      let filtered=[];
      data.forEach( function( item ) { 
        if (item.assetId == assetId ){
          filtered.push(item); 
        }
      }); 
      return filtered;
    }
  }

  getFilteredData = ( eventsList, shouldBeDisplayedOnScreen) => {
    var finalList = [];
    if (!eventsList)
      return [];
    if (this.state.isFilterOn) {
      //following is on

      if ( (this.state.filterBtnStatus.follow) && (!this.state.filterBtnStatus.ticket) && (!this.state.filterBtnStatus.asset) && (!this.state.filterBtnStatus.user)) {
        finalList = mergeEvents(eventsList);
      }
      //Ticket button is onthis.state.filterBtnStatus

      else if (((this.state.filterBtnStatus.ticket) && (!this.state.filterBtnStatus.asset)) || (((this.state.filterBtnStatus.ticket) && (this.state.filterBtnStatus.user)))) {
        finalList = (this.state.filterBtnStatus.user) ? applyUserTicketFilter(eventsList.ticketFeed) : applyLastUpdateFilter(eventsList.ticketFeed);
      }
      //asset button is on
      else if (this.state.filterBtnStatus.asset) {
        finalList = (this.state.filterBtnStatus.ticket) ? applyAssetTicketFilter(eventsList.ticketFeed) : applyLastUpdateFilter(eventsList.assetFeed);
      }
      ////user button is on  
      else if (this.state.filterBtnStatus.user) {
        finalList = applyLastUpdateFilter(eventsList.userFeed);
      }
    }

    if (this.state.filterBtnStatus.follow && finalList) {
      return (shouldBeDisplayedOnScreen && finalList.filter(function (event) {
        return event.follow == 1;
      }));
    } else {
      if (this.state.page <= 3) {
        return (shouldBeDisplayedOnScreen && finalList.splice(0, 8));
      } else {
        return (shouldBeDisplayedOnScreen && finalList);
      }
    }
  }

    
  //App foreground-background change handler
  _handleAppStateChange = ( nextAppState ) => {
    console.log('App changed!' + this.state.appState);
    if ( this.state.appState.match(/inactive|background/) && nextAppState === 'active' ) {
      console.log('\nApp has come to the foreground!');
      this.setState( { showUpgradeWindow: true } )
      this.props.loginActions.checkForAppUpgradation();
    }
    this.setState( { appState : nextAppState } );
  };


  updateLaterHandler = () =>  {
      console.log('Disabling later button -             -                 -           - ')
      this.setState( { showUpgradeWindow: false } )
      this.props.loginActions.checkForAppUpgradation();
  }


  render() {
    console.log( this.props.appUpgradationStatus.laterUpgrade + ' so it will display later winod')
    return (
      <Container>
        {/* <NetworkConnectivityHelper navigation={this.props.navigation}></NetworkConnectivityHelper> */}
        <View>
          <Toast
            ref="toastSuccess"
            style={{ backgroundColor: 'white' }}
            position='bottom'
            positionValue={150}
            fadeInDuration={750}
            fadeOutDuration={1000}
            opacity={0.8}
            textStyle={{ color: 'black', fontSize: 18 }}
          /></View>
        <View>
          <Toast
            ref="toastError"
            style={{ backgroundColor: 'white' }}
            position='bottom'
            positionValue={150}
            fadeInDuration={750}
            fadeOutDuration={1000}
            opacity={0.8}
            textStyle={{ color: 'red', fontSize: 18 }}
          /></View>
          {
            this.props.appUpgradationStatus.forceUpgrade  
          ?  <ForceUpgrade forceUpgrade = { true } />
          :  this.props.appUpgradationStatus.laterUpgrade  && this.state.showUpgradeWindow
          ?  <ForceUpgrade forceUpgrade = { false } updateLaterHandler = { this.updateLaterHandler }/>
          :
        <FeedView navigation={this.props.navigation}
          onFilterButtonClick={this.onFilterButtonClick}
          filterBtnStatus={this.state.filterBtnStatus}
          filterBtnDisabledStatus={this.state.filterBtnDisabledStatus}
          loadNewEvents={this.loadNewEvents}
          isNewEventsAvail={this.state.isNewEventsAvailable}
          feedPageTitle={this.state.feedPageTitle}
          countOfAE={this.state.countOfAE}
          countOfUE={this.state.countOfUE}
          countOfT={this.state.countOfT}
          onContentChange={this.onContentChange}
          handleLoadMore={this.handleLoadMore}
          renderItem={this.renderItem}
          isEventLoadingComplete={this.props.isEventLoadingComplete}
          handleListEmpty={this.handleListEmpty}
          renderFooter={this.renderFooter}
          events={this.props.events[0]}
          filterDataAccordingTocurScreen={this.filterDataAccordingTocurScreen}
          curScreen={this.state.curScreen}
          onContentSizeChange={this.onContentSizeChange}
          saveUserEventCallback={this.saveUserEventCallback}
          userId={this.props.userAuth.userId}
          label={this.state.label}
          feedContentHeight={this.state.feedContentHeight}
          page={this.state.page}
          temp={this.state.temp}
          handleLoadingComplete={this.handleLoadingComplete}
        />}
      </Container>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    events: state.eventReducer,
    isEventsLoading: state.eventPending,
    isEventLoadingComplete: state.eventLoadingComplete,
    newEventInfo: state.newEventInfoReducer,
    isNewEventsLoading: state.newEventPending,
    userAuth: state.loginReducer,
    users: state.userReducer,
    curPage: state.curEventPage,
    assets: state.assetReducer,
    faultEnums: state.faultEnumReducer,
    userPostSaveSuccess: state.userPostSaveSuccess,
    ticketCreatedSuccess: state.ticketCreatedSuccess,
    eventLastUpdated: state.eventLastUpdated,
    assetHistoryDetails:state.assetHistoryDetailsReducer,
    appUpgradationStatus: state.appUpgradationStatus,
    assetTags:state.loadAllAssetTags
  }
};

function mapDispatchToProps(dispatch) {
  return {
    eventActions: bindActionCreators(eventActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch),
    loginActions: bindActionCreators(loginActions, dispatch),
    ticketActions: bindActionCreators(ticketActions, dispatch),
    assetActions: bindActionCreators(assetActions, dispatch),
    faultEnumActions: bindActionCreators(faultEnumActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
