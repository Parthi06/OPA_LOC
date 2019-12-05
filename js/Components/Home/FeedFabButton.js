import React, { Component } from "react";
import { Button, Icon } from "native-base";
import { Text, View } from 'react-native';
import styles from "./styles";
import NewEventFeed from "./NewEventFeed";

export default class FeedFabButton extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      isFabButtonActive: false,
      showNewEventFeed: false
    }
  }

  closeNewEventFeedModal = () => {
    this.setState({ showNewEventFeed: false });
  }

  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <View>
        <Button small style={styles.fabButton} onPress={() => this.setState({ isFabButtonActive: !this.state.isFabButtonActive })}>
          <Icon name="md-add" style={{ fontSize: 28 }} />
        </Button>
        {(this.state.isFabButtonActive) ?
          <Button small rounded style={styles.fabChildButton} onPress={() => this.setState({ showNewEventFeed: !this.state.showNewEventFeed })}>
            <Text style={{ color: '#ffffff' }}>Add feed</Text>
            <View>
              <NewEventFeed modalVisible={this.state.showNewEventFeed}
                closeModal={this.closeNewEventFeedModal}
                saveUserEventCallback={this.props.saveUserEventCallback}
                userId={this.props.userId} />
            </View>
          </Button> : null
        }
      </View>
    );
  }
}
