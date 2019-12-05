import React, { Component } from 'react';
import Autocomplete from "react-native-autocomplete-input";
import { Modal, Text, View, Picker, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Icon, Button } from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';
import styles from "./styles";

class FeedAssign extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      assignedTechnicianId: null,
      isDateTimePickerVisible: false,
      selectedDueDate: null,
      pickerDueDateText: "Select Due Date",
      filterAssetDataText: "",
      hideResults: false,
      filteredData: [],
      userListItemsForTechnicianPicker:[],
      assetListForAssetPicker:null
    }
    this.prepareAssignTicketJson = this.prepareAssignTicketJson.bind(this);
    this.showDateTimePicker = this.showDateTimePicker.bind(this);
    this.hideDateTimePicker = this.hideDateTimePicker.bind(this);
    this.handleDatePicked = this.handleDatePicked.bind(this);
    this.filterAssetData = this.filterAssetData.bind(this);
  }

  componentDidMount(){
    this.populateTechnicianPickerList();
    if(this.props.feed.feedType == "UE")
        this.propulateAssetPickerList();
  }


  propulateAssetPickerList = () => {
    console.log(JSON.stringify(this.props.assetTags))
    const assetList = this.props.assetTags.filter((item,index) =>{
      if ((this.props.feed.customerType == "S") && (item.customerId == this.props.feed.customerId))
         return item;
      else if (this.props.feed.customerType == "P")
         return item;
    });
    this.setState({ assetListForAssetPicker : assetList });
  }

  populateTechnicianPickerList = () =>{
      const userList = this.props.users.filter((item, index) =>{
      //If customerType is primary, the technician picker needs only to be filled with primary users.
       if((this.props.feed.customerType == "P") && (item.tenantId ===  this.props.feed.customerId)){
          return  item;
       }
       else  if ((this.props.feed.customerType == "S") && ((item.tenantId ===  this.props.feed.customerId)|| (item.customerType == "P")))
         return  item;

    });
    this.setState({userListItemsForTechnicianPicker : userList});
  } 

  filterAssetData = (fiterTerm) => {
    this.setState({ filterAssetDataText: fiterTerm });
    if (this.state.filterAssetDataText !== fiterTerm) {
      if (this.state.hideResults) {
        this.setState({ hideResults: false });
      }
    }
    if (fiterTerm != "") {
      let filteredArray = /*this.props.assets*/this.state.assetListForAssetPicker.filter(asset => asset.assetTag.toUpperCase().includes(fiterTerm.toUpperCase()));
      this.setState({ filteredData: filteredArray });
      console.log(JSON.stringify( ' -----------asset tag filtered--------------------'+ JSON.stringify(filteredArray)))
    }
  }

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  }

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  }

  handleDatePicked = (date) => {
    this.setState({ selectedDueDate: date.getTime(), pickerDueDateText: (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() });
    this.hideDateTimePicker();
  }

  prepareAssignTicketJson = () => {
    if (this.state.selectedDueDate != null && this.state.assignedTechnicianId != null) {
      let assignTicketJson = {
        "ticketState": "OPEN",
        "ticketCreatedDate": new Date().getTime(),
        "ticketClosedDate": null,
        "ticketDueDate": this.state.selectedDueDate,
        "ticketLastUpdated": new Date().getTime(),
        "ticketAssignedTo": this.state.assignedTechnicianId,
        "ticketClosedBy": 0,
        "ticketAssignee": null,
        "eventId": this.props.feed.eventId,
        "opaMoteId": null,
        "hasFeedback": "N",
        "feedType": this.props.feed.feedType
      }
      if (this.props.feed.feedType == "UE") {
        let neededAsset =  this.state.assetListForAssetPicker.find(asset => asset.assetTag == this.state.filterAssetDataText);
        if (neededAsset == undefined) {
          Alert.alert('Error','Asset Not Found!!',[ {text: 'OK'} ]);
          //alert("Asset Not Found!!");
        } else {
          this.props.saveTicketCallback(assignTicketJson,neededAsset.assetId, this.props.feed.customerId);
          this.props.changeAssignIconTextOnDispatch();
        }
      } else {
        this.props.saveTicketCallback(assignTicketJson, 0, this.props.feed.customerId);
        this.props.changeAssignIconTextOnDispatch();
      }
      this.props.closeAssignModal();
    } else {
      Alert.alert('Error','Both Assign To and Due date are mandatory!',[ {text: 'OK'} ]);
    }

  }

  render() {
    const dimensions = Dimensions.get('window');
    return (
      <View>
        <Modal animationType="slide"
          transparent={true}
          visible={this.props.modalVisible}
          onRequestClose={this.props.closeAssignModal}>
          <View style={styles.assignModalView}>
            <View style={styles.assignModalInnerView}>
              <View style={styles.assignedModalVisibleView}>
                <View>
                  <Text style={styles.ticketDispatchText}>Ticket Dispatch</Text>
                  {
                    (this.props.feed.feedType == "AE") ?
                      null :
                      <View style={{ flex: 1, left: 0, position: 'absolute', right: 0, top: 0, zIndex: 1 }}>
                        <Autocomplete
                          data={this.state.filteredData}
                          listStyle={{ maxHeight: 100 }}
                          hideResults={this.state.hideResults}
                          defaultValue={this.state.filterAssetDataText}
                          placeholder="Asset Tag"
                          onChangeText={text => this.filterAssetData(text)}
                          keyExtractor={item => item.assetTag}
                          renderItem={ ({item, index} )=> (
                            <TouchableOpacity onPress={() => this.setState({ filterAssetDataText: item.assetTag, hideResults: true })}>
                              <Text>{item.assetTag}</Text>
                            </TouchableOpacity>
                          )}
                        />
                      </View>
                  }
                  <Picker selectedValue={this.state.assignedTechnicianId}
                    onValueChange={(itemValue, itemIndex) => this.setState({ assignedTechnicianId: itemValue })}>
                    <Picker.Item label="Assign To" value={null} />
                    {this.state.userListItemsForTechnicianPicker.map((item)=>
                     <Picker.Item label={item.firstName + " " + item.lastName} key={item.userId} value={item.userId} /> )}
                  </Picker>
                  <View>
                    <Button transparent onPress={this.showDateTimePicker} style={{ width: dimensions.width / 1.2 }}>
                      <Text style={styles.showDatePickerText}>{this.state.pickerDueDateText}</Text>
                      <Icon style={styles.showDatePickerIcon} name="md-arrow-dropdown" />
                    </Button>
                    <DateTimePicker
                      isVisible={this.state.isDateTimePickerVisible}
                      onConfirm={this.handleDatePicked}
                      onCancel={this.hideDateTimePicker}
                      minimumDate={new Date()} />
                  </View>
                  <View style={styles.assignModalButtonsView}>
                    <TouchableOpacity onPress={this.props.closeAssignModal}>
                      <Text style={styles.assignModalCancelButton}>CANCEL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.prepareAssignTicketJson}>
                      <Text style={styles.assignModalDispatchButton}>DISPATCH</Text>
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

export default FeedAssign;
