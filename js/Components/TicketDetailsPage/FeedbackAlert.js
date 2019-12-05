import React, { Component } from "react";
import { Text, TouchableOpacity, View, Image} from "react-native";
import Modal from "react-native-modal";
import styles from "./styles";
export default class FeedbackAlert extends Component {
  render() {
    return (
      <View style={{flex:1}}>
        <Modal isVisible={this.props.isFeedbackModalVisible}
               onBackdropPress={() => this.props.hideFeedbackAlertModal()}
               onBackButtonPress={() => this.props.hideFeedbackAlertModal()}
               transparent={true}>
               <View style={styles.TicketPopUpModalView}>
                <View style={styles.TicketPopUpModalInnerView}>
                 <View style={styles.TicketPopUpModalVisibleView}>
                 <View style={{flex: 1,justifyContent: 'center',alignItems: 'center',paddingTop:20}}>
                 <Image small style={{height:40,width:40}} source={require("./Images/warning.png")}/>
                 </View>
            <Text style={{paddingTop:20,paddingBottom:20}}>"Feedback" and "Diagnosis Result" should be selected to close the ticket</Text>
          </View>
          </View>
          </View>
        </Modal>
      </View>
    );
  }
}
