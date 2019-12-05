import React, { Component } from 'react';
import { Modal, Text, View, TouchableOpacity, Dimensions} from 'react-native';
import styles from "./styles";
import FeedbackAlert from "./FeedbackAlert";

class TicketActionPopUp extends Component {
  constructor(props,context)
  {
    super(props,context);
    this.state={
      isFeedbackModalVisible:false
    }
    this.prepareDataForTicketReopenOrClose = this.prepareDataForTicketReopenOrClose.bind(this);
    this.hideFeedbackAlertModal = this.hideFeedbackAlertModal.bind(this);
  }

  hideFeedbackAlertModal = () =>{
    this.setState({isFeedbackModalVisible:false});
  }
  prepareDataForTicketReopenOrClose = () =>{
    let ticketStateChanged = (this.props.ticketState == "OPEN" || this.props.ticketState == "REOPENED")?(this.props.ticketDetails.hasFeedback=="N")?"CLOSED_WITHOUT_FEEDBACK":"CLOSED":"REOPENED";
    let ticketActionData ={
         "ticketId":this.props.ticketDetails.ticketId,
         "ticketState":ticketStateChanged,
         "ticketClosedDate": (this.props.ticketState !== "CLOSED")? new Date().getTime():this.props.ticketDetails.ticketClosedDate,
         "ticketLastUpdated": new Date().getTime(),
         "ticketReopenedDate": (this.props.ticketState == "CLOSED")? new Date().getTime():this.props.ticketDetails.ticketReopenedDate,
         "ticketClosedBy": 0,
         "hasFeedback": (ticketStateChanged == "REOPENED")?"N":this.props.hasFeedback,
         "eventId":this.props.ticketDetails.eventId
    }
    if(this.props.hasFeedback == "N" && (ticketStateChanged == "CLOSED" || ticketStateChanged == "CLOSED_WITHOUT_FEEDBACK"))
      {
        //alert("Please save feedback and then close the ticket!");
        //this.toggleFeedbackModal();
        this.setState({isFeedbackModalVisible:true});
        this.props.closeTicketActionPopUpModal();
      }
      else
      {
        this.props.ticketActionCallback(ticketActionData);
        this.props.changeTicketStateOnTicketAction((ticketActionData.ticketState == "CLOSED_WITHOUT_FEEDBACK")?"CLOSED":ticketActionData.ticketState,ticketActionData.hasFeedback,ticketActionData.ticketReopenedDate);
        this.props.closeTicketActionPopUpModal();
        this.props.clearFeedback(true);
      }
  }
   render() {
     const dimensions = Dimensions.get('window');
     return (
       <View>
         <Modal animationType="slide"
                transparent={true}
                visible = {this.props.modalVisible}
                onRequestClose={this.props.closeTicketActionPopUpModal}>
           <View style={styles.TicketPopUpModalView}>
            <View style={styles.TicketPopUpModalInnerView}>
             <View style={styles.TicketPopUpModalVisibleView}>
               <View>
                 <Text style={styles.TicketPopUpMainText}>{(this.props.ticketState == "OPEN" || this.props.ticketState == "REOPENED")?"Close the ticket?":"Reopen the ticket?"}</Text>

                <View style={styles.TicketPopUpModalButtonsView}>
                    <TouchableOpacity  onPress={this.props.closeTicketActionPopUpModal}>
                    <Text style={styles.TicketPopUpModalCancelButton}>CANCEL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.prepareDataForTicketReopenOrClose}>
                    <Text style={styles.TicketPopUpModalDispatchButton}>{(this.props.ticketState == "OPEN" || this.props.ticketState == "REOPENED")?"CLOSE":"REOPEN"}</Text>
                    </TouchableOpacity>
             </View>
            </View>
           </View>
          </View>
         </View>
        </Modal>
        <View><FeedbackAlert hideFeedbackAlertModal={this.hideFeedbackAlertModal} isFeedbackModalVisible={this.state.isFeedbackModalVisible}/></View>
       </View>
     );
   }
}

export default TicketActionPopUp;
