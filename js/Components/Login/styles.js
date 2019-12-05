
const React = require('react-native');

const { StyleSheet, Dimensions } = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default {
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor:"'#ffffff'"
  },
  shadow: {
    flex: 2,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: null,
    height: null,
    paddingBottom:30
  },
  TextInput: {
    flex: 3,
    position: 'relative',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 0,
    width:null,
  },
  Field: {
    marginBottom: 30,
  },
  btn: {
    marginTop: 20,
    alignSelf: 'center',
    justifyContent:'center',
    width:deviceWidth/2.5,
    borderRadius:10
  }
};
