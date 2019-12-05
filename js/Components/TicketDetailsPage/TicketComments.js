import React from 'react';
import { Text } from "native-base";
import { View, ScrollView } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import * as AppUtils from '../../Utils/AppUtils';
import * as constants from '../../Utils/Constants';
import FeedComment from "../Home/FeedComment";
import { findState } from './filter';
import ImageDecider from '../Util/ImageDecider';

function TicketComments({ ticketDetails, users, events, saveCommentCallback, loadTicketHistory, ticketState }) {
  let eventCommentItems = [];
  let ticketCommentItems = [];
  //var initialEventBeforeDispatch = events.filter(event => event.eventId == ticketDetails.eventId && (event.feedType == "AE" || event.feedType == "UE"));
  if (ticketDetails.eventComments != null) {
    eventCommentItems = ticketDetails.eventComments.map((item, index) => {
      let commentedUser = users.find(user => user.userId == item.userId);
      //Ticket #202 - Mobile App will crash if a PU feed has been commented by SU1 and hereafter viewed by SU2
      if(typeof commentedUser == 'undefined')
          commentedUser = {"userDetailsId":0,"userId":0,"tenantId":1,"firstName":"-","lastName":"-","userProfilePic":"default.jpg","userType":"Technician","userState":"AVAIL","location":"Los Angeles,CA","lastActiveDatetime":1548938600300};
      return (
        <View key={index}>
          <Row size={20}>
            <ImageDecider uri={constants.SERVER_URL + "/profilepic/" + commentedUser.userId + ".jpg"} />
            {/* <Thumbnail style={{ width: 30, height: 30 }} source={{ uri: constants.SERVER_URL + "/profilepic/" + commentedUser.userId + ".jpg" }} /> */}
            <Col size={12} style={{ paddingLeft: 5 }}><Text style={{ fontSize: 15, fontWeight: "bold" }}>{commentedUser.firstName + " " + commentedUser.lastName}</Text><Text note>{AppUtils.convertTimestampToDateTime(item.commentId.updatedAt)}</Text></Col>
          </Row>
          <Row size={20}>
            <Col style={{ paddingLeft: 35 }} size={8}><Text style={{ fontSize: 15 }}>{item.comment}</Text></Col>
          </Row>
        </View>
      );
    }
    );
  }
  if (ticketDetails.ticketComments != null) {
    let commentedUser;
    let cmtIndex = 0;
    ticketCommentItems = loadTicketHistory.map((item, index) => {
      if (item.ticketState == "CM")
        cmtIndex++;
      commentedUser = users.find(user => user.userId == item.userId1);
      //Ticket #202 - Mobile App will crash if a PU feed has been commented by SU1 and hereafter viewed by SU2
      if(typeof commentedUser == 'undefined')
          commentedUser = {"userDetailsId":0,"userId":0,"tenantId":1,"firstName":"-","lastName":"-","userProfilePic":"default.jpg","userType":"Technician","userState":"AVAIL","location":"Los Angeles,CA","lastActiveDatetime":1548938600300};
      return (
        <View key={index}>
          <Row size={20}>
            {(item.ticketState != "CM") ?
              null :
              <ImageDecider uri={constants.SERVER_URL + "/profilepic/" + item.userId1 + ".jpg"} />
            }
            {/* <Thumbnail style={{ width: 30, height: 30 }} source={(item.ticketState != "CM") ? constants.SERVER_URL + "/profilepic/defaultUser.jpg" : constants.SERVER_URL + "/profilepic/" + item.userId1 + ".jpg"} /> */}
            <Col size={12} style={{ paddingLeft: 5 }} >
              <Text style={(item.ticketState != "CM") ? { fontSize: 15, fontWeight: "bold", paddingLeft: 30 } : { fontSize: 15, fontWeight: "bold" }}>
                {(item.ticketState != "CM") ? "[system]" : commentedUser.firstName + " " + commentedUser.lastName}
              </Text>
              <Text style={(item.ticketState != "CM") ? { paddingLeft: 30 } : {}} note>{AppUtils.convertTimestampToDateTime(item.ticketDate)}</Text>
            </Col>
          </Row>
          <Row size={20}>
            <Col size={12} style={{ paddingLeft: 35 }}>
              <Text style={(item.ticketState != "CM") ? { fontSize: 15, fontStyle: "italic" } : { fontSize: 15 }}>
                {findState(commentedUser.firstName, item, users, ticketDetails.ticketComments, cmtIndex)}
              </Text>
            </Col>
          </Row>
        </View >
      );
    }
    );
    // ticketCommentItems = ticketDetails.ticketComments.map((item, index) => {
    //   commentedUser = users.find(user => user.userId == item.userId);
    //   return (
    //     <View key={index}>
    //       <Row size={20}>
    //         <Thumbnail style={{ width: 30, height: 30 }} source={{ uri: constants.SERVER_URL + "/profilepic/" + commentedUser.userId + ".jpg" }} />
    //         <Col size={12} style={{ paddingLeft: 5 }}><Text style={{ fontSize: 15, fontWeight: "bold" }}>{commentedUser.firstName + " " + commentedUser.lastName}</Text><Text note>{AppUtils.convertTimestampToDateTime(item.commentId.updatedAt)}</Text></Col>
    //         <Col size={8}><Text style={{ fontSize: 14 }}>{item.comment}</Text></Col>
    //       </Row>
    //     </View>
    //   );
    // }

  }

  return (
    <View style={{ paddingTop: 10, paddingBottom: 10 }}>
      <ScrollView contentContainerStyle={{ flex: 0 }}>
        {eventCommentItems}
        {ticketCommentItems}
        <View style={{ padding: 10 }}>
          {
            (ticketState == "CLOSED" || ticketState == "CLOSED_WITHOUT_FEEDBACK") ?
              null :
              <FeedComment feed={ticketDetails} disabled eventId={ticketDetails.eventId} feedCommentArray={[]} users={users} saveCommentCallback={saveCommentCallback} />
          }
        </View>
        {(ticketDetails.eventComments == null && ticketDetails.ticketComments == null) ? <Text note>No comments</Text> : null}
      </ScrollView>
    </View>
  );
}

export default TicketComments;
