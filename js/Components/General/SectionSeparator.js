import React, { Component } from "react";
import {Row} from 'react-native-easy-grid';
import {Text} from "native-base";
import {View} from 'react-native';

const SectionSeparator = ({sectionHeader,index}) =>
(
  <Row key={index} style={{ paddingTop: 10, flexDirection: 'row', paddingBottom: 5 }}>
    <View style={{ alignItems: 'flex-start', borderBottomColor: '#9f9fa0', borderBottomWidth: 1, flex: 1 }}></View>
    <View style={{ alignItems: 'flex-start' }}><Text style={{ fontSize: 13, fontWeight: "bold" }}>{"  " + sectionHeader}</Text></View>
  </Row>
)

export default SectionSeparator;

