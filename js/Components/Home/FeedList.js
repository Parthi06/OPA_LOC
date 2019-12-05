import React from "react";
import UserFeedItem from "./UserFeedItem";
import AssetFeedItem from "./AssetFeedItem";
import TicketFeedItem from "./TicketFeedItem";

export default class FeedList extends React.Component {

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ((this.props.item !== nextProps.item)) {
      return true;
    }
    return false;
  }
  render() {
    if (this.props.item.feedType == 'UE' || this.props.item.feedType == 'UE' && this.props.filterBtnStatus.follow) {
      return (
        <UserFeedItem feed={this.props.item}
          users={this.props.users}
          latestEventTimestamp={this.props.latestEventTimestamp}
          saveCommentCallback={this.props.saveCommentCallback}
          saveFollowCallback={this.props.saveFollowCallback}
          saveTicketCallback={this.props.saveTicketCallback}
          handleReadMore={this.props.handleReadMore}
          assetTags={this.props.assetTags}
          ticketCreatedSuccess={this.props.ticketCreatedSuccess}
          customerType ={this.props.customerType}
          key={this.props.item.eventId}
        />
      );
    }
    else if (this.props.item.feedType == 'AE' || (this.props.item.feedType == 'AE' && this.props.filterBtnStatus.follow)) {
      //let neededAsset = this.props.assets.find(asset => asset.assetId == this.props.item.assetId);
      return (
        <AssetFeedItem feed={this.props.item}
          users={this.props.users}
          navigation={this.props.navigation}
          isNewEventsAvailable={this.props.isNewEventsAvailable}
          latestEventTimestamp={this.props.latestEventTimestamp}
          saveCommentCallback={this.props.saveCommentCallback}
          saveFollowCallback={this.props.saveFollowCallback}
          saveTicketCallback={this.props.saveTicketCallback}
          // neededAsset={neededAsset}
          ticketCreatedSuccess={this.props.ticketCreatedSuccess}
          customerType ={this.props.customerType}
          key={this.props.item.eventId}
          curScreen={this.props.curScreen}
        />
      );
    }
    else if (((this.props.item.feedType == 'AT' || this.props.item.feedType == 'UT')
      || ((this.props.item.feedType == 'AT' || this.props.item.feedType == 'UT') && this.props.filterBtnStatus.follow))) {
      //let neededAsset = this.props.assets.find(asset => asset.assetId == this.props.item.assetId);
      return (
        <TicketFeedItem feed={this.props.item}
          navigation={this.props.navigation}
          users={this.props.users}
          saveCommentCallback={this.props.saveCommentCallback}
          saveFollowCallback={this.props.saveFollowCallback}
          saveTicketCallback={this.props.saveTicketCallback}
          //neededAsset={neededAsset}
          faultEnums={this.props.faultEnums}
          customerType ={this.props.customerType}
          key={this.props.item.eventId}
        />
      );
    }
    else {
      return null;
    }

  }
}
