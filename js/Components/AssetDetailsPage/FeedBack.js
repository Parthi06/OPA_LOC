import React, { Component } from "react";
import { Picker, Item, Header, Body, Title, Icon } from "native-base";
import { Text, View, Dimensions, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import _ from 'lodash';
import { COLORS } from "../../Utils/AppConstants";

export default class FeedBack extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedFeedback: "",
      selectedDiagnosis: "",
      noteEntered: "",
      flag: 0,
      majorCategory: 0,
      minorCategory: 0,
      isVisibleminorCategory: false,
      isVisiblefaultString: false,
      isVisiblemajorCategory: false,
      minorCategoryList: [],
      faultString: [],
      filteredMinorCategoryList: [],
      expectedTitle: "",
      saveBtnDisable: true,
      majorListItem: "",
      minorListItem: "",
      faultEnumListItem: "",
      syncNote: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isFeedbackCleared) {
      this.setState({
        selectedFeedback: '', majorCategory: '', minorCategory: 0, selectedDiagnosis: 0, noteEntered: "", isVisibleminorCategory: false,
        isVisiblemajorCategory: false, isVisiblefaultString: false
      });
      if (this.input != null)
        this.input._root.clear();
      this.props.clearFeedback(false);
    }
  }

  // onChange drop down value.
  onDiagnosisChange = (diagnosisValue, dropdownId) => {
    if (dropdownId == 1) {
      const minorCategoryList = this.props.faultEnums.filter((items) => items.majorCategory === diagnosisValue);
      this.prepareMinorCategoryListData(minorCategoryList);
      this.setState({ majorListItem: diagnosisValue, isVisibleminorCategory: (minorCategoryList.length > 0) ? true : false, majorCategory: diagnosisValue, minorCategoryList });
    }
    else if (dropdownId == 2) {
      const faultEnumSelectedItem = this.props.faultEnums.filter((items) => items.minorCategory === diagnosisValue);
      if (typeof faultEnumSelectedItem != 'undefined' && faultEnumSelectedItem != null && faultEnumSelectedItem != "") {
        this.setState({ minorListItem: diagnosisValue, isVisiblefaultString: ((faultEnumSelectedItem[0].faultString).length > 0) ? true : false, minorCategory: diagnosisValue, faultString: faultEnumSelectedItem, saveBtnDisable: false });
        if (faultEnumSelectedItem[0].faultString === "") {
          this.setState({ selectedDiagnosis: faultEnumSelectedItem[0].id, saveBtnDisable: false, syncNote: true });
          setTimeout(() => { this.prepareFeedbackPostData() }, 100);
        }
      }
    }
    else if (diagnosisValue != '') {
      this.setState({ selectedDiagnosis: diagnosisValue, saveBtnDisable: false, syncNote: true });
      setTimeout(() => { this.prepareFeedbackPostData() }, 100);
      if (dropdownId == 3) {
        var filteredFaultEnum = this.props.faultEnums.filter(
          (eachFaultEnumObject, index) => {
            return (eachFaultEnumObject.id === diagnosisValue)
          })
        this.setState(
          {
            faultEnumListItem: filteredFaultEnum[0].faultString
          }
        )
      }
    }
  }

  //  Filter duplicates in minorCategory - defect drop down
  prepareMinorCategoryListData = (minorCategoryList) => {
    let filteredMinorCategory = [];
    minorCategoryList.forEach(
      (item) => {
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

  saveBtnClickHandler = () => {
    this.props.saveFeedBack();
    this.removeDiagnosisSelection(1);
    this.setState({ noteEntered: "" });
  }


  removeDiagnosisSelection = (dropdownId) => {
    if (dropdownId == 1) {
      this.setState({ selectedFeedback: '', majorCategory: '', isVisibleminorCategory: false, isVisiblemajorCategory: false, syncNote: false });
    }
    else if (dropdownId == 2) {
      this.setState({ minorCategory: 0, isVisibleminorCategory: false, syncNote: false });
    }
    else {
      this.setState({ selectedDiagnosis: 0 });
    }
    this.setState({ isVisiblefaultString: false })
    this.props.feedbackSaveCallback(null);
  }

  onFeedBackChange = (feedbackValue) => {
    this.setState({ selectedFeedback: feedbackValue, isVisiblemajorCategory: true });
  }

  onNoteChange = (note) => {
    this.setState({ noteEntered: note });
    if (this.state.syncNote) {
      setTimeout(() => { this.prepareFeedbackPostData() }, 100);
    }
  }

  prepareFeedbackPostData = () => {
    let feedbackPostData = {
      "assetId": this.props.assetDetails.assetId,
      "userId": this.props.userAuth.userId,
      "userText": (this.props.userAuth.firstName + ' ' +
        this.props.userAuth.lastName +
        ' provided a feedback').toLowerCase(),
      "eventId": "",
      "checkupFaultDiagnosisEnum": this.state.selectedDiagnosis,
      "checkupResult": this.state.selectedFeedback,
      "override": "No_Override",
      "notes": this.state.noteEntered,
      "ticketId": ""
    }
    this.props.feedbackSaveCallback(feedbackPostData);
  }

  render() {
    const dimensions = Dimensions.get('window');
    const diagnosisListItems = _.keys(_.countBy(this.props.faultEnums, function (data) { return data.majorCategory; })).map((item, index) =>
      <Picker.Item label={item.toUpperCase()} key={index} value={item} />);
    return (
      <View>
        <Header style={{ backgroundColor: '#E9E9EF' }}>
          <Body style={{ backgroundColor: '#E9E9EF', alignItems: 'center' }}>
            <Title style={{ color: '#000000', backgroundColor: '#E9E9EF' }}>Quick feedback</Title>
          </Body>
        </Header>
        <Grid size={300} style={{ margin: 20 }}>
          <Row size={30} style={styles.eachRowSpace}>
            <Col size={5}>
            </Col>
            <Col size={25}><Text style={{ color: '#000000', marginTop: 10, fontSize: 15, fontWeight: "bold" }}>FEEDBACK</Text></Col>
            <Col size={40}>
              <Picker mode="dropdown"
                enabled={this.state.isVisiblemajorCategory ? false : true}
                style={{ width: dimensions.width / 2 - 5, height: 20, marginTop: 10 }}
                textStyle={{ fontSize: 14 }}
                selectedValue={(this.state.selectedFeedback == "" ? "SELECT" : this.state.selectedFeedback)}
                onValueChange={(itemValue, itemIndex) => this.onFeedBackChange(itemValue)}>
                <Item key={1} label="" value="SELECT" value="SELECT" />
                <Item key={2} label="HEALTHY" value="HEALTHY" />
                <Item key={3} label="MINOR_ISSUE_ADDRESSED" value="MINOR_ISSUE_ADDRESSED" />
                <Item key={4} label="MINOR_ISSUE_DIAGNOSED" value="MINOR_ISSUE_UNADDRESSED" />
                <Item key={5} label="MAJOR_ISSUE_ADDRESSED" value="MAJOR_ISSUE_ADDRESSED" />
                <Item key={6} label="MAJOR_ISSUE_DIAGNOSED" value="MAJOR_ISSUE_UNADDRESSED" />
              </Picker>
            </Col>
            <Col size={30}>
            </Col>
          </Row>
          {
            (this.state.isVisiblemajorCategory) ?
              <Row size={30} style={styles.eachRowSpace}>
                <Col size={30}><Text style={{ marginTop: 35, fontSize: 15, fontWeight: "bold" }}></Text></Col>
                <Col size={40}><Picker mode="dropdown"
                  enabled={this.state.isVisibleminorCategory ? false : true}
                  selectedValue={this.state.majorCategory}
                  style={{ width: dimensions.width / 2 - 10, height: 18, marginTop: 40 }}
                  onValueChange={(itemValue, itemIndex) => this.onDiagnosisChange(itemValue, 1)}>
                  <Picker.Item label="" value='' />
                  {diagnosisListItems}
                </Picker>
                </Col>
                <Col size={15}>
                </Col>
                <Col size={15}>
                  <Icon style={styles.closeBtn1} name="close" type='EvilIcons' onPress={() => this.removeDiagnosisSelection(1)} />
                </Col>
              </Row> :
              //null
              <Text>{}</Text>
          }
          {
            (this.state.isVisibleminorCategory) ?
              <Row size={30} style={styles.eachRowSpace}>
                <Col size={30}></Col>
                <Col size={40}>
                  <Picker mode="dropdown"
                    enabled={this.state.isVisiblefaultString ? false : true}
                    selectedValue={this.state.minorCategory}
                    style={{ width: dimensions.width / 2 - 10, height: 18, marginTop: 70 }}
                    onValueChange={(itemValue, itemIndex) => this.onDiagnosisChange(itemValue, 2)}>
                    <Picker.Item label="" value='' />
                    {
                      this.state.filteredMinorCategoryList.map((item, index) =>
                        <Picker.Item label={(item == null || item.trim() == '') ? '' : item.toUpperCase()} key={index} value={item} />)
                    }
                  </Picker>
                </Col>
                <Col size={15}>
                </Col>
                <Col size={15}>
                  <Icon style={styles.closeBtn2} name="close" type='EvilIcons' onPress={() => this.removeDiagnosisSelection(2)} />
                </Col>
              </Row>
              :
              // null
              <Text>{}</Text>
          }

          {
            (this.state.isVisiblefaultString) ?
              <Row size={30} style={styles.eachRowSpace}>
                <Col size={30}></Col>
                <Col size={40}>
                  <Picker mode="dropdown"
                    enabled={true}
                    selectedValue={this.state.selectedDiagnosis}
                    style={{ width: dimensions.width / 2 - 10, height: 18, marginTop: 100 }}
                    onValueChange={
                      (itemValue, itemIndex) => {
                        this.onDiagnosisChange(itemValue, 3)
                      }
                    }>
                    <Picker.Item label="" value='' />
                    {this.state.faultString.map((item, index) => { return (item.faultString != null && item.faultString.trim() != '') ? <Picker.Item label={item.faultString.toUpperCase()} key={item.id} value={item.id} /> : [] })}
                  </Picker>
                </Col>
                <Col size={15}>
                </Col>
                <Col size={15}>
                  <Icon style={styles.closeBtn3} name="close" type='EvilIcons' onPress={() => this.removeDiagnosisSelection(3)} />
                </Col>

              </Row> :
              //null
              <Text>{}</Text>}

          <Row size={30}>
            <Col size={5}>
            </Col>
            <Col size={25}><Text style={{ color: '#000000', fontSize: 15, fontWeight: "bold", marginTop: 130 }}>NOTES</Text></Col>
            <Col size={60}><TextInput
              maxLength={100}
              style={{ height: 45, width: dimensions.width / 2 - 10, marginTop: 130, borderColor: 'black', borderWidth: 1 }}
              editable={true}
              multiline={false}
              placeholder="Add note here"
              value={this.state.noteEntered}
              onChangeText={(text) => this.onNoteChange(text)} />
            </Col>
            <Col size={10}>
            </Col>
          </Row>
          <Row size={30}>
            <Col size={30}></Col>
            <Col size={40}>
              {
                this.props.oneStepFeedbackInitiatedReducer
                  ?
                  <ActivityIndicator size="small" color="#50ABDF" style={{ marginTop: 250 }} />
                  :
                  <TouchableOpacity
                    style={styles.button}
                    onPress={this.saveBtnClickHandler}
                    disabled={this.state.saveBtnDisable}
                  >
                    <Text style={styles.textSyling}> SAVE </Text>
                  </TouchableOpacity>
              }
            </Col>
            <Col size={30}></Col>
          </Row>
        </Grid>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  disabled: {
    fontSize: 25,
    opacity: 0.7
  },
  enabled: {
    fontSize: 25,
    opacity: 1
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#e0e0eb',
    paddingBottom: 30,
    paddingTop: 12,
    paddingLeft: 12,
    paddingRight: 12,
    marginTop: 250,
    borderColor: '#000000',
    borderWidth: 1,
  },
  textSyling: {
    fontSize: 14,
    //fontWeight: 'bold',
    color: '#000000',
  },
  closeBtn1: {
    marginTop: 35
  },
  closeBtn2: {
    marginTop: 65
  },
  closeBtn3: {
    marginTop: 100
  },
  eachRowSpace: {
    paddingBottom: 10
  }
});