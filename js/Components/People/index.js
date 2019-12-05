import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Container, Header, Title, Content, Text, Button, Icon, Left, Body, Right } from "native-base";
import { FlatList, AppState } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import * as userActions from '../../Actions/UserActions';
import * as loginActions from '../../Actions/LoginActions';
import PeopleListItem from "./PeopleListItem";
import ForceUpgrade from '../GenericComponents/ForceUpgrade';

class People extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      refreshing: false,
      limit: 8,
      page: 1,
      status: false,
      label: null,
      showUpgradeWindow:true,
      appState: AppState.currentState,
    }
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  static navigationOptions = {
    header: null
  };

  _handleAppStateChange = ( nextAppState ) => {
    console.log('App changed!' + this.state.appState);
    if ( this.state.appState.match(/inactive|background/) && nextAppState === 'active' ) {
      console.log('\nApp has come to the foreground!');
      this.setState( { showUpgradeWindow : true } )
      this.props.loginActions.checkForAppUpgradation();
    }
    this.setState({appState: nextAppState});
  };

  updateLaterHandler = () =>  {
    console.log('Later button clicked       -       -         -           -' )
    this.setState( { showUpgradeWindow : false } )
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
    NetInfo.isConnected.fetch().done(
      (isConnected) => {
        this.setState({ status: isConnected });
        if (isConnected) {
          this.fetchRemoteData();
        } else if (!isConnected && this.props.users.length == 0) {
          this.setState({ label: "Please Verify your Internet Connection!" });
        }
      }
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
  }

  handleConnectionChange = (isConnected) => {
    this.setState({ status: isConnected });
  }

  fetchRemoteData = () => {
    this.props.userActions.fetchRemoteUsersFromApi(this.props.userAuth.customerId, this.state.page, this.state.limit);
  }

  handleListEmpty = () => {
    return <Text>No Users</Text>;
  }

  handleRefresh = () => {
    this.setState({
      page: 1,
      refreshing: true,
      seed: this.state.seed + 1,
    }, () => {
      this.fetchRemoteData();
    });
  }

  handleLoadMore = () => {
    this.setState({
      page: this.state.page + 1,
    }, () => {
      this.fetchRemoteData();
    });
  }

  renderItem = ({ item }) => {
    return <PeopleListItem key={item.id} user={item} />
  }

  render() {
    return (
      <Container style={{ backgroundColor: "#ffffff" }}>
        <Header style={{ backgroundColor: '#FBFAFA' }}>
          <Left style={{ flex: 1 }}><Icon active name="ios-menu" onPress={() => this.props.navigation.toggleDrawer()} /></Left>
          <Body style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Title style={{ color: 'black' }}>PEOPLE</Title></Body>
          <Right><Button transparent></Button></Right>
        </Header>
        {
        this.props.appUpgradationStatus.forceUpgrade  
        ?  <ForceUpgrade forceUpgrade = { true } />
        :  this.props.appUpgradationStatus.laterUpgrade  && this.state.showUpgradeWindow
        ?  <ForceUpgrade forceUpgrade = { false } updateLaterHandler = { this.updateLaterHandler }/>
        :
          <Content padder style={{ marginBottom: 20 }}>
          {
            (this.state.label == null) ?
              <FlatList data={this.props.users}
                keyExtractor={(item, index) => index + '_' + item.id}
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
                onEndReached={this.handleLoadMore}
                onEndThreshold={50}
                removeClippedSubviews={false}
                renderItem={this.renderItem}
                extraData={this.state}
                initialNumToRender={5}
                ListEmptyComponent={this.handleListEmpty}
                ListFooterComponent={this.renderFooter}
                windowSize={5} /> : <Text style={{ textAlign: "center" }} note>{this.state.label}</Text>
          }
        </Content>
      }
      </Container>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    users: state.userReducer,
    userAuth: state.loginReducer,
    appUpgradationStatus: state.appUpgradationStatus
  }
};

function mapDispatchToProps(dispatch) {

  return {
    userActions: bindActionCreators(userActions, dispatch),
    loginActions: bindActionCreators(loginActions, dispatch)
  };
};

People = connect(mapStateToProps, mapDispatchToProps)(People);

export default People;
