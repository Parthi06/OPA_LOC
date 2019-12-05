import * as types from './ActionTypes';
import * as constants from '../Utils/Constants';
import RNFetchBlob from 'rn-fetch-blob'
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import RNProgressHud from '@zhigang1992/react-native-progress-display';

const FILE_DOWNLOAD_FAILED_ALERT = "File download failed";
const DATE_FORMAT = 'MMDDYYYY';
const DATE_FORMAT_UI = 'MM/DD/YYYY';
const FILE_EXTENSION = '.csv';
const FILE_DOWNLOAD_ALERT = "Measurement data download in progress...";
const FILE_DOWNLOAD_FAILURE_ALERT = "Measurement data download failed. Please try again later."

export function loadGraphMetricsDetailsToApp(metrics) {
  return { type: types.FETCH_GRAPH_METRICS, metrics };
}

export function loadGraphMetricsDetails() {
  var body = null;
  var myInit = {
    method: 'GET',
    body: body,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  return dispatch =>
    fetch(constants.SERVER_URL + '/motereport/getMetricsInfo', myInit)
        .then((response) => {
            if(response.ok){
                return response.json();
            }
        }).then((responseJson) => {
            dispatch( loadGraphMetricsDetailsToApp(responseJson) );
        }).catch((error) => {
            console.error('Error during Graph metrics details fetch '+error);
        });
}

export function downloadReportAPI(token, startDate, endDate, assetId, assetTag)
{
  const dir = RNFetchBlob.fs
  var body = null;
  var myInit = {
    method: 'GET',
    body: body,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  RNProgressHud.showWithStatus(FILE_DOWNLOAD_ALERT);
  return dispatch => {
  RNFetchBlob.config({
    path: RNFetchBlob.fs.dirs.DownloadDir + "/" + assetTag + "_" + moment(startDate).format(DATE_FORMAT) + "-" + moment(endDate).format(DATE_FORMAT) + FILE_EXTENSION,
    appendExt : 'csv'
  }).fetch('GET', constants.SERVER_URL + "/motereport/download/" + startDate + "/" + endDate + "/" + assetId + "/report.csv", {
    Authorization : token
  })//change url generic way this is only test url
  .then((res) =>
  {
    let status = res.info().status;
    if(status == 200) 
    {
      RNProgressHud.dismiss();
      Toast.showWithGravity("Asset data for " + assetTag + " from " + moment(startDate).format(DATE_FORMAT_UI) + " to " + moment(endDate).format(DATE_FORMAT_UI) + " has been downloaded successfully", Toast.LONG, Toast.CENTER);
    } 
    else 
    {
      // handle other status codes
      RNProgressHud.dismiss();
      Toast.showWithGravity(FILE_DOWNLOAD_FAILURE_ALERT, Toast.LONG, Toast.CENTER);
    }
  })
  .catch((errorMessage) => {
      RNProgressHud.dismiss();
      Toast.showWithGravity(FILE_DOWNLOAD_FAILURE_ALERT, Toast.LONG, Toast.CENTER);
  })
};
}