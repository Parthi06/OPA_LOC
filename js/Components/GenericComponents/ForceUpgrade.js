import React, { Component } from 'react';
import { Text, View , TouchableOpacity, Linking, StyleSheet, ActivityIndicator } from 'react-native';
import * as appConstants from '../../Utils/AppConstants';

export default class ForceUpgrade extends Component {

 constructor(props, context) {
    super(props, context);
    this.state = {
      loaderComponent:false
    }

  }

  navigateToPlayStore = ()  => {
    Linking.openURL(appConstants.OPA_APP_URL).catch((error)  =>  {
      console.error( 'Error while navigating to playstore ' + error);
    })
  }
  
  updateLaterDisable = ()  => {
    this.setState({ loaderComponent : true }) 
    this.props.updateLaterHandler();
  }

  render() {
    return (
      <View style = { styles.mainLayoutStyle } >
          { this.state.loaderComponent 
            ? <ActivityIndicator size="small" color="#73C2FB" /> 
            : <Text style = { { fontSize:1, margin:1 } }> </Text> }
          <Text style = { { fontSize:18, margin:5 } }>{appConstants.NEW_APK_AVAILABLE}</Text>
          <Text style = { { fontSize:15 } }>{appConstants.PLEASE_UPGRADE}</Text>
          {
            ( !this.props.forceUpgrade ) 
            ?
              <View style = { { flexDirection:'row', paddingTop:5} }>
                  <TouchableOpacity onPress = { this.updateLaterDisable } 
                                      style = { styles.laterBtnStyle }>
                      <Text style = { styles.textStyle } > Later </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress = { this.navigateToPlayStore  }
                                      style = { styles.upgradeBtnStyle }>
                      <Text style = { styles.textStyle } >Upgrade</Text>
                  </TouchableOpacity>
              </View>
            : <TouchableOpacity onPress = { this.navigateToPlayStore } 
                                  style = { styles.upgradeBtnStyle }>
                      <Text style = { styles.textStyle }>    Upgrade    </Text>
              </TouchableOpacity>
          }  
      </View>
    );
  }
}


const styles = StyleSheet.create({
  mainLayoutStyle       :{  flex: 1, 
                            justifyContent: "center", 
                            alignItems: "center"
  },
  laterBtnStyle  :{  backgroundColor: '#73C2FB', 
                            paddingTop:15, 
                            paddingLeft: 28, 
                            paddingRight:28,
                            paddingBottom:15, 
                            margin:2
  },
  upgradeBtnStyle       :{  backgroundColor: '#73C2FB', 
                            paddingTop:15,
                            paddingLeft: 20, 
                            paddingRight:20,
                            paddingBottom:15, 
                            margin:2
  },
  textStyle              :{
                            color:'#FFFFFF'
  }  
});

//styles.textStyle
