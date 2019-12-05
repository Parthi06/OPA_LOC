import React, { Component } from "react";
import { connect } from "react-redux";
import packageJson from '../../../version.json';
import { Container, Header, Title, Content, Text, Button, Icon, Left, Right, Body, Footer, FooterTab } from "native-base";
import ForceUpgrade from '../GenericComponents/ForceUpgrade';
import * as loginActions from '../../Actions/LoginActions';
import * as helpActions from '../../Actions/HelpActions';
import { AppState, View } from "react-native";
import { bindActionCreators } from "redux";
import Metrics from './Metrics';
import { Col, Row, Grid } from 'react-native-easy-grid';
// Help & Support section
class About extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      showUpgradeWindow: true,
      appState: AppState.currentState,
      isMetricsListDisplayed: false,
      icon: "arrow-down",
      dataArray: []
    }

    AppState.addEventListener('change', this._handleAppStateChange);
  }

  static navigationOptions = {
    header: null
  };

  //api call
  componentDidMount() {
    this.props.helpActions.loadGraphMetricsDetails();
  }

  //response from API can be customised
  componentWillReceiveProps(responseProps) {
    let metricsInfo = responseProps.loadMetricsDetailsReducer.metrics;
    const metricsInfoArray = metricsInfo.map(item => {
      const title = item.acronym + ' ( ' + item.expanded + ' ) ';
      const content = item.explanation;
      let eachObject = { title: title, content: content };
      return eachObject;
    })
    this.setState({ dataArray: metricsInfoArray });
  }

  //App foreground-background change handler
  _handleAppStateChange = (nextAppState) => {
    console.log('App changed!' + this.state.appState);
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('\nApp has come to the foreground!');
      this.setState({ showUpgradeWindow: true })
      this.props.loginActions.checkForAppUpgradation();
    }
    this.setState({ appState: nextAppState });
  };


  updateLaterHandler = () => {
    this.setState({ showUpgradeWindow: false })
  }


  displayMetricsList = () => {
    const isDisplayed = this.state.isMetricsListDisplayed;
    const ICON_NAME = !isDisplayed ? "arrow-up" : "arrow-down"
    this.setState({ isMetricsListDisplayed: !isDisplayed, icon: ICON_NAME })
  }

  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: '#FBFAFA' }}>
          <Left style={{ flex: 1 }}><Icon active name="ios-menu" onPress={() => this.props.navigation.toggleDrawer()} /></Left>
          <Body style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Title style={{ color: 'black', fontSize:16 }}>HELP & SUPPORT</Title></Body>
          <Right><Button transparent></Button></Right>
        </Header>
        {
          this.props.appUpgradationStatus.forceUpgrade
            ? <ForceUpgrade forceUpgrade={true} />
            : this.props.appUpgradationStatus.laterUpgrade && this.state.showUpgradeWindow
              ? <ForceUpgrade forceUpgrade={false} updateLaterHandler={this.updateLaterHandler} />
              : <Content padder>
                <Grid>
                  <Row size={20} style={{ padding: 15, borderBottomWidth: 1, borderColor: '#c8c7cc' }}>
                    <Col size={10}><Text style={{ fontWeight: "bold" }}>App version</Text></Col>
                    <Col size={10}><Text>{packageJson.version}</Text></Col>
                  </Row>
                  <Row size={20} style={{ padding: 15, borderBottomWidth: 1, borderColor: '#c8c7cc' }}>
                    <Col size={10}><Text style={{ fontWeight: "bold" }}>Metrics</Text></Col>
                    <Col size={10}><Icon name={this.state.icon} type='EvilIcons' onPress={() => this.displayMetricsList()} /></Col>
                  </Row>
                  {
                    this.state.isMetricsListDisplayed
                      ?
                      <Row size={20} style={{ padding: 10 }}>
                        <Metrics dataArray={this.state.dataArray} />
                      </Row>
                      :
                      <Text> </Text>
                  }
                </Grid>
              </Content>
        }
      </Container>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    appUpgradationStatus: state.appUpgradationStatus,
    loadMetricsDetailsReducer: state.loadMetricsDetailsReducer
  }
};

function mapDispatchToProps(dispatch) {
  return {
    loginActions: bindActionCreators(loginActions, dispatch),
    helpActions: bindActionCreators(helpActions, dispatch)
  };
};

About = connect(mapStateToProps, mapDispatchToProps)(About);

export default About;