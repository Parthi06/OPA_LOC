import React, { Component } from 'react';

import { View } from 'react-native';

export default class DashboardBar extends Component {
    constructor() {
        super();
        this.state = {
            Progress_Value: 0.00
        }
    }

    componentDidMount = () => {
        this.Start_Progress();
    }

    Start_Progress = () => {
        this.value = setInterval(() => {
            this.props.getEventById();
        }, 30000);
    }

    componentWillUnmount() {
        this.Stop_Progress();
    }
 
    Stop_Progress = () => {
        clearInterval(this.value);
    }

    Clear_Progress = () => {
        this.setState({ Progress_Value: 0.0 });
    }

    render() {
        return (
            <View style={{ flex: 1 }}></View>
        );
    }
}
