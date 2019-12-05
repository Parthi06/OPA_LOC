
const React = require('react-native');

const { StyleSheet } = React;
export default {
  AssetViewDefault: {
    paddingTop:10,
    paddingBottom:10
  },
  AssetViewHidden: {
    paddingTop:10,
    paddingBottom:10
  },
  TicketPopUpModalView:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  TicketPopUpModalInnerView:{
    width: 300,
    height: 250,
    borderRadius: 10
  },
  TicketPopUpModalVisibleView:{
    marginTop: 22,
    backgroundColor:'#f0f5f5',
    padding:10,
    borderColor:"black",
    borderRadius:10,
    borderWidth:1
  },
  TicketPopUpMainText:{
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color:"black"
  },
  TicketPopUpModalButtonsView:{
    flexDirection: 'row',
    justifyContent:"center",
    paddingTop:20
  },
  TicketPopUpModalCancelButton:{
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5
  },
  TicketPopUpModalDispatchButton:{
     marginLeft:50,
     fontSize: 16,
     textAlign: 'center',
     marginTop: 5
  }
};
