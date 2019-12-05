import React from "react";
import { View, Text, FlatList, Dimensions } from "react-native";
import { Container, Header, Title, Icon, Body, Left, Button, Right } from 'native-base';

import FeedFabButton from "./FeedFabButton";
import FeedPageHeaderFilterButtons from "./FeedPageHeaderFilterButtons";
import styles from "./styles";
import * as constants from '../../Utils/Constants';

const FeedView = (props) => {
  return (
    <Container style={styles.container}>
      {(props.curScreen == constants.ASSET_HISTORY_SCREEN || props.curScreen == constants.DASHBOARD_SCREEN) ? null :
        <Header style={styles.headerColour}>
          <Left style={{ flex: 1 }}><Icon active name="menu" onPress={() => props.navigation.toggleDrawer()} />
          </Left>
          <Body style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Title style={styles.defaultText}>FEEDS</Title></Body>
          <Right><Button transparent></Button></Right>
        </Header>}
      <Body style={styles.feedBody}>
        <View style={styles.filterBtnGroup}>
          <FeedPageHeaderFilterButtons currentScreen = { props.curScreen } onFilterButtonClick={props.onFilterButtonClick}
            filterBtnStatus={props.filterBtnStatus} filterBtnDisabledStatus={props.filterBtnDisabledStatus}
            loadNewEvents={props.loadNewEvents} isNewEventsAvail={props.isNewEventsAvailable} countOfAE={props.countOfAE}
            countOfUE={props.countOfUE} countOfT={props.countOfT} />
        </View>
        {/* <Spinner color='blue' /> */}
        <View style={{ flex: 1, width: Dimensions.get('window').width }}>
          {(props.label == null) ?
            <FlatList data={props.filterDataAccordingTocurScreen(props.events)}
              keyExtractor={(item, index) => index + '_' + item.eventId + item.ticketId}
              onEndReached={props.handleLoadMore}
              removeClippedSubviews={true}
              renderItem={props.renderItem}
              onContentSizeChange={props.onContentSizeChange}
              scrollEnabled={true}
              maxToRenderPerBatch={1}
              initialNumToRender={5}
              refreshing={true}
              onEndReachedThreshold={10}
              ListEmptyComponent={props.isEventLoadingComplete ? <Text>No Feeds</Text> : <Text>Loading..</Text>}
              ListFooterComponent={props.isEventLoadingComplete ? null : props.renderFooter}
              windowSize={5}
            /> : <Text style={{ textAlign: "center" }}>{props.label}</Text>}
        </View>
      </Body>
      <FeedFabButton saveUserEventCallback={props.saveUserEventCallback} userId={props.userId} />
    </Container>
  )
}

export default FeedView
