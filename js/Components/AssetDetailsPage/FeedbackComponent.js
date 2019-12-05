import React, { Component } from 'react';
import { View, Text } from 'react-native';
import * as assetActions from '../../Actions/AssetActions';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import FeedBack from './FeedBack';
import Toast, { DURATION } from 'react-native-easy-toast';
import *  as appConstants from '../../Utils/AppConstants'


class FeedbackComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  clearFeedback = (isFeedbackRemoved) => {
    this.setState({ isFeedbackCleared: isFeedbackRemoved });
  }

  feedbackSaveCallback = (feedbackPostData) => {
    if (feedbackPostData === null) {
      this.setState({ saveFeedback: false });
    } else {
      this.setState({ feedbackPostData: feedbackPostData, saveFeedback: true });
    }
  }

  componentWillReceiveProps(nextProps) {
     if (nextProps.oneStepFeedbackInitiatedReducer == true && nextProps.oneStepFeedbackResponseReducer == false) {  
      this.refs.toastSuccess.show(appConstants.CREATING_TICKET, DURATION.LENGTH_LONG);
    }
  }

  componentWillMount() {
    this.setState({
      assetDetails: this.props.navigation.state.params.assetDetails,
      faultEnums: this.props.navigation.state.params.faultEnums,
      userAuth: this.props.navigation.state.params.userAuth,
    });
  }

  saveFeedBack = () => {
    if (this.state.saveFeedback) {
      this.props.assetActions.saveFeedBack(this.state.feedbackPostData);
    } else {
      this.refs.toastSuccess.show(appConstants.IN_COMPLETE_FEEDBACK, DURATION.LENGTH_LONG);
    }
  }

  render() {
    return (
      <View>
        <View>
               <Toast
                ref="toastSuccess"
                style={{ backgroundColor: 'rgb(233,233,239)' }}
                position='center'
                positionValue={150}
                fadeInDuration={750}
                fadeOutDuration={2000}
                opacity={0.8}
                textStyle={{ color: appConstants.COLORS.royalBlue, fontSize: 18 }}
              /> 
        </View>
        <FeedBack
          assetDetails={this.state.assetDetails}
          faultEnums={this.state.faultEnums}
          userAuth={this.state.userAuth}
          clearFeedback={this.clearFeedback}
          feedbackSaveCallback={this.feedbackSaveCallback}
          saveFeedBack={this.saveFeedBack}
          oneStepFeedbackInitiatedReducer={this.props.oneStepFeedbackInitiatedReducer}
        />
      </View>

    );
  }
}


function mapStateToProps(state, ownProps) {
  return {
    oneStepFeedbackResponseReducer: state.oneStepFeedbackResponseReducer,
    oneStepFeedbackInitiatedReducer: state.oneStepFeedbackInitiatedReducer
  }
};

function mapDispatchToProps(dispatch) {

  return {
    assetActions: bindActionCreators(assetActions, dispatch),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(FeedbackComponent);
