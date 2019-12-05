import React from "react";
import { TouchableOpacity, Image } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Text, Container, List, ListItem, Content, Footer, FooterTab, Header } from "native-base";
import * as loginActions from '../../Actions/LoginActions';
import * as db from '../../database/databaseActions';
let background = require("../Login/Images/vie_logo.png");

const routes = ["DASHBOARD", "FEEDS", "ASSETS", "PEOPLE", "SETTINGS", "HELP & SUPPORT", "LOGOUT"];
class DrawBar extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      status: false
    }
    this.logOutCallback = this.logOutCallback.bind(this);
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
    NetInfo.isConnected.fetch().done(
      (isConnected) => { this.setState({ status: isConnected }); }
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
  }

  handleConnectionChange = (isConnected) => {
    this.setState({ status: isConnected });
  }

  logOutCallback(data) {
    if (data == "LOGOUT") {
      if (this.state.status) {
        this.props.loginActions.logout(false);
        this.props.loginActions.updateLoginResponse(false);
        db.removeLoginInfo().then().catch((error) => console.log("Couldnt remove login info from db" + error));
        // AsyncStorage.removeItem("userIdStore");
        // AsyncStorage.removeItem("customerIdStore");
      } else {
        alert("Please Verify your Internet Connection!");
      }
    } else {
      this.props.navigation.navigate(data);
    }
  }
  render() {
    return (
      <Container>
        <Content>
          <Header style={{ height: 100, backgroundColor: "white", paddingTop: 15 }}>
            <Image style={{
              height: 75,
              flex: 1,
              width: 150
            }} resizeMode="contain" source={background} />
          </Header>
          <TouchableOpacity style={{ height: 120, alignSelf: "stretch", justifyContent: "center", alignItems: "center" }}
            onPress={() => this.props.navigation.navigate("DrawerClose")} />
          <List
            dataArray={routes}
            renderRow={data => {
              return (
                <ListItem onPress={() => this.logOutCallback(data)} >
                  <Text>{data}</Text>
                </ListItem>
              );
            }}
          />
        </Content>
        <Footer style={{ height: 150, backgroundColor: "white" }}>
          <Image style={{
            height: 75,
            flex: 1,
            width: 150
          }} resizeMode="contain" source={{ uri: this.props.loginResponse.logo }} />
        </Footer>
      </Container>
    );
  }
}
function mapStateToProps(state, ownProps) {
  return {
    loginflag: state.userLogin,
    loginResponse: state.loginReducer,
  }
};

function mapDispatchToProps(dispatch) {

  return {
    loginActions: bindActionCreators(loginActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawBar);
