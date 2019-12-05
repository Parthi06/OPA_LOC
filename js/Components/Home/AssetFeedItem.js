import React from 'react';
import { Thumbnail, Text } from 'native-base';
import { View, TouchableOpacity } from 'react-native';
import styles from "./styles";
import FeedFooter from "./FeedFooter";
import * as AppUtils from '../../Utils/AppUtils';
import * as constants from '../../Utils/Constants';

function AssetFeedItem({ feed, users, ticketCreatedSuccess, navigation, latestEventDatetime, isNewEventsAvailable, saveCommentCallback, saveFollowCallback, saveTicketCallback, neededAsset, customerType, curScreen }) {
  var prognosis = (feed.prognosisDetails1 != null) ? feed.prognosisDetails1.replace("Possibilities:", "") : null;
  return (

    < View style={styles.eventContainer} >
      <View style={styles.eventBody}>
        <View style={styles.row}>
          <View style={{ flex: 1, paddingLeft: 10, flexDirection: 'row' }}>
            <Thumbnail style={{ height: 30, width: 30 }} small
              source=
            {         
              (feed.prognosisSummary1 == "Checkup")     ?
              (
                    (feed.prognosisDetails1 != undefined) ?      
                        (
                          feed.prognosisDetails1.toUpperCase().includes("CALIBRATING")  ?
                          require("../AssetList/Images/calibrating-checkup-lg.png")  :
                          require("../AssetList/Images/checkupAsset.png") 
                        )
                       :
                          require("../AssetList/Images/checkupAsset.png") 
              ) :
              (feed.prognosisSummary1 == "Urgent_Attention") ?
              (
                    (feed.prognosisDetails1 != undefined) ? 
                    (
                      feed.prognosisDetails1.toUpperCase().includes("CALIBRATING")  ?
                            require("../AssetList/Images/calibrating-urgent-lg.png")  :
                            require("../AssetList/Images/emergencyAsset.png") 
                    ) :
                    require("../AssetList/Images/emergencyAsset.png")
               ):
              (feed.prognosisSummary1 == "Good") ?
              (
                      (feed.prognosisDetails1 != undefined) ? 
                      (
                        feed.prognosisDetails1.toUpperCase().includes("CALIBRATING")  ?
                          require("../AssetList/Images/calibrating-good-lg.png")  :  
                          require("../AssetList/Images/goodAsset.png") 
                      ) :
                      require("../AssetList/Images/goodAsset.png") 

                    
              )  
                      :(feed.prognosisSummary1 == "Unknown") ? 
                  (
                        (feed.prognosisDetails1 != undefined) ? 
                        (
                              feed.prognosisDetails1.toUpperCase().includes("CALIBRATING")  ?
                              require("../AssetList/Images/calibrating-unknown-lg.png")  :  
                              require("../AssetList/Images/Unknown.png") 
                        ) :
                        require("../AssetList/Images/Unknown.png") 
                  )
                      
                      
              : null
              
              /*
                (feed.prognosisSummary1 == "Checkup") ? require("../AssetList/Images/checkupAsset.png") :
                (feed.prognosisSummary1 == "Urgent_Attention") ? require("../AssetList/Images/emergencyAsset.png") :
                  (feed.prognosisSummary1 == "Good") ? require("../AssetList/Images/goodAsset.png") : null
                */
                
                
                
            }/>
            <TouchableOpacity style={{ paddingLeft: 10 }} onPress={() => (curScreen != constants.ASSET_HISTORY_SCREEN) ? navigation.navigate({ routeName: "AssetDetailsPage", params: { assetParam: neededAsset, feedParam:feed }, key: "AssetDetailsPageKey" }) : ''}>
    	      {
    	          (curScreen != constants.ASSET_HISTORY_SCREEN) ?
                  <Text style={{ textDecorationLine: "underline" }}>{feed.assetTag}</Text> :
    		  <Text>{feed.assetTag}</Text>
    	      }
              <Text>{isNewEventsAvailable}</Text>
              <Text note>{feed.assetType}</Text>
            </TouchableOpacity >
          </View>
          <View style={{ flex: 1 }}>
            <Text note style={{ textAlign: 'center', paddingLeft: 20 }}>{AppUtils.convertTimestampToDate(feed.eventCreatedDate)}</Text>
            <Text note style={{ textAlign: 'center', paddingLeft: 20 }}>{AppUtils.convertTimestampToTime(feed.eventCreatedDate)}</Text>
            {
              (feed.assetAddress != "NULL" && feed.assetAddress != null) ?
                <Text note style={{ textAlign: 'center', paddingLeft: 20 }}  >{feed.assetAddress}</Text> : null
            }
          </View>
        </View>
        <View style={{ paddingLeft: 10, paddingBottom: 10 }}>
          <Text>Prognosis: {
            (feed.prognosisDetails1 != undefined ) ? 
                    (  (feed.prognosisDetails1.toUpperCase().includes("CALIBRATING")) ? 
                        "Calibrating"  :  
                        feed.prognosisSummary1
                    ) :
                    feed.prognosisSummary1         
          }</Text>
          {(prognosis != null) ? <Text>{prognosis.trim()}</Text> : null}
        </View>
        <View style={{ flex: 1, borderColor: '#000000', borderTopWidth: 1.2 }}>
          <FeedFooter feed={feed} users={users} customerType={customerType} saveCommentCallback={saveCommentCallback} saveFollowCallback={saveFollowCallback} saveTicketCallback={saveTicketCallback} />
        </View>
      </View>
    </View >
  );
}

export default AssetFeedItem;
