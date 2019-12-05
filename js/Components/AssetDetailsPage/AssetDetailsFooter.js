import React from "react";
import {Text} from "react-native";
import {Footer,FooterTab,Button } from "native-base";
import { Icon } from 'react-native-elements'

const AssetDetailsFooter =({onAssetHistoryClick}) =>
{

  return (
     <Footer>
          <FooterTab style={{backgroundColor:'#ffffff'}}>
            <Button onPress ={onAssetHistoryClick}>
                 <Icon name='history' size={40}/>
                 <Text>History</Text>
             </Button>
           </FooterTab>
    </Footer>
  );
}

export default AssetDetailsFooter;
