import React, { Component } from "react";
import LoginRouter from "./Routers/LoginRouter";
import MainStackRouter from "./Routers/MainStackRouter";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as loginActions from './Actions/LoginActions';
import * as db from './database/databaseActions';
import UserLicenseAgreement from "../js/Components/UserLicenseAgreement";
import * as assetActions from './Actions/AssetActions';
import * as constants from './Utils/Bugsnag';
import fetchIntercept from 'fetch-intercept';

const bugsnag = constants.runBugsNag();
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      readyToLoad: true,
      isUserLicenseAgreed: false,
      logo: "",
      customerId: null
    };
  }

  componentWillMount() {
    this.loadInitialUser();
  }

  loadInitialUser() {
    db.getLoginInfo().then((loginInfo) => {
      if (loginInfo[0] && loginInfo[0].userId != null && loginInfo[0].customerId != null) {
        // fetchIntercept.register({
        //   request: function (url, config) {
        //     if (config && config.method) {
        //       if ((config.method == "POST" || config.method == "GET") && !url.includes("users/authentication")) {
        //         config.headers = new Headers({
        //           'Content-Type': 'application/json',
        //           'Authorization': loginInfo[0].token
        //         });
        //       }
        //     }
        //     return [url, config];
        //   }
        // })
        bugsnag.setUser(loginInfo[0].userId.toString(), loginInfo[0].firstName + " " + loginInfo[0].lastName, loginInfo[0].customerDomain);
        this.props.loginActions.loadLoginResponse(loginInfo[0]);
        this.props.loginActions.login(true);
        // this.props.assetActions.loadAllAssetsFromApi(loginInfo[0].customerId);
        this.setState({ isUserLicenseAgreed: loginInfo[0].isUserLicenseAgreed, logo: loginInfo[0].logo })
      }
    }).catch((error) => { console.log("loadInitialUser couldnt retrieve data", error) });
  }

  componentWillReceiveProps(nextProps) {
    // if ((this.state.isUserLicenseAgreed !== nextProps.loginResponse.isUserLicenseAgreed) && (typeof nextProps.loginResponse.isUserLicenseAgreed != 'undefined')) {
    //   // this.props.loginActions.loadLoginResponse(nextProps.loginResponse);
    //   // this.props.loginActions.login(true);
    //   this.setState({ isUserLicenseAgreed: nextProps.loginResponse.isUserLicenseAgreed, companyLogoURL: nextProps.loginResponse.companyLogoURL })
    // }
    var ptr = this;
    if (!nextProps.loginResponse.token)
      return;
    fetchIntercept.register({
      request: function (url, config) {
        if (config && config.method) {
          if ((config.method == "POST" || config.method == "GET") &&
                !url.includes("users/authentication") && 
                !url.includes("users/loginAuthentication")  &&  
                !url.includes("users/updateVersion"))
            {
            config.headers = new Headers({
              'Content-Type': 'application/json',
              'Authorization': nextProps.loginResponse.token
              // 'Authorization': 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImp0aSI6Im9uY2VsYWJzIiwiZXhwIjoxNTQ2NTk0MjkzfQ.2qjnJGKiY3jM_4ucxn-V0w2uPCAMEJ94LGuz7blPCFbOedZTvPiJc3xEbqFIMUUvWJMNcvdydXva8y7d2tgmCA'
            });
          }
        }
        return [url, config];
      },
      response: function (response) {
        if (JSON.stringify(response).includes("JWT Expired")) {
          ptr.props.loginActions.logout(false);
          ptr.props.loginActions.updateLoginResponse(false);
          ptr.props.loginActions.updateTokenExpireStatus(true);
          db.removeLoginInfo().then().catch((error) => console.log("Couldnt remove login info from db" + error));
        }
        return response;
      }
    })
    this.setState({ isUserLicenseAgreed: nextProps.loginResponse.isUserLicenseAgreed, logo: nextProps.loginResponse.logo, customerId: nextProps.loginResponse.customerId })
  }

  render() {
    return this.props.loginflag
      ? this.state.isUserLicenseAgreed ? <MainStackRouter /> :
        <UserLicenseAgreement logo={this.props.loginResponse.logo} customerId={this.state.customerId} />
      :
      <LoginRouter />;
  }
}

function mapStateToProps(state, ownProps) {
  return {
    loginflag: state.userLogin,
    loginResponse: state.loginReducer
  }
};

function mapDispatchToProps(dispatch) {
  return {
    loginActions: bindActionCreators(loginActions, dispatch),
    assetActions: bindActionCreators(assetActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
