import React, { Component } from 'react';
import * as constants from '../../Utils/Constants';
import FastImage from 'react-native-fast-image';

class ImageDecider extends Component {
  state = { showDefault: true, error: false };
  render() {
    var image = this.state.showDefault ? constants.SERVER_URL + "/profilepic/default.jpg" : (this.state.error ? constants.SERVER_URL + "/profilepic/default.jpg" : this.props.uri);
    return (
      <FastImage
        style={{ height: 30, width: 30 }}
        source={{
          uri: image,
          priority: FastImage.priority.normal,
        }}
        onLoadEnd={() => this.setState({ showDefault: false })}
        onError={() => this.setState({ error: true })}
      />
    );
  }
}
export default ImageDecider;
