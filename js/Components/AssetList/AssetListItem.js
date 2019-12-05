import React from 'react';
import { Thumbnail } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { View, Text } from 'react-native';
import * as AppUtils from '../../Utils/AppUtils';

export default class AssetListItem extends React.PureComponent {
  render() {
    return (
      <View style={{ paddingLeft: 5, paddingRight: 5, paddingTop: 15, paddingBottom: 10 }}>
        <Grid style={{ borderColor: '#000000', borderWidth: 1.2, paddingTop: 5, paddingBottom: 10, backgroundColor: "#ffffff", elevation: 4, borderRadius: 8 }}
          onPress={() => this.props.navigation.navigate({ routeName: "AssetDetailsPage", params: { feedParam: this.props.asset }, key: "AssetDetailsPageKey" })}>
          <Col size={30}>
            <Row size={25} style={{ paddingLeft: 5 }}>
                <Col size={10}>
                <Thumbnail small source = {
                  (this.props.asset.prognosisSummary1 == "Checkup") ?
                  (
                        (this.props.asset.prognosisDetails1 != undefined) ?      
                            (
                              this.props.asset.prognosisDetails1.toUpperCase().includes("CALIBRATING")  ?
                              require("./Images/calibrating-checkup-lg.png")  :
                              require("./Images/checkupAsset.png") 
                            )
                           :
                              require("./Images/checkupAsset.png") 
                  ) :
                  (this.props.asset.prognosisSummary1 == "Urgent_Attention") ?
                  (
                        (this.props.asset.prognosisDetails1 != undefined) ? 
                        (
                                this.props.asset.prognosisDetails1.toUpperCase().includes("CALIBRATING")  ?
                                require("./Images/calibrating-urgent-lg.png")  :
                                require("./Images/emergencyAsset.png") 
                        ) :
                        require("./Images/emergencyAsset.png")
                   ):
                   (this.props.asset.prognosisSummary1 == "Good") ?
                   (
                          (this.props.asset.prognosisDetails1 != undefined) ? 
                          (
                            this.props.asset.prognosisDetails1.toUpperCase().includes("CALIBRATING")  ?
                              require("./Images/calibrating-good-lg.png")  :  
                              require("./Images/goodAsset.png") 
                          ) :
                          require("./Images/goodAsset.png") 
                  ): (this.props.asset.prognosisSummary1 == "Unknown") ? 
                  (
                        (this.props.asset.prognosisDetails1 != undefined) ? 
                        (
                          this.props.asset.prognosisDetails1.toUpperCase().includes("CALIBRATING")  ?
                              require("./Images/calibrating-unknown-lg.png")  :  
                              require("./Images/Unknown.png") 
                        ) :
                        require("./Images/Unknown.png") 
                  ) : null
                 }
                />
                </Col>
              <Col size={30}>
                <Text>{this.props.asset.assetTag}</Text>
                <Text note>{this.props.asset.assetType}</Text>
              </Col>
              <Col size={20}>
                <Text note>{AppUtils.convertTimestampToDateTime(this.props.asset.checkupTime)}</Text>
                <Text note>{this.props.asset.assetAddress == "NULL" ? "Location not available" : this.props.asset.assetAddress}</Text>
              </Col>
            </Row>
          </Col>
        </Grid>
      </View>
    );
  }
}

