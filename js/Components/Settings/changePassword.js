import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Container, Text, Button, Content, View } from "native-base";
import * as userActions from '../../Actions/UserActions';
import * as loginActions from '../../Actions/LoginActions';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import { TextInput, Dimensions } from "react-native";
import styles from "./styles";
const deviceWidth = Dimensions.get('window').width;

class ChangePassword extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            oldPassword: "",
            newPassword: "",//"rahul@oncelabs.com",
            confirmNewPassword: "",//"rahul@oncelabs.com",
            usedId: "", //"oncelabs",
            signInBtnLabel: "Submit"
        }
        this.sendUserCredentialsToServer = this.sendUserCredentialsToServer.bind(this);
    }

    sendUserCredentialsToServer() {
        let oldPassword = this.state.oldPassword.trim();
        let newPassword = this.state.newPassword.trim();
        let confirmNewPassword = this.state.confirmNewPassword.trim();
        // oldPassword = "oncelabs";
        // newPassword = "oncelabs1";
        // confirmNewPassword = "oncelabs1";
        let userId = this.props.userAuth.userId;
        if (this.validateUserCredentials(oldPassword, newPassword, confirmNewPassword)) {
            this.setState({ signInBtnLabel: "Changing Password..." });
            this.props.loginActions.changePassword(oldPassword, newPassword, userId);
        }
    }

    /*Client side validation for username and password*/
    validateUserCredentials(oldPassword, newPassword, confirmNewPassword) {
        var msgToUser = "";
        var isValidUser = true;
        if (oldPassword == "") {
            msgToUser = "Old Password is empty";
            isValidUser = false;
        } else if (oldPassword == newPassword) {
            msgToUser = "Old and New passwords must be different";
            isValidUser = false;
        }
        else if (newPassword == "" || confirmNewPassword == "") {
            msgToUser = "Please Enter New Passwords";
            isValidUser = false;
        }
        else if (newPassword != confirmNewPassword) {
            msgToUser = "New Passwords do not match";
            isValidUser = false;
        }
        this.setState({ label: msgToUser });
        return isValidUser;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.changePassword.userId == 0) {
            this.setState({ label: "Incorrect password!!", signInBtnLabel: "Submit" });
        } else {
            this.setState({ label: "Password Changed Succesfully", signInBtnLabel: "Submit" });
            this.props.loginActions.logoutOnChangePassword();
            this.props.loginActions.logout(false);
            this.props.loginActions.updateLoginResponse(false);
        }
    }

    render() {
        return (
            <Container style={{ backgroundColor: "#ffffff" }}>
                <Container>
                    <Content style={{ backgroundColor: "white", marginTop: 15 }}>
                        <Text style={{ textAlign: 'center' }}>{this.state.label}</Text>
                        <View style={styles.TextInput}>
                            <FaIcon name="lock" size={20} />
                            <TextInput
                                name="email"
                                style={{ width: deviceWidth / 1.5 }}
                                underlineColorAndroid={'#000000'}
                                placeholder="Old Password"
                                secureTextEntry={true}
                                autoCapitalize="none"
                                onChangeText={(text) => this.setState({ oldPassword: text })} />
                        </View>
                        <View style={styles.TextInput}>
                            <FaIcon name="lock" size={20} />
                            <TextInput
                                placeholder="New Password"
                                style={{ width: deviceWidth / 1.5 }}
                                underlineColorAndroid={'#000000'}
                                secureTextEntry={true}
                                autoCapitalize="none"
                                onChangeText={(text) => this.setState({ newPassword: text })} />
                        </View>
                        <View style={styles.TextInput}>
                            <FaIcon name="lock" size={20} />
                            <TextInput
                                placeholder="Confirm New Password"
                                style={{ width: deviceWidth / 1.5 }}
                                underlineColorAndroid={'#000000'}
                                secureTextEntry={true}
                                autoCapitalize="none"
                                onChangeText={(text) => this.setState({ confirmNewPassword: text })} />
                        </View>
                        <Button style={styles.btn} onPress={() => this.sendUserCredentialsToServer()}>
                            <Text style={{ fontSize: 18 }}>{this.state.signInBtnLabel}</Text>
                        </Button>
                    </Content>
                </Container>
            </Container>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        userAuth: state.loginReducer,
        changePassword: state.changePassword,
        changePasswordError: state.changePasswordError
    }
};

function mapDispatchToProps(dispatch) {

    return {
        userActions: bindActionCreators(userActions, dispatch),
        loginActions: bindActionCreators(loginActions, dispatch)
    };
};

ChangePassword = connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
export default ChangePassword;
