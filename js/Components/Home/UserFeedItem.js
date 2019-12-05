import React from "react";
import { Text } from 'native-base';
import { View, TouchableWithoutFeedback } from 'react-native';
import FeedFooter from "./FeedFooter";
import * as AppUtils from '../../Utils/AppUtils';
import * as constants from '../../Utils/Constants'; //renderViewMore,renderViewLess
import styles from "./styles";
import ReadMore from '../General/ReadMore';
import ImageDecider from '../Util/ImageDecider';

function UserFeedItem({ feed, users, ticketCreatedSuccess, saveCommentCallback, saveFollowCallback, saveTicketCallback, assetTags, handleReadMore ,customerType}) {
  return (
    <View style={styles.eventContainer}>
      <View style={styles.eventBody}>
        <View style={styles.row}>
          <View style={{ flex: 1, paddingLeft: 10, flexDirection: 'row' }}>
            <ImageDecider uri={constants.SERVER_URL + "/profilepic/" + feed.userId + ".jpg"} />
            {/* <FastImage
              style={{ height: 30, width: 30 }}
              source={{
                uri: constants.SERVER_URL + "/profilepic/" + feed.userId + ".jpg",
                priority: FastImage.priority.normal,
              }}
              onError={(e) => console.log("errore", e)}
            /> */}
            <View style={{ flexDirection: 'column', paddingLeft: 5 }}>
              <Text>{feed.userName}</Text>
              {(feed.userName.includes("admin") || feed.userName.includes("support") || feed.userName.includes("system"))
                ? <Text note>{feed.userType}</Text> : null}
            </View>
          </View>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text note style={{ textAlign: 'center' }} >{AppUtils.convertTimestampToDate(feed.eventCreatedDate)}</Text>
            <Text note style={{ textAlign: 'center' }} >{AppUtils.convertTimestampToTime(feed.eventCreatedDate)}</Text>
          </View>
        </View>
        <View style={{ padding: 10, flex: 1 }}>
          <ReadMore
            numberOfLines={1}
            onReady={handleReadMore}>
            <Text>{feed.userText}</Text></ReadMore>
        </View>
        <View style={{ flex: 1, borderColor: '#000000', borderTopWidth: 1.2 }}>
          <FeedFooter ticketCreatedSuccess={ticketCreatedSuccess} feed={feed} assetTags={assetTags} users={users} customerType={customerType} saveCommentCallback={saveCommentCallback} saveFollowCallback={saveFollowCallback} saveTicketCallback={saveTicketCallback} />
        </View>
      </View>
    </View >
  );
}

export default UserFeedItem;