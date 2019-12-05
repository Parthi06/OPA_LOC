import React from 'react';
import { Text } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { View } from 'react-native';
import * as AppUtils from '../../Utils/AppUtils';
import * as constants from '../../Utils/Constants';
import ImageDecider from '../Util/ImageDecider';

function PeopleListItem({ user }) {
  return (
    <View style={{ paddingLeft: 5, paddingRight: 5, paddingTop: 10, paddingBottom: 10 }}>
      <Grid style={{ borderColor: '#000000', borderWidth: 1.2, paddingTop: 5, paddingBottom: 10, backgroundColor: "#ffffff", elevation: 4, borderRadius: 8 }}>
        <Col size={30}>
          <Row size={25} style={{ paddingLeft: 5 }}>
            <Col size={6}><ImageDecider uri={constants.SERVER_URL + "/profilepic/" + user.userId + ".jpg"} /></Col>
            <Col size={35}>
              <Text>{user.firstName + " " + user.lastName}</Text>
              {
                (user.firstName == "admin" || user.firstName == "support" || user.firstName == "system") ?
                  <Text note>{user.userType}</Text> : <Text ></Text>}
            </Col>
            <Col size={30}>
              {
                (user.lastActiveDatetime != null) ?
                  <Text note>{AppUtils.convertTimestampToDateTime(user.lastActiveDatetime)}</Text> : null
              }
              <Text note>{user.location}</Text>
            </Col>
          </Row>
        </Col>
      </Grid>
    </View>
  );
}

export default PeopleListItem;
