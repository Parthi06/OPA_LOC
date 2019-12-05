
export const applyLastUpdateFilter = (item) => {
      try {
            let mergeList = [];
            item.forEach(element => {
                  mergeList.push(element);
            });
            return mergeList.sort(custom_sort).reverse();
      }
      catch (e) {
            return [];
      }
}

export const applyUserFilter = (item) => {
      try {
            let mergeList = [];
            item.forEach(element => {
                  mergeList.push(element);
            });
            return mergeList.sort(custom_sort).reverse();
      }
      catch (e) {
            return [];
      }
}

export const applyAssetFilter = (newBtnState, item) => {

      return (newBtnState.follow) ? (item.feedType == 'AE' && item.follow == 1)
            : (item.feedType == 'AE');
}

export const applyAssetTicketFilter = (item) => {
      try {
            let mergeList = [];
            item.forEach(element => {
                  if (element.feedType == "AT")
                        mergeList.push(element);
            });
            return mergeList.sort(custom_sort).reverse();
      }
      catch (e) {
            return [];
      }
}

// export const applyUserFilter = (newBtnState, item) => {

//       return (newBtnState.follow) ? (item.feedType == 'UE' && item.follow == 1)
//             : (item.feedType == 'UE');

// }

export const applyUserTicketFilter = (item) => {
      try {
            let mergeList = [];
            item.forEach(element => {
                  if (element.feedType == "UT")
                        mergeList.push(element);
            });
            return mergeList.sort(custom_sort).reverse();
      }
      catch (e) {
            return [];
      }
}

export const applyFollowFilter = (newBtnState, item) => item.follow == 1;

export const applyAssetSpecificFilter = (eventsList, assetId) => {
      try {
            let assets = [];
            mergeEvents(eventsList).map((item) => { if (item.assetId == assetId) { assets.push(item) } });
            return assets;
      }
      catch (e) {
            return [];
      }
};


export const applyAssetFeedSpecificFilterByAssetId = (eventsList, assetId, assetBtnClicked, ticketBtnClicked, followFilterClicked) => {
      try {
            let assets = [];
                  if (	assetBtnClicked && ticketBtnClicked	)	{
                        mergeEvents( eventsList ).map( (item) => { if (item.assetId == assetId) { assets.push(item) } });  
                  } else if	(	ticketBtnClicked	&&	followFilterClicked	) {
												let followFilterData = [];
                        mergeEvents( eventsList ).map( (item) => { if (item.assetId == assetId && item.feedType == 'UT' || item.assetId == assetId && item.feedType == 'AT' ) { followFilterData.push(item) } });  
                        assets =  followFilterData.filter(function (event) {
                              return event.follow == 1;
                    		})		
                  } else if	(	assetBtnClicked	&&	followFilterClicked	) {
												let followFilterData = [];
												mergeEvents( eventsList ).map( (item) => { if (item.assetId == assetId  && item.feedType == 'AE' ) { followFilterData.push(item) } });  
												assets =  followFilterData.filter(function (event) {
														return event.follow == 1;
												})
                  } else if ( assetBtnClicked ) {
                        mergeEvents( eventsList ).map( (item) => { if (item.assetId == assetId && item.feedType == 'AE') { assets.push(item) } });
                  } else if ( ticketBtnClicked ) {
                        mergeEvents( eventsList ).map( (item) => { if (item.assetId == assetId && item.feedType == 'UT' || item.assetId == assetId && item.feedType == 'AT' ) { assets.push(item) } });                        
                  } else if (	followFilterClicked ) {
                        let followFilterData = [];
                        mergeEvents( eventsList ).map( (item) => { if (item.assetId == assetId ) { followFilterData.push(item) } });  
                        assets =  followFilterData.filter(function (event) {
                              return event.follow == 1;
                            })
                  } else {
                        mergeEvents( eventsList ).map( (item) => { if (item.assetId ) { assets.push(item) } });  
                  }
                  console.log(JSON.stringify(assets))
            return assets;
      }
      catch (e) {
            return [];
      }
};

export const applyPrognosisFilter = (item, prognosisSummary1) => item.prognosisSummary1 == prognosisSummary1;

export const mergeEvents = (item) => {
      try {
            let mergeList = [];
            let eventsList = item;
            eventsList.userFeed.forEach(element => {
                  mergeList.push(element);
            });
            eventsList.ticketFeed.forEach(element => {
                  mergeList.push(element);
            });
            eventsList.assetFeed.forEach(element => {
                  mergeList.push(element);
            });
            return mergeList.sort(custom_sort).reverse();
      }
      catch (e) {
            return [];
      }
}

function custom_sort(a, b) {
      return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
}