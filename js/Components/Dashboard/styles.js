import { Dimensions} from 'react-native';

const React = require('react-native');
const { StyleSheet } = React;

var { width,height } = Dimensions.get('window');

export default {
  prognosisBtn :{
   width: width *0.4,
   marginBottom:5
 },
  prognosisBtnView:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  blackcolor:{
    borderColor: '#000000'
  },
  urgentColor:{
    borderColor: '#ce0202'
  },
  checkupColor:{
    borderColor: '#e0dd35'
  },
  healthyColor:{
    borderColor: '#0dc416'
  },
  unknownColor:{
    borderColor: '#A9A9A9'
  },
  blackTextcolor:{
    color: '#000000',
    justifyContent: 'flex-end',
    width: '60%'
  },
  urgentTextColor:{
    color: '#ce0202',
    justifyContent: 'flex-end',
    width: '60%'
  },
  checkupTextColor:{
    color: '#e0dd35',
    justifyContent: 'flex-end',
    width: '60%'
  },
  healthyTextColor:{
    color: '#0dc416',
    justifyContent: 'flex-end',
    width: '60%'
  },
  unknownTextColor:{
    color: '#A9A9A9',
    justifyContent: 'flex-end',
    width: '60%'
  },
  blackValuecolor:{
    color: '#000000',
    justifyContent: 'flex-start',
    width: '20%'
  },
  urgentValueColor:{
    color: '#ce0202',
    justifyContent: 'flex-start',
    width: '20%'
  },
  checkupValueColor:{
    color: '#e0dd35',
    justifyContent: 'flex-start',
    width: '20%'
  },
  healthyValueColor:{
    color: '#0dc416',
    justifyContent: 'flex-start',
    width: '20%'
  },
  unknownValueColor:{
    color: '#A9A9A9',
    justifyContent: 'flex-start',
    width: '20%'
  },
  pieChart:{
    width: width *0.31
  },
  container: {
    flex: 1,
    flexDirection: 'column'
  }
};
