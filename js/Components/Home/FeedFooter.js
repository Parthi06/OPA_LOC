import React from 'react';
import { Button } from 'native-base';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import FeedComment from "./FeedComment";
import FeedAssign from "./FeedAssign";
import styles from "./styles";

class FeedFooter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      followIconText: "Follow",
      assignIconText: "ASSIGN",
      isCommentAreaVisible: false,
      isAssignModalVisible: false
    };
    this.followButtonOnClick = this.followButtonOnClick.bind(this);
    this.commentButtonOnClick = this.commentButtonOnClick.bind(this);
    this.assignButtonOnClick = this.assignButtonOnClick.bind(this);
    this.changeAssignIconTextOnDispatch = this.changeAssignIconTextOnDispatch.bind(this);
    this.closeAssignModal = this.closeAssignModal.bind(this);
  }

  closeAssignModal = () => {
    this.setState({ isAssignModalVisible: false });
  }

  assignButtonOnClick = () => {
    this.setState({ isAssignModalVisible: !this.state.isAssignModalVisible });
  }

  changeAssignIconTextOnDispatch = () => {
    if (this.props.ticketCreatedSuccess) {
      this.setState({ assignIconText: "ASSIGNED" });
    }
  }

  followButtonOnClick = () => {

    if (this.setState.followIconText == 'Follow') {
      this.setState({ followIconText: "UnFollow" });
    } else {
      this.setState({ followIconText: "Follow" });
    }
    let followJsonToPost = {
      "eventFollowId": {
        "userId": null,
        "feedType": this.props.feed.feedType,
        "eventId": this.props.feed.eventId
      },
      "followFlag": (this.props.feed.follow == 0) ? 1 : 0
    }
    this.props.saveFollowCallback(followJsonToPost);
  }

  commentButtonOnClick = () => {
    this.setState({ isCommentAreaVisible: !this.state.isCommentAreaVisible });
  }

  render() {
    let feedCommentArray = [];
    if (this.props.feed.feedType == "AT" || this.props.feed.feedType == "UT") {
      feedCommentArray = this.props.feed.ticketComments;
    }
    else {
      feedCommentArray = this.props.feed.eventComments;
    }

    return (
      <View style={{ flex: 1, flexDirection: 'column', }}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            {
              (this.state.followIconText == "UnFollow" || this.props.feed.follow == 1) ?
                <TouchableOpacity style={buttonStyles.button} onPress={this.followButtonOnClick}>
                  <Text style={styles.defaultText}>{"UnFollow"}</Text>
                </TouchableOpacity> :
                <TouchableOpacity style={buttonStyles.button} onPress={this.followButtonOnClick}>
                  <Text style={styles.defaultText}>{"Follow"}</Text>
                </TouchableOpacity>
            }
          </View>
          <View style={{ alignItems: 'center' }}>
            {
              (this.state.assignIconText == "ASSIGNED" || this.props.feed.eventHasTicket == 'YES' ||(this.props.feed.customerType == "P" && this.props.feed.feedType == 'UE' )|| this.props.feed.feedType == 'AT' || this.props.feed.feedType == 'UT') ?
                <Button small transparent>
                  <Text style={styles.defaultText}>{""}</Text>
                </Button>
                :
                <TouchableOpacity style={buttonStyles.button} onPress={this.assignButtonOnClick}>
                  <Text style={styles.defaultText}>{"Assign"}</Text>
                </TouchableOpacity>
            }
            {
              (this.state.isAssignModalVisible) ?
                <FeedAssign modalVisible={this.state.isAssignModalVisible}
                  feed={this.props.feed}
                  closeAssignModal={this.closeAssignModal}
                  users={this.props.users}
                  saveTicketCallback={this.props.saveTicketCallback}
                  changeAssignIconTextOnDispatch={this.changeAssignIconTextOnDispatch}
                  assetTags={this.props.assetTags} /> : null
            }
          </View>
          <View style={{ justifyContent: 'flex-end' }}>
            {
              (feedCommentArray == null || feedCommentArray == 0) ?
                <TouchableOpacity style={buttonStyles.button} onPress={this.commentButtonOnClick}>
                  <Text style={styles.defaultText}>{"Comments"}</Text>
                </TouchableOpacity>
                : <TouchableOpacity style={buttonStyles.button} onPress={this.commentButtonOnClick}>
                  <Text style={styles.defaultText}>{"Comments(" + feedCommentArray.length + ")"}</Text>
                </TouchableOpacity>
            }
          </View>
        </View>
        <View>
          {
            (this.state.isCommentAreaVisible) ? <FeedComment feed={this.props.feed} eventId={this.props.feed.eventId} feedCommentArray={feedCommentArray} users={this.props.users} saveCommentCallback={this.props.saveCommentCallback} /> : null
          }
        </View>
      </View>
    );
  }
}

export default FeedFooter;


const buttonStyles = StyleSheet.create({
  button: {
    alignItems: 'center',
    padding: 6
  }
})
