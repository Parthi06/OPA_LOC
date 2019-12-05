import React from 'react';
import { Thumbnail, Text } from 'native-base';
import { View, TouchableOpacity } from 'react-native';
import FeedFooter from "./FeedFooter";
import * as AppUtils from '../../Utils/AppUtils';
import styles from "./styles";

function TicketFeedItem({ feed, users, faultEnums, navigation, saveCommentCallback, saveFollowCallback, saveTicketCallback, neededAsset,customerType }) {
  //Changing Unaddressed to Diagnosed.
  var checkupResult = ((feed.checkupResult === "MINOR_ISSUE_UNADDRESSED")?"MINOR_ISSUE_DIAGNOSED":
                                ((feed.checkupResult === "MAJOR_ISSUE_UNADDRESSED")?"MAJOR_ISSUE_DIAGNOSED":feed.checkupResult));
  checkupResult = (checkupResult != null) ? checkupResult.replace(/[_-]/g, " ").toLowerCase() : null;
  //var diagnosis = (feed.diagnosis!= null)?feed.diagnosis.replace(/[_-]/g, " ").toLowerCase():null;
  var prognosis = (feed.prognosisDetails1 != null) ? feed.prognosisDetails1.replace("Possibilities:", "").trim() : null;
  var neededDiagnosis = faultEnums.find(fault => fault.id == feed.diagnosis);
  var neededDiagnosisAlteration = (neededDiagnosis != null) ? (neededDiagnosis.majorCategory + " - " + neededDiagnosis.minorCategory + (((neededDiagnosis.faultString == null || neededDiagnosis.faultString.replace(/[_-]/g, "")).trim() == "") ? "" : " - " + neededDiagnosis.faultString.replace(/[_-]/g, "")).trim()) : null;
  //var closedByUser = users.find(user => user.userId == feed.ticketClosedBy);
 // var closedByUserName = (closedByUser != null) ? closedByUser.firstName + " " + closedByUser.lastName : null;

  return (
    <View style={styles.eventContainer}>
      <View style={styles.eventBody}>
        <View style={styles.row}>
          <View style={{ flex: 1, paddingLeft: 10, flexDirection: 'row' }}>
            <Thumbnail style={{ height: 30, width: 30 }} square
              source={(feed.ticketState == "OPEN" || feed.ticketState == "REOPENED") ? require("./Images/open.png") : require("./Images/closed.png")} />
            <TouchableOpacity style={{ paddingLeft: 5 }} onPress={() => navigation.navigate({ routeName: 'TicketDetailsPage', params: { ticketParam: feed }, key: 'TicketDetailsPageKey' })}>
              <Text style={{ textDecorationLine: "underline" }}>Ticket # {feed.ticketId}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text note style={{ textAlign: 'center' }} >{AppUtils.convertTimestampToDate(feed.ticketCreatedDate)}</Text>
            <Text note style={{ textAlign: 'center' }} >{AppUtils.convertTimestampToTime(feed.ticketCreatedDate)}</Text>
          </View>
        </View>
        <View style={{ paddingLeft: 12, paddingBottom: 10 }}>
          {(feed.ticketState == "OPEN" || feed.ticketState == "REOPENED") ?
            <Text note>{"Assigned to:" + feed.ticketAssignedTo}</Text> :
            (feed.ticketClosedName != null) ? <Text note>Closed by: {feed.ticketClosedName }</Text> : null}
          <Text style={{ paddingBottom: 10 }}>{"Asset: " + feed.assetTag}</Text>
          {(prognosis != null && prognosis != "") ? <Text>{prognosis.trim()}</Text> : null}
          {(checkupResult != null) ? < Text note>Feedback: {checkupResult} </Text> : null}
          {(neededDiagnosisAlteration != null) ? <Text note>{neededDiagnosisAlteration} </Text> : null}
        </View>
        <View style={{ flex: 1, borderColor: '#000000', borderTopWidth: 1.2 }}>
          <FeedFooter feed={feed} users={users} customerType={customerType} saveCommentCallback={saveCommentCallback} saveFollowCallback={saveFollowCallback} saveTicketCallback={saveTicketCallback} />
        </View>
      </View>
    </View >
  );
}

export default TicketFeedItem;
