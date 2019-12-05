import React from 'react';
import { Text } from 'native-base';
import { View, FlatList, Dimensions } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import styles from "./styles";
const dimensions = parseInt(Dimensions.get('window').width / 100);
function AssetDetails({ assetDetails }) {
  return (
    <View style={styles.AssetViewDefault}>
      <Row size={20}>
        <Col><Text style={{ fontSize: 15, fontWeight: "bold" }}>ASSET</Text></Col>
        <Col><Text style={{ fontSize: 15 }}>{assetDetails.assetTag}</Text></Col>
      </Row>
      <Row size={20}>
        <Col><Text style={{ fontSize: 15, fontWeight: "bold" }}>TYPE</Text></Col>
        <Col><Text style={{ fontSize: 15 }}>{assetDetails.assetType}</Text></Col>
      </Row>
      <Row size={20}>
        <Col><Text style={{ fontSize: 15, fontWeight: "bold" }}>LOCATION</Text></Col>
        <Col><Text style={{ fontSize: 15 }}>{assetDetails.assetAddress}</Text></Col>
      </Row>
      <Row size={20}>
        <Col><Text style={{ fontSize: 15, fontWeight: "bold" }}>TICKETS</Text></Col>
        <Col>
          <FlatList
            data={ assetDetails.openTicketsId }
            renderItem={({ item }) => (
              <Text key={item} style={{ fontSize: 15, paddingRight: 5 }}>{"#" + item}</Text>
            )}
            keyExtractor={item => item}
            numColumns={dimensions} />
        </Col>
      </Row>
    </View>
  );
}

export default AssetDetails;
