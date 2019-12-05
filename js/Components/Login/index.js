import React, { Component } from "react";
import { Image, TextInput, Dimensions,AppState } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Container, Content, Button, View, Text } from "native-base";
import styles from "./styles";
import * as loginActions from '../../Actions/LoginActions';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import ForceUpgrade from '../GenericComponents/ForceUpgrade';

let background = require("./Images/shadow.png");
const deviceWidth = Dimensions.get('window').width;
// background = "data:image/png;base64,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";
class Login extends Component {

  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",//"rahul@oncelabs.com",
      password: "", //"oncelabs",
      custDomain: "",//"oncelabs",
      label: "",
      signInBtnLabel: "Sign In",
      showUpgradeWindow:true,
      appState: AppState.currentState,

    };
    this.sendUserCredentialsToServer = this.sendUserCredentialsToServer.bind(this);
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentDidMount() {
    this.props.loginActions.checkForAppUpgradation();
  }

  _handleAppStateChange = ( nextAppState ) => {
    console.log('App changed!' + this.state.appState);
    if ( this.state.appState.match(/inactive|background/) && nextAppState === 'active' ) {
      console.log('\nApp has come to the foreground!');
      this.setState({
        showUpgradeWindow: true
      })
      this.props.loginActions.checkForAppUpgradation();
    }
    this.setState({appState: nextAppState});
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.tokenExpireStatus) {
      this.setState({ label: "Session Expired" });
    }

    if (nextProps.loginError) {
      this.setState({ label: "Network problem - Please retry.", signInBtnLabel: "Sign In" });
      this.props.loginActions.authenticationHasError(false);
    } else if (nextProps.loginResponse != null && nextProps.loginResponse.authFlag != undefined && nextProps.loginResponse.errorMessage != undefined) {
      if (nextProps.loginError) {
        this.setState({ label: "Network problem - Please retry.", signInBtnLabel: "Sign In" });
        // this.props.loginActions.authenticationHasError(false);
      } else if (!nextProps.loginResponse.authFlag && nextProps.loginResponse.errorMessage == "FAILED") {
        this.setState({ label: "Invalid Credentials!!", signInBtnLabel: "Sign In" });
      } else if (nextProps.loginResponse.authFlag && nextProps.loginResponse.errorMessage == "SUCCESS") {
        this.props.loginActions.login(true);
      }
    }
  }

  sendUserCredentialsToServer() {
    let username = this.state.email.trim();
    let password = this.state.password.trim();
    let custDomain = this.state.custDomain.trim();
    // username = "admin";
    // password = "oncelabs";
    // custDomain = "oncelabs";
    // custDomain = "oncelabs-prod";
    if (this.validateUserCredentials(username, password, custDomain)) {
      this.setState({ signInBtnLabel: "Signing In.." });
      this.props.loginActions.verifyAuthenticationFromApi(username, password, custDomain);
    }
  }

  /*Client side validation for username and password*/
  validateUserCredentials(username, password, custDomain) {
    var msgToUser = "";
    var isValidUser = true;
    if (username == "" || password == "") {
      msgToUser = "Username/Password is empty";
      isValidUser = false;
    }
    else if (custDomain == "") {
      msgToUser = "Customer is empty";
      isValidUser = false;
    }
    // else if (username.indexOf("@") < 0)//TODO change to Regex
    // {
    //   msgToUser = "Please enter a valid email address.";
    //   isValidUser = false;
    // }
    this.setState({ label: msgToUser });
    return isValidUser;
  }

  updateLaterHandler = () =>  {
    console.log('Later button clicked - ' + this.state.showUpgradeWindow)
      this.setState({
        showUpgradeWindow: !this.state.showUpgradeWindow
      })
      this.props.loginActions.checkForAppUpgradation();
  }

  render() {
    return (
     <Container>
     {
      this.props.appUpgradationStatus.forceUpgrade  
        ?  <ForceUpgrade forceUpgrade = { true } />
        :  this.props.appUpgradationStatus.laterUpgrade  && this.state.showUpgradeWindow
        ?  <ForceUpgrade forceUpgrade = { false } updateLaterHandler = { this.updateLaterHandler }/>
        :
          <Content style={{ backgroundColor: "white" }}>
              <View style={styles.shadow}>
          {/* <Image style={{
          width: 300, height: 200
        }} resizeMode="contain" source={{ uri: background }} /> */}
          <Image style={{
            width: 300, height: 300
          }} resizeMode="contain" source={background} />
        </View>
        <Text style={{ textAlign: 'center' }}>{this.state.label}</Text>
        <View style={styles.TextInput}>
          <FaIcon name="user" size={20} />
          <TextInput
            name="email"
            style={{ width: deviceWidth / 2.2 }}
            underlineColorAndroid={'#000000'}
            placeholder="Username"
            autoCapitalize="none"
            onChangeText={(text) => this.setState({ email: text })} 
            class="uName" />
        </View>
        <View style={styles.TextInput}>
          <FaIcon name="lock" size={20} />
          <TextInput
            placeholder="Password"
            style={{ width: deviceWidth / 2.2 }}
            underlineColorAndroid={'#000000'}
            secureTextEntry={true}
            autoCapitalize="none"
            onChangeText={(text) => this.setState({ password: text })} 
            class="pWord"/>
        </View>
        <View style={styles.TextInput}>
          <FaIcon name="building" size={20} />
          <TextInput
            placeholder="Customer"
            style={{ width: deviceWidth / 2.2 }}
            underlineColorAndroid={'#000000'}
            autoCapitalize="none"
            onChangeText={(text) => this.setState({ custDomain: text })} 
            class="cName"/>
        </View>
        <Button 
          style={styles.btn}
          onPress={() => this.sendUserCredentialsToServer()}
        >
          <Text 
            style={{ fontSize: 18, padding:10 }}
            accessible= {true}
            accessibilityLabel="SignInBtnText"
          >{this.state.signInBtnLabel}</Text>
        </Button>
      </Content> 
      }    
      </Container>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    loginResponse: state.loginReducer,
    loginError: state.loginError,
    tokenExpireStatus: state.tokenExpireStatus,
    appUpgradationStatus:state.appUpgradationStatus
  }
};

function mapDispatchToProps(dispatch) {
  return {
    loginActions: bindActionCreators(loginActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);


