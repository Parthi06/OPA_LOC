import React, { Component } from 'react';
import { View, Text} from "react-native";
class NetworkError extends Component {
    render() {
        return (
            <View>
            <Text>Please Verify your Internet Connection!</Text>
            </View>
        );
    }
}
export default NetworkError;
