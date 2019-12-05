import React, { Component } from 'react';
import { Modal, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Thumbnail, Textarea } from 'native-base';
import * as constants from '../../Utils/Constants';
import * as appConstants from '../../Utils/AppConstants';

import styles from "./styles";

class NewEventFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userText: null
    };
    this.prepareNewUserEventData = this.prepareNewUserEventData.bind(this);
  }

  prepareNewUserEventData = () => {
    let newUserEventData = {
      "eventCreatedDate": new Date().getTime(),
      "assetId": 1,
      "userId": 0,
      "userText": this.state.userText
    }
    console.log('-------------------user entered----------------------' +typeof this.state.userText)
    if( this.state.userText === "" || !this.state.userText ) {
      Alert.alert(appConstants.FEED_EMPTY_WARNING);
    } else {
        this.props.saveUserEventCallback(newUserEventData);
        //this.props.closeModal();
        this._closeModal();
        this.setState({userText:""});
    }
  }

  _closeModal = () => {
    this.setState({userText:""});
    this.props.closeModal();
  }

  render() {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.props.modalVisible}
          onRequestClose={() => this.props.closeModal}
        >
          <View style={styles.assignModalView}>
            <View style={styles.assignModalInnerView}>
              <View style={styles.assignedModalVisibleView}>
                <View>
                  <View style={{ flexDirection: 'row' }}>
                    <Thumbnail style={{ width: 30, height: 30 }} source={{ uri: constants.SERVER_URL + "/profilepic/" + this.props.userId + ".jpg" }} />
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                      <Text style={{ color: '#000000', textAlign: "center", fontWeight: "bold", fontSize: 16 }}>Add Feed</Text></View>
                  </View>
                  <Textarea rowSpan={5} value={this.state.userText} bordered placeholder="Add feed..." style={{ width: 280, paddingTop: 20 }} onChangeText={(text) => this.setState({ userText: text })} />
                  <View style={styles.assignModalButtonsView}>
                    <TouchableOpacity onPress={this._closeModal}>
                      <Text style={styles.assignModalCancelButton}>CANCEL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.prepareNewUserEventData}>
                      <Text style={styles.assignModalDispatchButton}>POST</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default NewEventFeed;
