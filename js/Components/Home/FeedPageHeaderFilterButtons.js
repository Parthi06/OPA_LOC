import React from 'react';	
import { Text } from 'native-base';	
import { TouchableOpacity, View } from 'react-native';
import styles from "./styles"; 
import * as constants from '../../Utils/Constants';

// <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
// <View style={styles.IconBadge}>
//  <Text style={{color:'#FFFFFF'}}>1</Text>
// </View>
// </View>

// {props.onFilterButtonClick,isTicketFilterOn,props.filterBtnStatus,
//                                    props.filterBtnDisabledStatus,loadNewEvents,props.isNewEventsAvail,countOfAE}

const FeedPageHeaderFilterButtons = (props) => {
  //onPress={(props.isNewEventsAvail == false)?()=>props.onFilterButtonClick(2):loadNewEvents}
  //
  //
  //  <View style={(props.isNewEventsAvail == false)?[styles.iconBadge1]:[styles.iconBadge]}>
  //      <Text style={{color: 'white',fontSize:12}}>{countOfAE}</Text>
  // </View>
  // if(props.isNewEventsAvail == false)
  // alert(props.isNewEventsAvail);

  return (
    <View style={{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center'
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity style={(props.filterBtnStatus.ticket) ? [styles.btnDefault, styles.selectedBtn] : (props.filterBtnDisabledStatus.ticket) ? [styles.btnDefault, styles.disabledBtn] : [styles.btnDefault]} disabled={props.filterBtnDisabledStatus.ticket} onPress={(props.countOfT <= 0) ? () => props.onFilterButtonClick(1) : () => props.loadNewEvents(1)}>
          <Text style={(props.filterBtnStatus.ticket) ? [styles.defaultText, styles.selectedBtnText] : (props.filterBtnDisabledStatus.ticket) ? [styles.disabledBtnText] : [styles.defaultText]}>Ticket</Text>
        </TouchableOpacity>
        {
          (props.countOfT > 0) ?
            <View style={styles.iconBadge}>
              <Text style = { styles.notificationCountStyle } > </Text>
            </View> : null
        }
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity style={(props.filterBtnStatus.asset) ? [styles.btnDefault, styles.selectedBtn] : (props.filterBtnDisabledStatus.asset) ? [styles.btnDefault, styles.disabledBtn] : [styles.btnDefault]} disabled={props.filterBtnDisabledStatus.asset} onPress={(props.countOfAE <= 0) ? () => props.onFilterButtonClick(2) : () => props.loadNewEvents(2)}>
          <Text style={(props.filterBtnStatus.asset) ? [styles.defaultText, styles.selectedBtnText] : (props.filterBtnDisabledStatus.asset) ? [styles.disabledBtnText] : [styles.defaultText]}>Asset</Text>
        </TouchableOpacity>

        {
          (props.countOfAE > 0) ?
            <View style={styles.iconBadge}>
              <Text style = { styles.notificationCountStyle } > </Text>
            </View> : null
        }


      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity style={(props.currentScreen == constants.ASSET_HISTORY_SCREEN) ? [styles.btnDefault, styles.disabledBtn]:(props.filterBtnStatus.user) ? [styles.btnDefault, styles.selectedBtn] : (props.filterBtnDisabledStatus.user) ? [styles.btnDefault, styles.disabledBtn] : [styles.btnDefault]} disabled={props.filterBtnDisabledStatus.user || (props.currentScreen == constants.ASSET_HISTORY_SCREEN) } onPress={(props.countOfUE <= 0) ? () => props.onFilterButtonClick(3) : () => props.loadNewEvents(3)}>
          <Text style={(props.currentScreen == constants.ASSET_HISTORY_SCREEN) ? [styles.disabledBtnText] :(props.filterBtnStatus.user) ? [styles.defaultText, styles.selectedBtnText] : (props.filterBtnDisabledStatus.user) ? [styles.disabledBtnText] : [styles.defaultText]}>Users</Text>
        </TouchableOpacity>

        {
          (props.countOfUE > 0) ?
            <View style={styles.iconBadge}>
              <Text style = { styles.notificationCountStyle } > </Text>
            </View> : null
        }


      </View>
    
      <TouchableOpacity style={(props.filterBtnStatus.follow) ? [styles.btnDefault, styles.selectedBtn] : (props.filterBtnDisabledStatus.follow) ? [styles.btnDefault, styles.disabledBtn] : [styles.btnDefault]} disabled={props.filterBtnDisabledStatus.follow} onPress={() => props.onFilterButtonClick(4)}>
        <Text style={(props.filterBtnStatus.follow) ? [styles.defaultText, styles.selectedBtnText] : (props.filterBtnDisabledStatus.follow) ? [styles.disabledBtnText] : [styles.defaultText]}>Following</Text>
      </TouchableOpacity>
    </View>
  );
}

export default FeedPageHeaderFilterButtons;
