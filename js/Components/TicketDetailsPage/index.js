import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Container, Thumbnail, Content, Text, Icon } from "native-base";
import { View, TouchableOpacity, AppState } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import update from 'immutability-helper';
import * as userActions from '../../Actions/UserActions';
import * as eventActions from '../../Actions/EventActions';
import * as loginActions from '../../Actions/LoginActions';
import * as ticketActions from '../../Actions/TicketActions';
import * as feedbackActions from '../../Actions/FeedbackActions';
import * as faultEnumActions from '../../Actions/FaultEnumActions';
import TechnicianActions from "./TechnicianActions";
import TicketDetails from "./TicketDetails";
import AssetDetails from "./AssetDetails";
import TicketComments from "./TicketComments";
import TicketDetailsFooter from "./TicketDetailsFooter";
import TicketActionPopUp from "./TicketActionPopUp";
import Toast, { DURATION } from 'react-native-easy-toast';
import FeedbackHistory from "./FeedbackHistory";
import * as assetActions from '../../Actions/AssetActions';
import { sortFeedBackHstory } from './filter';
import ForceUpgrade from '../GenericComponents/ForceUpgrade';


class TicketDetailsPage extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      isAssetDetailsArrow: true,
      hasFeedback: this.props.navigation.state.params.ticketParam.hasFeedback,
      isTicketActionPopUpModalVisible: false,
      ticketReopenedDate: this.props.navigation.state.params.ticketParam.ticketReopenedDate,
      saveFeedback: false,
      feedbackPostData: null,
      ticketAssignedTo: null,
      ticketState: (this.props.navigation.state.params.ticketParam.ticketState == "CLOSED_WITHOUT_FEEDBACK") ? "CLOSED" : this.props.navigation.state.params.ticketParam.ticketState,
      ticketAssignedToName: null,
      isFeedbackHistoryArrow: false,
      isTicketHistoryArrow: false,
      isFeedbackEntered: false,
      isFeedbackCleared: false,
      showUpgradeWindow:true,
      appState: AppState.currentState
    }
    this.ticketActionCallback = this.ticketActionCallback.bind(this);
    this.feedbackSaveCallback = this.feedbackSaveCallback.bind(this);
    this.clearFeedback = this.clearFeedback.bind(this);
    this.closeTicketActionPopUpModal = this.closeTicketActionPopUpModal.bind(this);
    this.showTicketActionPopUpModal = this.showTicketActionPopUpModal.bind(this);
    this.changeTicketStateOnTicketAction = this.changeTicketStateOnTicketAction.bind(this);
    this.ticketStateCallback = this.ticketStateCallback.bind(this);
    this.ticketAssignedToSaveCallback = this.ticketAssignedToSaveCallback.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.saveCommentCallback = this.saveCommentCallback.bind(this);
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  ticketStateCallback = (ticketStateParam) => {
    this.setState({ ticketState: ticketStateParam });
  }

  changeTicketStateOnTicketAction = (ticketStateParam, feedbackParam, ticketReopenedDate) => {
    this.setState({ ticketState: ticketStateParam, hasFeedback: feedbackParam, ticketReopenedDate: ticketReopenedDate });
    this.ticketStateCallback(ticketStateParam);
  }

  componentWillMount() {
    this.setState({
      ticketDetails: this.props.navigation.state.params.ticketParam,
    });
  }


  componentDidMount() {
    this.props.userActions.loadUserDetailsAPI( this.props.userAuth.customerId );
    this.props.ticketActions.fetchOpenTicketsIdsWithAssetDetails( this.state.ticketDetails.assetId )
    this.props.feedbackActions.getFeedbackHistoryByTicketId( this.state.ticketDetails.ticketId );
    this.props.faultEnumActions.loadFaultEnumsFromApi();
    this.props.ticketActions.getTicketHistoryByTicketId( this.state.ticketDetails.ticketId );
    this.showAssetDetails();
  }

  closeTicketActionPopUpModal = () => {
    this.setState({ isTicketActionPopUpModalVisible: false });
  }

  showTicketActionPopUpModal = () => {
    this.setState({ isTicketActionPopUpModalVisible: true });
  }

  ticketActionCallback = (ticketActionData) => {
    let newTicketState = null;
    newTicketState = update(ticketActionData, {
      ticketClosedBy: { $set: this.props.userAuth.userId }
    });
    this.props.ticketActions.closeTicketUsingAPI(newTicketState, this.props.userAuth.userId);
    this.getTicketHistoryByTicketId();
  }

  clearFeedback = (isFeedbackRemoved) =>{
    this.setState({isFeedbackCleared:isFeedbackRemoved});
  }

  feedbackSaveCallback = (feedbackPostData/*, isFeedbackEntered*/) => {
    if (feedbackPostData === null) {
      this.setState({ saveFeedback: false/*, isFeedbackEntered : false*/ });
    } else {
      this.setState({ feedbackPostData: feedbackPostData, saveFeedback: true /*,isFeedbackEntered:isFeedbackEntered*/});
    }
  }


  ticketAssignedToSaveCallback = (ticketId, ticketAssignedTo, ticketAssignedToName) => {
    this.setState({ ticketAssignedTo: ticketAssignedTo, ticketAssignedToName: ticketAssignedToName, saveFeedback: true });
  }

  onSaveClick = () => {
    if (!this.state.saveFeedback) {
      return false;
    }
    this.setState({ saveFeedback: false });
    if (this.state.ticketAssignedTo !== null) {
      this.props.ticketActions.updateTicketAssignedToDB(this.state.ticketDetails.ticketId, this.state.ticketAssignedToName, this.state.ticketDetails.eventId, this.state.ticketAssignedTo, this.props.userAuth.userId);
      this.setState({ ticketAssignedTo: null });
    }
    if (this.state.feedbackPostData !== null) {
      this.props.feedbackActions.saveFeedbackToDB(this.state.feedbackPostData);
      this.setState({ feedbackPostData: null, hasFeedback: "Y" });
    }
    setTimeout(() => {//|| this.props.ticketAssignedSaveSuccess
      if (this.props.feedbackSaveSuccess ) {
        this.refs.toastSuccess.show('Saved Successfully!!', DURATION.LENGTH_LONG);
        this.clearFeedback(true);
      }
    }, 2000);
    this.getTicketHistoryByTicketId();
    this.getFeedbackHistoryByTicketId();
  }

  showFeedbackHistory = () => {
    this.props.feedbackActions.getFeedbackHistoryByTicketId(this.state.ticketDetails.ticketId);
    this.setState({ isFeedbackHistoryArrow: !this.state.isFeedbackHistoryArrow });
  }

  showTicketHistory = () => {
    // this.props.feedbackActions.getFeedbackHistoryByTicketId(this.state.ticketDetails.ticketId);
    this.props.ticketActions.getTicketHistoryByTicketId(this.state.ticketDetails.ticketId);
    this.setState({ isTicketHistoryArrow: !this.state.isTicketHistoryArrow });
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.loadTicketHistory) {
      this.forceUpdate();
    }
   
    if(this.props.loadFeedbackHistory.length != null)
    {
      let hasFeedback = false;
      if ( nextProps.loadFeedbackHistory != null) {
         if( this.state.ticketReopenedDate != null ){
           for(index = 0 ;index < nextProps.loadFeedbackHistory.length;index++)
           {
               if (nextProps.loadFeedbackHistory[index].checkupTime > this.state.ticketReopenedDate)
               {
                hasFeedback = true;
                break;
               }
           }
          }
            this.setState({isFeedbackEntered:(this.state.ticketReopenedDate != null)? hasFeedback:(nextProps.loadFeedbackHistory.length > 0)?true:false}); 
        }
      
      }
  }


  showAssetDetails = () => {
    this.setState({ isAssetDetailsArrow: !this.state.isAssetDetailsArrow })
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
    this.getTicketHistoryByTicketId();
  }

  getTicketHistoryByTicketId() {
    setTimeout(() => {
      this.props.ticketActions.getTicketHistoryByTicketId(this.state.ticketDetails.ticketId);
    }, 2000);
  }

  getFeedbackHistoryByTicketId() {
    setTimeout(() => {
      this.props.feedbackActions.getFeedbackHistoryByTicketId(this.state.ticketDetails.ticketId);
    }, 2000);
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
      console.log('Later button clicked')
      this.setState( { showUpgradeWindow: false } )
      this.props.loginActions.checkForAppUpgradation();
  }

  render() {
    // let ticketComments = (this.state.ticketDetails.ticketComments != null) ? this.state.ticketDetails.ticketComments.length : 0;
    // let historyData = (this.state.ticketDetails.historyData != null) ? this.state.ticketDetails.historyData.length : 0;
    let feedbackCount = ( this.props.loadFeedbackHistory != null )  ?   this.props.loadFeedbackHistory.length   :   0; 
    let commentCount = (this.props.loadTicketHistory.length != null) ? this.props.loadTicketHistory.length : 0;
    commentCount += (this.state.ticketDetails.eventComments != null) ? this.state.ticketDetails.eventComments.length : 0;
    return (
      <Container style={{ backgroundColor: '#ffffff' }} >
      {
        this.props.appUpgradationStatus.forceUpgrade  
        ?  <ForceUpgrade forceUpgrade = { true } />
        :  this.props.appUpgradationStatus.laterUpgrade  && this.state.showUpgradeWindow
        ?  <ForceUpgrade forceUpgrade = { false } updateLaterHandler = { this.updateLaterHandler }/>
        :
        <Content padder>
          <View>
            <View>
              <Toast
                ref="toastSuccess"
                style={{ backgroundColor: 'white' }}
                position='bottom'
                positionValue={150}
                fadeInDuration={750}
                fadeOutDuration={2000}
                opacity={0.8}
                textStyle={{ color: 'green', fontSize: 18 }}
              /></View>
            <View>
              <Toast
                ref="toastError"
                style={{ backgroundColor: 'white' }}
                position='bottom'
                positionValue={150}
                fadeInDuration={750}
                fadeOutDuration={2000}
                opacity={0.8}
                textStyle={{ color: 'red', fontSize: 18 }}
              /></View>
            <Grid size={200}>
              <Row size={20}>
                <Col style={{ flex: 2 }}>
                  <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                    <Icon style={{ fontSize: 30 }} name="close" />
                  </TouchableOpacity>
                </Col>
                <Col style={{ flex: 3 }}><Text style={{ fontWeight: "bold" }}>Ticket Details</Text></Col>
                <Col style={{ flex: 1 }}>
                  <Thumbnail style={{ height: 30, width: 30 }} square
                    source={(this.state.ticketState == "OPEN" || this.state.ticketState == "REOPENED")
                      ? require('../Home/Images/open.png')
                      : require('../Home/Images/closed.png')} />
                </Col>
                {/* <Col size={5}>
                  {(this.state.saveFeedback) ?
                    <TouchableOpacity onPress={() => this.onSaveClick()}>
                      <Icon style={{ fontSize: 30, color: "green" }} name="md-checkmark" />
                    </TouchableOpacity>
                    :
                    <Icon style={{ fontSize: 30 }} name="md-checkmark" />
                  }
                </Col> */}
              </Row>
              <View style={{ paddingTop: 10, paddingBottom: 10 }}>
                <TicketDetails ticketDetails={this.state.ticketDetails}
                  users={this.props.users}
                  navigation={this.props.navigation}
                  ticketReopenedDate={this.state.ticketReopenedDate}
                  ticketAssignedToSaveCallback={this.ticketAssignedToSaveCallback}
                  ticketState={this.state.ticketState} />
                <Row>
                  <Row style={{ borderBottomColor: 'black', paddingTop: 10 }} size={10}>
                    <Col size={5} style={{ borderTopColor: 'black', borderTopWidth: 2, marginTop: 10 }} />
                    <Col size={5}><Text style={{ fontSize: 15, fontWeight: "bold" }}>TECHNICIAN ACTIONS</Text></Col>
                  </Row>
                </Row>
                <Col><TechnicianActions ticketDetails={this.state.ticketDetails}
                  feedbackSaveCallback={this.feedbackSaveCallback}
                  isFeedbackCleared = {this.state.isFeedbackCleared}
                  clearFeedback = {this.clearFeedback}
                  faultEnums={this.props.faultEnums}
                  ticketState={this.state.ticketState}
                  userAuth={this.props.userAuth.userId} /></Col>
                <Row>
                  <Row style={{ borderBottomColor: 'black', paddingTop: 10 }} size={10}>
                    <Col size={5} style={{ borderTopColor: 'black', borderTopWidth: 2, marginTop: 11 }} />
                    <Col size={5}>
                      <Row>
                        {(this.state.isAssetDetailsArrow) ?
                          <Icon style={{ fontSize: 25, paddingRight: 5, paddingLeft: 5 }} name="md-arrow-dropdown" onPress={() => this.setState({ isAssetDetailsArrow: false })} />
                          : <Icon style={{ fontSize: 25, paddingRight: 5, paddingLeft: 5 }} name="md-arrow-dropright" onPress={() => this.setState({ isAssetDetailsArrow: true })} />
                        }
                        <TouchableOpacity onPress={() => this.showAssetDetails()}>
                          <Text style={{ fontSize: 15, fontWeight: "bold" }}>ASSET DETAILS</Text>
                        </TouchableOpacity>
                      </Row>
                    </Col>
                  </Row>
                </Row>
                {
                  ( this.state.isAssetDetailsArrow ) ? <AssetDetails assetDetails={this.props.openTicketsIdWithAssetDetails} /> : null}
                <Row>
                  <Row style={{ borderBottomColor: 'black', paddingTop: 10 }} size={10}>
                    <Col size={5} style={{ borderTopColor: 'black', borderTopWidth: 2, marginTop: 11 }} />
                    <Col size={5}>
                      <Row>
                        {(this.state.isFeedbackHistoryArrow) ?
                          <Icon style={{ fontSize: 25, paddingRight: 5, paddingLeft: 5 }} name="md-arrow-dropdown" onPress={() => this.setState({ isFeedbackHistoryArrow: false })} />
                          : <Icon style={{ fontSize: 25, paddingRight: 5, paddingLeft: 5 }} name="md-arrow-dropright" onPress={() => this.showFeedbackHistory()} />
                        }
                        <TouchableOpacity onPress={() => this.showFeedbackHistory()}>
                          <Text style={{ fontSize: 15, fontWeight: "bold" }}>FEEDBACK HISTORY ({feedbackCount})</Text>
                        </TouchableOpacity>
                      </Row>
                    </Col>
                  </Row>
                </Row>
                {(this.state.isFeedbackHistoryArrow) ?
                  <FeedbackHistory loadFeedbackHistory={sortFeedBackHstory(this.props.loadFeedbackHistory)} faultEnums={this.props.faultEnums} />
                  : null}
                <Row> 
                  <Row style={{ borderBottomColor: 'black', paddingTop: 10 }} size={10}>
                    <Col size={5} style={{ borderTopColor: 'black', borderTopWidth: 2, marginTop: 11 }} />
                    <Col size={5}>
                      <Row>
                        {(this.state.isTicketHistoryArrow) ?
                          <Icon style={{ fontSize: 25, paddingRight: 5, paddingLeft: 5 }} name="md-arrow-dropdown" onPress={() => this.setState({ isTicketHistoryArrow: false })} />
                          : <Icon style={{ fontSize: 25, paddingRight: 5, paddingLeft: 5 }} name="md-arrow-dropright" onPress={() => this.showTicketHistory()} />
                        }
                        <TouchableOpacity onPress={() => this.showTicketHistory()}>
                          <Text style={{ fontSize: 15, fontWeight: "bold" }}>{"EVENTS(" + commentCount + ")"}</Text>
                        </TouchableOpacity>
                      </Row>
                    </Col>
                  </Row>
                </Row>
                {(this.state.isTicketHistoryArrow) ?
                  <TicketComments ticketDetails={this.state.ticketDetails} users={this.props.users} events={this.props.events} saveCommentCallback={this.saveCommentCallback} loadTicketHistory={this.props.loadTicketHistory} ticketState={this.state.ticketState} />
                  : null}
              </View>
              <View>
              </View>
              <View>
                <TicketActionPopUp
                  modalVisible={this.state.isTicketActionPopUpModalVisible}
                  closeTicketActionPopUpModal={this.closeTicketActionPopUpModal}
                  ticketDetails={this.state.ticketDetails}
                  ticketActionCallback={this.ticketActionCallback}
                  changeTicketStateOnTicketAction={this.changeTicketStateOnTicketAction}
                  clearFeedback ={this.clearFeedback}
                  ticketState={this.state.ticketState}
                  hasFeedback={this.state.hasFeedback} />
              </View>
            </Grid>
          </View>
        </Content>
        }

        {
       ( this.props.appUpgradationStatus.forceUpgrade  || (   this.props.appUpgradationStatus.laterUpgrade  && this.state.showUpgradeWindow ))
        ? null
        :
        <TicketDetailsFooter saveFeedback={this.state.saveFeedback}
          ticketState={this.state.ticketState}
          showTicketActionPopUpModal={this.showTicketActionPopUpModal}
          ticketDetails={this.state.ticketDetails}
          isFeedbackPresent ={this.state.isFeedbackEntered}
          onSaveClick={this.onSaveClick}
        />
      }
      </Container>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    users: state.userReducer,
    events: state.eventReducer,
    userAuth: state.loginReducer,
    faultEnums: state.faultEnumReducer,
    feedbackSaveError: state.feedbackSaveError,
    feedbackSaveSuccess: state.feedbackSaveSuccess,
    ticketAssignedSaveSuccess: state.ticketAssignedSaveSuccess,
    loadFeedbackHistory: state.loadFeedbackHistory,
    assets: state.assetReducer,
    loadTicketHistory: state.loadTicketHistory,
    appUpgradationStatus: state.appUpgradationStatus,
    openTicketsIdWithAssetDetails : state.openTicketsIdWithAssetDetails

  }
};

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(userActions, dispatch),
    eventActions: bindActionCreators(eventActions, dispatch),
    loginActions: bindActionCreators(loginActions, dispatch),
    ticketActions: bindActionCreators(ticketActions, dispatch),
    feedbackActions: bindActionCreators(feedbackActions, dispatch),
    faultEnumActions: bindActionCreators(faultEnumActions, dispatch),
    assetActions: bindActionCreators(assetActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TicketDetailsPage);
