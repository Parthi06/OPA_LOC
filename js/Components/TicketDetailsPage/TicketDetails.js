import React, { Component } from 'react';
import { Text } from 'native-base';
import { View, Picker, TouchableOpacity } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import * as AppUtils from '../../Utils/AppUtils';

class TicketDetails extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      assignedTechnicianId: null,
      ticketCreatedUserObj: {},
      defaultUserObj: {},
      usersList:[]
    }
    this.OnAssignedPersonChange = this.OnAssignedPersonChange.bind(this);
  }

  OnAssignedPersonChange = (assignedPersonId, itemIndex) => {
    this.setState({ assignedTechnicianId: assignedPersonId });
    let ticketAssignedToName = this.props.users[itemIndex].firstName + " " + this.props.users[itemIndex].lastName;
    this.props.ticketAssignedToSaveCallback(this.props.ticketDetails.ticketId, assignedPersonId, ticketAssignedToName);
  }

  componentDidMount() {
    const usersList = this.props.users.filter((item, index) => {
      //If customerType is primary, the technician picker needs only to be filled with primary users.
       if( this.props.ticketDetails.customerType == "P" && item.customerType ==="P" ){
          return  item;
       }
       else  if ( (this.props.ticketDetails.customerType == "S") && ((this.props.ticketDetails.customerId ===  item.tenantId || item.customerType ==="P")))
         return  item;
    });
    this.setState({usersList:usersList})
    // let defaultUser = this.props.users.find(event =>
    //   event.firstName + " " + event.lastName == this.props.ticketDetails.ticketAssignedToId
    // );
    this.setState({ assignedTechnicianId: this.props.ticketDetails.ticketAssignedToId });
    // let ticketCreatedUser = this.props.users.find(user => user.userId == this.props.ticketDetails.tickeAssignee);
    // // this.setState({ ticketCreatedUserObj: ticketCreatedUser, defaultUserObj: defaultUser });
    // this.setState({ ticketCreatedUserObj: ticketCreatedUser });
  }

  render() {
    return (
      <View>
        <Row size={20}>
          <Col><Text style={{ fontSize: 15, fontWeight: "bold", paddingTop: 10 }}>TICKET NO</Text></Col>
          <Col>
            <Row>
              <Text style={{ fontSize: 15, paddingTop: 8 }}>{"#" + this.props.ticketDetails.ticketId}</Text>
            </Row>
          </Col>
        </Row>
        <Row size={20}>
          <Col><Text style={{ fontSize: 15, fontWeight: "bold" }}>ASSET</Text></Col>
          <Col>
            <TouchableOpacity onPress={() => this.props.navigation.navigate({ routeName: "AssetDetailsPage", params: { feedParam: this.props.ticketDetails }, key: "AssetDetailsPageKey" })}>
              <Text style={{ fontSize: 15, color: "blue" }} >{this.props.ticketDetails.assetTag}</Text>
            </TouchableOpacity>
          </Col>
        </Row>
        <Row size={20}>
          <Col><Text style={{ fontSize: 15, fontWeight: "bold" }}>DATE CREATED</Text></Col>
          <Col><Text style={{ fontSize: 15 }}>{AppUtils.convertTimestampToDateTime(this.props.ticketDetails.ticketCreatedDate)}</Text></Col>
        </Row>
        <Row size={20}>
          <Col><Text style={{ fontSize: 15, fontWeight: "bold" }}>DUE DATE</Text></Col>
          <Col><Text style={{ fontSize: 15 }}>{AppUtils.convertTimestampToDate(this.props.ticketDetails.ticketDueDate)}</Text></Col>
        </Row>
        <Row size={20}>
          <Col><Text style={{ fontSize: 15, fontWeight: "bold" }}>LAST UPDATE</Text></Col>
          <Col>
            <Text style={{ fontSize: 15 }}>{AppUtils.convertTimestampToDateTime((this.props.ticketDetails.lastUpdated ? this.props.ticketDetails.lastUpdated : this.props.ticketDetails.ticketLastUpdated))}</Text>
          </Col>
        </Row>
        <Row size={20}>
          <Col><Text style={{ fontSize: 15, fontWeight: "bold" }}>REOPENED DATE</Text></Col>
          <Col>
            <Text style={{ fontSize: 15 }}>{(this.props.ticketReopenedDate == null) ? "-" : AppUtils.convertTimestampToDateTime(this.props.ticketReopenedDate)}</Text>
          </Col>
        </Row>
        <Row size={20}>
          <Col><Text style={{ fontSize: 15, fontWeight: "bold" }}>CREATED BY</Text></Col>
          <Col><Text style={{ fontSize: 15 }}>{this.props.ticketDetails.ticketAssignName}</Text></Col>
        </Row>
        <Row size={20}>
          <Col><Text style={{ fontSize: 15, fontWeight: "bold", paddingTop: 15 }}>ASSIGNED TO</Text></Col>
          <Col>
            <Picker selectedValue={this.state.assignedTechnicianId} 
              style={{ marginLeft:-8 }}
              enabled={(this.props.ticketState == "CLOSED" || this.props.ticketState == "CLOSED_WITHOUT_FEEDBACK") ? false : true}
              onValueChange={(itemValue, itemIndex) => this.OnAssignedPersonChange(itemValue, itemIndex)}>

              {this.state.usersList.map((item, index) =>
                <Picker.Item  
                 label={item.firstName + " " + item.lastName} 
                 key={item.userId} 
                 value={item.userId} 
                />)}
            </Picker>
          </Col>
        </Row>
        {
          (this.props.ticketDetails.prognosisSummary1 != null && this.props.ticketDetails.prognosisSummary1 != "") ?
            <Row size={20}>
              <Col><Text style={{ fontSize: 15, fontWeight: "bold" }}>PROGNOSIS</Text></Col>
              <Col><Text style={{ fontSize: 15 }}>{this.props.ticketDetails.prognosisSummary1}</Text>
                <Row size={20}>
                  <Col><Text style={{ fontSize: 15 }}>{this.props.ticketDetails.prognosisDetails1}</Text></Col>
                </Row>
              </Col>
            </Row>
            :
            <Row size={20}>
              <Col><Text style={{ fontSize: 15, fontWeight: "bold" }}>PROGNOSIS</Text></Col>
              <Col><Text style={{ fontSize: 15 }}>{this.props.ticketDetails.prognosisDetails1}</Text></Col>
            </Row>
        }
      </View>
    );
  }
}
export default TicketDetails;

