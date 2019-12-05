import React, { Component } from "react";
import { Text, Picker, Item, Input, InputGroup, Icon } from "native-base";
import { View, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import _ from 'lodash';

class TechnicianActions extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedFeedback: "", //this.props.ticketDetails.checkupResult Ticket #211
      selectedDiagnosis: "",//this.props.ticketDetails.diagnosis,
      noteEntered: this.props.ticketDetails.notes,
      flag: 0,
      majorCategory: 0,
      minorCategory: 0,
      isVisibleminorCategory: false,
      isVisiblefaultString: false,
      isVisiblemajorCategory: false,
      minorCategoryList: [],
      faultString: [],
      filteredMinorCategoryList:[]
    }
    this.prepareFeedbackPostData = this.prepareFeedbackPostData.bind(this);
    this.onFeedBackChange = this.onFeedBackChange.bind(this);
    this.onDiagnosisChange = this.onDiagnosisChange.bind(this);
    this.removeDiagnosisSelection = this.removeDiagnosisSelection.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // if (this.props.ticketState == "REOPENED" && this.state.flag == 0) {
    //   this.setState({ selectedFeedback: (!this.props.ticketDetails.checkupResult) ? "HEALTHY" : this.props.ticketDetails.checkupResult, flag: 1, selectedDiagnosis: this.props.ticketDetails.diagnosis });
    // }
    // if (this.props.ticketState != "REOPENED") {
    //   this.setState({ flag: 0 });
    // }
     if(this.props.isFeedbackCleared){
      this.setState({ selectedFeedback: '',majorCategory: '',minorCategory: 0,selectedDiagnosis: 0,noteEntered:"", isVisibleminorCategory: false,
      isVisiblemajorCategory: false,isVisiblefaultString: false});
      if (this.input != null) 
           this.input._root.clear();
      this.props.clearFeedback(false); 
    }
      

  }

  onDiagnosisChange = (diagnosisValue, dropdownId) => {
    if (dropdownId == 1) {
      const minorCategoryList = this.props.faultEnums.filter((items) => items.majorCategory === diagnosisValue);
      this.prepareMinorCategoryListData( minorCategoryList );   
      this.setState({ isVisibleminorCategory: (minorCategoryList.length > 0) ? true : false, majorCategory: diagnosisValue, minorCategoryList });
    }
    else if (dropdownId == 2) {
      const faultEnumSelectedItem = this.props.faultEnums.filter((items) => items.minorCategory === diagnosisValue);
       //Ticket #171 - Minor issues with feedback changes done on tickets
      if(typeof faultEnumSelectedItem != 'undefined' && faultEnumSelectedItem != null && faultEnumSelectedItem != ""){
        this.setState({ isVisiblefaultString: ((faultEnumSelectedItem[0].faultString).length > 0) ? true : false, minorCategory: diagnosisValue, faultString: faultEnumSelectedItem });
        
        //Ticket #171 - Minor issues with feedback changes done on tickets
        if (faultEnumSelectedItem[0].faultString === "") {
          this.setState({ selectedDiagnosis: faultEnumSelectedItem[0].id/*,isFeedbackEntered:true*/ });
          setTimeout(() => { this.prepareFeedbackPostData() }, 100);
        }
    }

    }
    else if (diagnosisValue != '') {
      this.setState({ selectedDiagnosis: diagnosisValue /*,isFeedbackEntered:true*/});
      setTimeout(() => { this.prepareFeedbackPostData() }, 100);
    }
    }

 //  Filter duplicates in minorCategory - defect drop down
  prepareMinorCategoryListData = ( minorCategoryList ) => { 
        let filteredMinorCategory = [];
        minorCategoryList.forEach (
                ( item ) => {
                            filteredMinorCategory.push(item.minorCategory)
                }
        )
        let tempMinorCategoryFiltered = filteredMinorCategory.filter((elem, pos, arr) => {
            return arr.indexOf(elem) == pos;
          });
          this.setState({
            filteredMinorCategoryList: tempMinorCategoryFiltered
          });
  }


  removeDiagnosisSelection = (dropdownId) => {
    if (dropdownId == 1) {
      this.setState({ selectedFeedback: '',majorCategory: '', isVisibleminorCategory: false,isVisiblemajorCategory: false});
    }
    else if (dropdownId == 2) {
      this.setState({ /*majorCategory: '',*/minorCategory: 0, isVisibleminorCategory: false});
    }
    else {
      this.setState({ selectedDiagnosis: 0});
     //// if (this.state.selectedFeedback === this.props.ticketDetails.checkupResult || this.state.noteEntered === this.props.ticketDetails.notes) {     
     // }
    }
    this.setState({isVisiblefaultString: false/*,isFeedbackEntered:false*/})
    this.props.feedbackSaveCallback(null,false);
  }

  onFeedBackChange = (feedbackValue) => {
    if (feedbackValue === "SELECT")
      this.setState({ selectedFeedback: (this.props.ticketDetails.checkupResult) ? this.props.ticketDetails.checkupResult : "HEALTHY", isVisiblemajorCategory: false });
    else
      this.setState({ selectedFeedback: feedbackValue, isVisiblemajorCategory: true });
   // setTimeout(() => { this.prepareFeedbackPostData() }, 100); //Ticket #211
  }

  onNoteChange = (note) => {
    this.setState({ noteEntered: note });
    setTimeout(() => { this.prepareFeedbackPostData() }, 100);
  }

  prepareFeedbackPostData = () => {
   // if (this.state.selectedFeedback !== this.props.ticketDetails.checkupResult || this.state.selectedDiagnosis !== this.props.ticketDetails.diagnosis || this.state.noteEntered !== this.props.ticketDetails.notes) {
  
      let feedbackPostData = {
        "feedbackId": {
          "assetId": this.props.ticketDetails.assetId,
          "dateTime": new Date().getTime()
        },
        "ticketId": this.props.ticketDetails.ticketId,
        "checkupTime": new Date().getTime(),
        "checkupResult": this.state.selectedFeedback,
        "checkupFaultDiagnosisEnum": this.state.selectedDiagnosis,
        "override": "No_Override",
        "notes": this.state.noteEntered,
        "eventId": this.props.ticketDetails.eventId,
        "userId": this.props.userAuth
      }
      this.props.feedbackSaveCallback(feedbackPostData/*,this.state.isFeedbackEntered*/);
   // }
  }
  render() {
    const dimensions = Dimensions.get('window');
    const diagnosisListItems = _.keys(_.countBy(this.props.faultEnums, function (data) { return data.majorCategory; })).map((item, index) =>
      <Picker.Item label={item.toUpperCase()} key={index} value={item} />);
    return (
      <View>
        <Row size={20}>
          <Col><Text style={{ marginTop: 10, fontSize: 15, fontWeight: "bold" }}>FEEDBACK</Text></Col>
          <Col><Picker mode="dropdown"
            enabled={(this.props.ticketState == "CLOSED" || this.props.ticketState == "CLOSED_WITHOUT_FEEDBACK" || this.state.isVisiblemajorCategory) ? false : true}
            style={{ width: dimensions.width / 2, height: 18, marginTop: 10 }}
            textStyle={{ fontSize: 14 }}
            selectedValue={(this.state.selectedFeedback == "" ?"SELECT":this.state.selectedFeedback)}//Ticket #211
            onValueChange={(itemValue, itemIndex) => this.onFeedBackChange(itemValue)}>
            <Item key={1} label="" value="SELECT"  />
            <Item key={2} label="HEALTHY" value="HEALTHY" />
            <Item key={3} label="MINOR_ISSUE_ADDRESSED" value="MINOR_ISSUE_ADDRESSED" />
            <Item key={4} label="MINOR_ISSUE_DIAGNOSED" value="MINOR_ISSUE_UNADDRESSED" />
            <Item key={5} label="MAJOR_ISSUE_ADDRESSED" value="MAJOR_ISSUE_ADDRESSED" />
            <Item key={6} label="MAJOR_ISSUE_DIAGNOSED" value="MAJOR_ISSUE_UNADDRESSED" />
          </Picker>
          </Col>
        </Row>

        {
          (this.state.isVisiblemajorCategory) ?
            <Row size={20}>
              <Col size={50}><Text style={{ marginTop: 10, fontSize: 15, fontWeight: "bold" }}></Text></Col>
              <Col size={45}><Picker mode="dropdown" disabled={true}
                enabled={(this.props.ticketState == "CLOSED" || this.props.ticketState == "CLOSED_WITHOUT_FEEDBACK" || this.state.isVisibleminorCategory) ? false : true}
                selectedValue={this.state.majorCategory}
                style={{ width: dimensions.width / 2.5 }}
                onValueChange={(itemValue, itemIndex) => this.onDiagnosisChange(itemValue, 1)}>
                <Picker.Item label="" value='' />
                {diagnosisListItems}
              </Picker>
              </Col>
              <Col size={5}>
                <TouchableOpacity onPress={() => this.removeDiagnosisSelection(1)} disabled={(this.props.ticketState == "CLOSED" || this.props.ticketState == "CLOSED_WITHOUT_FEEDBACK" || this.state.isVisibleminorCategory) ? true : false}>
                  <Icon style={(this.props.ticketState == "CLOSED" || this.props.ticketState == "CLOSED_WITHOUT_FEEDBACK" || this.state.isVisibleminorCategory) ? styles.disabled : styles.enabled} name="close" />
                </TouchableOpacity>
              </Col>
            </Row> :
            null
        }

        {
          (this.state.isVisibleminorCategory) ?
            <Row>
              <Col size={50}></Col>
              <Col size={45}>
                <Picker mode="dropdown"
                  enabled={(this.props.ticketState == "CLOSED" || this.props.ticketState == "CLOSED_WITHOUT_FEEDBACK" || this.state.isVisiblefaultString) ? false : true}
                  selectedValue={this.state.minorCategory}
                  style={{ width: dimensions.width / 2.5 }}
                  onValueChange={(itemValue, itemIndex) => this.onDiagnosisChange(itemValue, 2)}>
                  <Picker.Item label="" value='' />
                  {
                    this.state.filteredMinorCategoryList.map((item, index) =>
                        <Picker.Item label={(item == null || item.trim() == '') ? '' : item.toUpperCase()} key={index} value={item} />)
                  }
                </Picker>
              </Col>
              <Col size={5}>
                <TouchableOpacity onPress={() => this.removeDiagnosisSelection(2)} disabled={(this.props.ticketState == "CLOSED" || this.props.ticketState == "CLOSED_WITHOUT_FEEDBACK" || this.state.isVisiblefaultString) ? true : false}>
                  <Icon style={(this.props.ticketState == "CLOSED" || this.props.ticketState == "CLOSED_WITHOUT_FEEDBACK" || this.state.isVisiblefaultString) ? styles.disabled : styles.enabled} name="close" /></TouchableOpacity>
              </Col>
            </Row>
            : null
        }

        {
          (this.state.isVisiblefaultString) ?
            <Row size={20}>
              <Col size={50}></Col>
              <Col size={45}>
                <Picker mode="dropdown"
                  enabled={(this.props.ticketState == "CLOSED" || this.props.ticketState == "CLOSED_WITHOUT_FEEDBACK") ? false : true}
                  selectedValue={this.state.selectedDiagnosis}
                  style={{ width: dimensions.width / 2.5 }}
                  onValueChange={(itemValue, itemIndex) => this.onDiagnosisChange(itemValue, 3)}>
                  <Picker.Item label="" value='' />
                  {this.state.faultString.map((item, index) => { return (item.faultString != null && item.faultString.trim() != '') ? <Picker.Item label={item.faultString.toUpperCase()} key={item.id} value={item.id} /> : [] })}
                </Picker>
              </Col>
              <Col size={5}>
                <TouchableOpacity onPress={() => this.removeDiagnosisSelection(3)} ><Icon style={{ fontSize: 25, paddingTop: 10 }} name="close" /></TouchableOpacity>
              </Col>
            </Row> : null
        }

        <Row size={20}>
          <Col><Text style={{ fontSize: 15, fontWeight: "bold", marginTop: 10 }}>NOTES</Text></Col>
          <Col style={{ borderColor: '#000000', borderWidth: 1, marginTop: 10, backgroundColor: "#ffffff" }}>
            <Row>
              <Col>
                <InputGroup borderType="regular" style={{ height: 25 }}>
                  {
                    (this.props.ticketState == "CLOSED" || this.props.ticketState == "CLOSED_WITHOUT_FEEDBACK") ?
                      <Input style={{ fontSize: 15 }} disabled placeholder='Add note...' onChangeText={(text) => this.onNoteChange(text)} /> :
                      <Input ref={(ref) => { this.input = ref }} style={{ fontSize: 14 }} placeholder='Add note...' onChangeText={(text) => this.onNoteChange(text)} />
                  }
                  {/* value={this.state.noteEntered}  */}
                </InputGroup>
              </Col>
            </Row>
          </Col>
        </Row>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  disabled: {
    fontSize: 25, paddingTop: 10, opacity: 0.1
  },
  enabled: {
    fontSize: 25, paddingTop: 10, opacity: 1
  }
});

export default TechnicianActions;
