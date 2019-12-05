export default {
  events: {
    0: {
      userFeed: [],
      assetFeed: [],
      ticketFeed: []
    }
  },
  // events: [],
  ticketEvent: [],
  loginResponse: [],
  users: [],
  assets: [],
  assetOperationalInfoList: [],
  assetList: [],
  processedData: [],
  faultEnums: [],
  assetCount: {
    urgentAssetCount: 0,
    checkupAssetCount: 0,
    healthyAssetCount: 0
  },
  newEventsInfo: {
    countOfAE: 0,
    countOfUE: 0,
    countOfT: 0
  },
  lastUpdated: {
    userFeed: 0,
    assetFeed: 0,
    ticketFeed: 0
  },
  feedbackHistory: [],
  ticketHistory: [],assetHistoryDetails:{},
  initialUpgradationStatus : {
            forceUpgrade:false, 
            laterUpgrade:false
  },
  openTicketsIdWithAssetDetailsObj:{},
  loadAllAssetTags:[],
  metrics:{},
  assetsByCustomerId:[]
}
