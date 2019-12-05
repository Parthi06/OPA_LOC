import React, { Component } from 'react';
import { Icon, Text, Textarea } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import * as AppUtils from '../../Utils/AppUtils';
import * as constants from '../../Utils/Constants';
import ImageDecider from '../Util/ImageDecider'; 
class FeedComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentText: "",
      commentSendBtnState: false
    };
    this.prepareCommentData = this.prepareCommentData.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
  }

  onChangeText(text) {
    this.setState({ commentSendBtnState: (text.trim() == "") ? false : true });
    this.setState({ commentText: text });
  }

  prepareCommentData = () => {
    if (this.state.commentText != null && this.state.commentText != "") {
      if (this.props.feed.feedType == "AT" || this.props.feed.feedType == "UT") {
        let commentDataToSave = {
          "commentId": {
            "ticketId": this.props.feed.ticketId,
            "updatedAt": new Date().getTime(),
            "eventId": this.props.eventId,
          },
          "userId": null,
          "comment": this.state.commentText
        }
        this.props.saveCommentCallback(commentDataToSave, "AT");
        this.setState({ commentText: "", commentSendBtnState: false })
      }
      else if (this.props.feed.feedType == "UE") {
        let commentDataToSave = {
          "commentId": {
            "eventId": this.props.eventId,
            "updatedAt": new Date().getTime()
          },
          "userId": null,
          "comment": this.state.commentText
        }
        this.props.saveCommentCallback(commentDataToSave, "UE");
        this.setState({ commentText: "" })
      } else {
        let commentDataToSave = {
          "commentId": {
            "eventId": this.props.eventId,
            "updatedAt": new Date().getTime()
          },
          "userId": null,
          "comment": this.state.commentText
        }
        this.props.saveCommentCallback(commentDataToSave, "AE");
        this.setState({ commentText: "" })
      }
    }
  }
  render() {
 
    let commentItems = [];
    if (this.props.feedCommentArray != null) {
      commentItems = this.props.feedCommentArray.map((item, index) => {
     
        let commentedUser = this.props.users.find(user => user.userId == item.userId);
        //Ticket #202 - Mobile App will crash if a PU feed has been commented by SU1 and hereafter viewed by SU2
        if(typeof commentedUser == 'undefined')
          commentedUser = {"userDetailsId":0,"userId":0,"tenantId":1,"firstName":"-","lastName":"-","userProfilePic":"default.jpg","userType":"Technician","userState":"AVAIL","location":"Los Angeles,CA","lastActiveDatetime":1548938600300};
        return (
          <Row key={index}>
            <Col size={100} style={{ paddingTop: 12 }}>
              <Row size={59}>
                <ImageDecider uri={constants.SERVER_URL + "/profilepic/" + commentedUser.userId + ".jpg"} />
                <Col size={20} style={{ paddingLeft: 5 }}><Text style={{ fontSize: 15, fontWeight: "bold" }}>{commentedUser.firstName + " " + commentedUser.lastName}</Text><Text note>{AppUtils.convertTimestampToDateTime(item.commentId.updatedAt)}</Text></Col>
              </Row>
              <Row size={59}>
                <Col size={20} style={{ paddingLeft: 35 }}><Text note style={{ fontSize: 14 }}>{item.comment}</Text></Col>
              </Row>
            </Col>
          </Row>
        );
      }
      );
    }
    return (
      <View>
        <Row>
          <Grid style={{ backgroundColor: '#ffffff', elevation: 3, borderRadius: 10 }}>
            <Col style={{ borderTopColor: '#000000', borderTopWidth: 1 }} />
            <Row>
              <ScrollView>
                {commentItems}
              </ScrollView>
            </Row>
           { (this.props.feed.ticketState == "CLOSED" || this.props.feed.ticketState == "CLOSED_WITHOUT_FEEDBACK")? <Row></Row>:
            <Row>
              <Col size={90}>
                <Textarea placeholder='Add comment..'
                  value={this.state.commentText}
                  onChangeText={(text) => this.onChangeText(text)} />
              </Col>
              <Col size={10}>
                <TouchableOpacity disabled={!this.state.commentSendBtnState} onPress={this.prepareCommentData}>
                  <Icon size={27} name="md-send" style={{ paddingTop: 10, color: (this.state.commentSendBtnState == true) ? 'darkblue' : 'lightgray' }} />
                </TouchableOpacity>
              </Col>
            </Row>}
          </Grid>
        </Row>
      </View>
    );
  }
}
export default FeedComment;
