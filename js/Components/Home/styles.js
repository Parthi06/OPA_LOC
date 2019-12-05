const React = require('react-native');
import { Dimensions } from 'react-native';
const { StyleSheet } = React;

const dimensions = Dimensions.get('window');
export default {
  container: {
    backgroundColor: '#ffffff',
    flexDirection: 'column'
  },
  feedBody: {
    flexDirection: 'column'
  },
  filterBtnGroup: {
    flex: 0.10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  feedContent: {
    flex: 0.85,
    width: dimensions.width
  },
  btnDefault: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingLeft: dimensions.width * 0.10 / 2.5,
    paddingRight: dimensions.width * 0.10 / 2.5,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#2d2d2d'
  },

  selectedBtn: {
    backgroundColor: '#7ec0ee',
    borderColor: '#ffffff'
  },

  disabledBtn: {
    borderColor: '#e0e0e0'
  },
  defaultText: {
    color: '#000000'
  },
  selectedBtnText: {
    color: '#ffffff'
  },
  disabledBtnText: {
    color: '#e0e0e0'
  },

  headerColour: {
    backgroundColor: '#FBFAFA'
  },
  fabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    position: 'absolute',
    bottom: 20,
    right: 20,
    height: 60,
    backgroundColor: '#cccccc',
    borderRadius: 100,
  },
  fabChildButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 25,
    right: 90,
    backgroundColor: '#cccccc',
  },
  assignModalView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  assignModalInnerView: {
    width: 300,
    height: 250,
    borderRadius: 10
  },
  assignedModalVisibleView: {
    marginTop: 22,
    backgroundColor: '#ffffff',
    padding: 10,
    borderColor: "black",
    borderRadius: 10,
    borderWidth: 1.2
  },
  ticketDispatchText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: "black",
    paddingBottom: 10
  },
  showDatePickerText: {
    color: "black",
    fontSize: 16
  },
  showDatePickerIcon: {
    color: "#808080",
    fontSize: 20
  },
  assignModalButtonsView: {
    flexDirection: 'row',
    justifyContent: "center"
  },
  assignModalCancelButton: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5
  },
  assignModalDispatchButton: {
    marginLeft: 50,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5
  },

  //Badge
  iconBadge: {
    position: 'absolute',
    top: -8,
    right: -5,
    minWidth: 20,
    height: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c40b24'
  },

  notificationCountStyle:{
     color: 'white', 
     fontSize: 15 ,
  },
  //Asset Feed Item #ffffff #eff1f4
  feedGrid: {
    borderColor: '#000000',
    borderWidth: 1.2,
    paddingTop: 10,
    backgroundColor: "#ffffff",
    elevation: 4,
    borderRadius: 8
  },
  newFeedGrid: {
    backgroundColor: "#eff1f4",
  },
  hide: {
    display: 'none',
    paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10
  },
  show: {
    paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10
  },
  eventContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    flex: 1
  },
  eventBody: {
    borderColor: '#000000',
    borderWidth: 1.2,
    paddingTop: 10,
    borderRadius: 8,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  left: {
    flex: 1
  },
  right: {
    flex: 1
  }
};
