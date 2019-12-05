import React, { Component } from 'react'
import { View, Switch, StyleSheet, Text } from 'react-native'

export default ToggleButton = (props) => {
   return (
      <View style = {styles.container}>
        <Text  style={styles.stateColor}>{props.stateOne}</Text>
            <Switch trackColor={{true: 'blue', false:'#000000' }}
            style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.1 }] }}
            onValueChange = { props.toggleSwitch }
            thumbTintColor=  {props.toggleStatus ?'#32CD32':'#D3D3D3'}
            value = { props.toggleStatus }
            disabled = {props.toggleStatus ?true:false}
         />
        <Text style={styles.stateColor}>  { props.stateTwo  }  </Text>
        </View>
     )
}
const styles = StyleSheet.create ({
   container: {
      flex: 1,     
      flexDirection:'row'
   },
   title:{
        fontWeight:"bold",
        color: '#000000'
   }, subcontainer: {
        flex: 2,     
    },stateColor:{
        fontSize:17,
        paddingLeft:2,
        paddingRight:2
    }
})