import React from "react";
import { Text } from "native-base";
import { View, ScrollView } from 'react-native';
import * as AppUtils from '../../Utils/AppUtils';
import { Col, Row } from 'react-native-easy-grid';

function FeedbackHistory({ loadFeedbackHistory, faultEnums }) {
    let feedBackHistory = [];
    if (loadFeedbackHistory != null) {
        feedBackHistory = loadFeedbackHistory.map((item, index) => {
            return (
                <View key={index + Date.now()} style={{
                    flex: 1, flexDirection: "row", borderColor: '#000000',
                    borderBottomWidth: 0.4 
                }}>
                    <View key={index + Date.now()} style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13 }}>{AppUtils.convertTimestampToDateTime(item.checkupTime)}</Text>
                    </View>
                    <View key={index + Date.now()} style={{ flex: 2 }}>
                        {(item.checkupResult != null) ?
                            <Row size={20}>
                                <Col size={30}><Text style={{ fontSize: 13, fontWeight: "bold" }}>FEEDBACK</Text></Col>
                                <Col size={70}><Text style={{ fontSize: 12 }}>{((item.checkupResult === "MINOR_ISSUE_UNADDRESSED")?"MINOR_ISSUE_DIAGNOSED":
                                ((item.checkupResult === "MAJOR_ISSUE_UNADDRESSED")?"MAJOR_ISSUE_DIAGNOSED":item.checkupResult))}</Text></Col>
                            </Row> : null}
                        <Row size={20}>
                            <Col size={30}><Text style={{ fontSize: 13, fontWeight: "bold" }}>{(item.checkupResult == null) ? "FEEDBACK" : ""}</Text></Col>
                            <Col size={70}><Text style={{ fontSize: 12 }}>{faultEnums.map(faultEnumsItem => {
                                if (faultEnumsItem.id === item.checkupFaultDiagnosisEnum)
                                    return ((faultEnumsItem.majorCategory + " - " + faultEnumsItem.minorCategory) + ((faultEnumsItem.faultString == null || faultEnumsItem.faultString.trim() == "") ? "" : " - " + faultEnumsItem.faultString)).toUpperCase();
                            })}</Text></Col>
                        </Row>
                        {(item.notes != null && item.notes != '') ?
                            <Row size={20}>
                                <Col size={30}><Text style={{ fontSize: 13, fontWeight: "bold" }}>NOTES</Text></Col>
                                <Col size={70}><Text style={{ fontSize: 12 }}>{item.notes}</Text></Col>
                            </Row> : null}
                    </View>
                </View>
            );
        });
    }
    return (
        <View style={{ paddingTop: 10, paddingBottom: 10, flex: 1 }}>
            {/* <ScrollView> */}
            {(feedBackHistory == null) ? <Text note>No Feedback</Text> : feedBackHistory}
            {/* </ScrollView> */}
        </View>
    );
}

export default FeedbackHistory;
