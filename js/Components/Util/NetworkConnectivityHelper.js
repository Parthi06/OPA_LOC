import { Component } from 'react';
import { NetInfo } from "react-native";
class NetworkConnectivityHelper extends Component {

    constructor(props) {
        super(props);
    }
    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
    }
    handleConnectionChange = (isConnected) => {
        if (!isConnected) {
            this.props.navigation.navigate({ routeName: 'NetworkErrorPage', params: {}, key: 'NetworkErrorPage' })
        } else {
            this.props.navigation.navigate({ routeName: 'FeedWithDrawNav', params: {}, key: 'FeedWithDrawNavPage' })
        }
    }
    componentWillUnmount = () => {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
    }

    render() {
        return (
            null
        );
    }
}
export default NetworkConnectivityHelper;
