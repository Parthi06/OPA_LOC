import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, AppState } from 'react-native';
import SettingsList from 'react-native-settings-list';
import { Container, Header, Title, Button, Icon, Left, Right, Body } from "native-base";
import ForceUpgrade from '../GenericComponents/ForceUpgrade';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as loginActions from '../../Actions/LoginActions';

class Settings extends Component {
    constructor(props) {
        super(props);
        this.onValueChange = this.onValueChange.bind(this);
        this.state = { 
            switchValue: false, 
            loggedIn: false,
            showUpgradeWindow:true,
            appState: AppState.currentState
        };
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    //App foreground-background change handler
  _handleAppStateChange = ( nextAppState ) => {
    console.log('App changed!' + this.state.appState);
    if ( this.state.appState.match(/inactive|background/) && nextAppState === 'active' ) {
      console.log('\nApp has come to the foreground!');
      this.setState( { showUpgradeWindow : true } )
      this.props.loginActions.checkForAppUpgradation();
    }
    this.setState( { appState : nextAppState } );
  };


  updateLaterHandler = () =>  {
        console.log('Later button clicked - -       -           -       -' )
        this.setState( { showUpgradeWindow: false } )
  }

    render() {
        return (
        
            <Container style={{ backgroundColor: '#ffffff', flex: 1 }}>
                <Header style={{ backgroundColor: '#ffffff' }}>
                    <Left style={{ flex: 1 }}><Icon active name="ios-menu" onPress={() => this.props.navigation.toggleDrawer()} /></Left>
                    <Body style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Title style={{ color: 'black' }}>SETTINGS</Title></Body>
                    <Right><Button transparent></Button></Right>
                </Header>
                {
                    this.props.appUpgradationStatus.forceUpgrade  
                    ?  <ForceUpgrade forceUpgrade = { true } />
                    :  this.props.appUpgradationStatus.laterUpgrade  && this.state.showUpgradeWindow
                    ?  <ForceUpgrade forceUpgrade = { false } updateLaterHandler = { this.updateLaterHandler }/>
                    :
                <View style={{ backgroundColor: '#EFEFF4', flex: 1 }}>
                    {/* <View style={{ borderBottomWidth: 1, backgroundColor: '#f7f7f8', borderColor: '#c8c7cc' }}>
                        <Text style={{ alignSelf: 'center', marginTop: 30, marginBottom: 10, fontWeight: 'bold', fontSize: 16 }}>Settings</Text>
                    </View> */}
                    <View style={{ backgroundColor: '#EFEFF4', flex: 1 }}>
                        <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
                            <SettingsList.Header headerStyle={{ marginTop: 15 }} />
                            <SettingsList.Item
                                icon={<Image style={styles.imageStyle} source={require('./Images/general.png')} />}
                                title='Change Password'
                                onPress={() => this.props.navigation.navigate({ routeName: 'ChangePasswordPage', params: {}, key: 'ChangePasswordPage' })}
                            />
                        </SettingsList>
                    </View>
                </View>}
            </Container>
        );
    }
    toggleAuthView() {
        this.setState({ toggleAuthView: !this.state.toggleAuthView });
    }
    onValueChange(value) {
        this.setState({ switchValue: value });
    }
}

const styles = StyleSheet.create({
    imageStyle: {
        marginLeft: 15,
        alignSelf: 'center',
        height: 30,
        width: 30
    },
    titleInfoStyle: {
        fontSize: 16,
        color: '#8e8e93'
    }
});

//export default Settings;
function mapStateToProps(state, ownProps) {
    return {
      appUpgradationStatus: state.appUpgradationStatus
    }
  };
  
function mapDispatchToProps(dispatch) {
    return {
      loginActions: bindActionCreators(loginActions, dispatch)
    };
};
  
Settings = connect(mapStateToProps, mapDispatchToProps)(Settings);
  
export default Settings;
  