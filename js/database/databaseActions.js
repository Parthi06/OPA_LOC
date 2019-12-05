import Realm from 'realm';
import * as schemaType from '../schemas/schemaTypes';
import * as schemaVersion from './databaseSchemaVersion';

const schemas = schemaVersion.databaseSchemaVersions();
const databaseOptions = schemas[schemas.length - 1];

export const saveLoginInfo = (value) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            clearRealm()
            let loginSchema = realm.objects(schemaType.LOGIN_SCHEMA);
            if (loginSchema.length > 0) {
                loginSchema[0].password = value.password;
                loginSchema[0].firstName = value.firstName;
                loginSchema[0].lastName = value.lastName;
                loginSchema[0].userType = value.userType;
                loginSchema[0].errorMessage = value.errorMessage;
                loginSchema[0].userId = value.userId;
                loginSchema[0].customerId = value.customerId;
                loginSchema[0].customerDomain = value.customerDomain;
                loginSchema[0].authFlag = value.authFlag;
                loginSchema[0].isUserLicenseAgreed = false;
                loginSchema[0].logo = value.logo;
                loginSchema[0].token = value.token;
                loginSchema[0].customerType = value.customerType;
                // loginSchema[0] = value;
                // realm.deleteAll();
                // // realm.delete(loginSchema[0]);
                // realm.create(schemaType.LOGIN_SCHEMA, value);
            } else {
                // loginSchema.push(value);
                // realm.deleteAll();
                realm.create(schemaType.LOGIN_SCHEMA, value);
            }
            resolve(getLoginInfo());
        });
    }).catch((error) => reject(error));
});

export const getLoginInfo = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let newFeedSchema = realm.objects(schemaType.NEWFEED_ASSET_SCHEMA);
            realm.delete(newFeedSchema);
            newFeedSchema = realm.objects(schemaType.NEWFEED_TICKET_SCHEMA);
            realm.delete(newFeedSchema);
            newFeedSchema = realm.objects(schemaType.NEWFEED_USER_SCHEMA);
            realm.delete(newFeedSchema);
        })
        let loginInfo = realm.objects(schemaType.LOGIN_SCHEMA);
        resolve(loginInfo);
    }).catch((error) => reject(error));

});

export const removeLoginInfo = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            try {
                let loginInfo = realm.objects(schemaType.LOGIN_SCHEMA);
                loginInfo[0].customerId = null;
                loginInfo[0].isUserLicenseAgreed = false;
            } catch (e) {
                console.log("LOGIN_SCHEMA Logout Delete failed: ", e);
            }
        });
    }).catch((error) => reject(error));
});


export const save = (mainSchemaName, schemaName, value) => new Promise((resolve, reject) => {

    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let mainSchema = realm.objects(mainSchemaName);
            let _event = [];
            if (mainSchema.length == 0) {
                mainSchema = realm.create(mainSchemaName, { userFeed: [], assetFeed: [], ticketFeed: [] });
            }
            mainSchema = realm.objects(mainSchemaName);
            if (schemaName === schemaType.USER_SCHEMA) {
                _event = realm.objectForPrimaryKey(schemaType.USER_SCHEMA, value.eventId);
                if (_event) {
                    if (value.lastUpdated > _event.lastUpdated) {
                        realm.delete(_event);
                        mainSchema[0].userFeed.push(value);
                    }
                } else {
                    mainSchema[0].userFeed.push(value);
                }
            } else if (schemaName === schemaType.ASSET_SCHEMA) {
                _event = realm.objectForPrimaryKey(schemaType.ASSET_SCHEMA, value.eventId);
                if (_event) {
                    if (value.lastUpdated > _event.lastUpdated) {
                        realm.delete(_event);
                        mainSchema[0].assetFeed.push(value);
                    }
                } else {
                    mainSchema[0].assetFeed.push(value);
                }
            } else if (schemaName === schemaType.TICKET_SCHEMA) {
                _event = realm.objectForPrimaryKey(schemaType.TICKET_SCHEMA, value.eventId);
                if (_event) {
                    if (value.lastUpdated > _event.lastUpdated) {
                        realm.delete(_event);
                        mainSchema[0].ticketFeed.push(value);
                    }
                } else {
                    mainSchema[0].ticketFeed.push(value);
                }
            }
            resolve(value);
        });
    }).catch((error) => reject(error));
});

export const findAll = (schemaName) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let allAssetsList = realm.objects(schemaName);
        resolve(allAssetsList);
    }).catch((error) => {
        reject(error);
    });
});

export const findAllAssets = (schemaName) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let allAssetsList = realm.objects(schemaName);
        allAssetsList = allAssetsList.sorted('checkupTime', true);
        resolve(allAssetsList);
    }).catch((error) => {
        reject(error);
    });
});


//Currently Not Using 
export const updateById = (schemaName, event) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let _event = [];

            _event = realm.objectForPrimaryKey(schemaName, event.eventId);
            if (event.feedType == "UE") {
                _event.assetId = event.assetId;
                _event.customerId = event.customerId;
                _event.feedType = event.feedType;
                _event.eventCreatedDate = event.eventCreatedDate;
                _event.lastUpdated = event.lastUpdated;
                _event.eventHasTicket = event.eventHasTicket;
                _event.userId = event.userId;
                _event.userName = event.userName;
                _event.userType = event.userType;
                _event.userText = event.userText;
                _event.assetTag = event.assetTag;
                _event.assetType = event.assetType;
                _event.assetAddress = event.assetAddress;
                _event.follow = event.follow;
                _event.eventComments = _.values(event.eventComments);

            } else if (event.feedType == "AE") {
                _event.assetId = event.assetId;
                _event.customerId = event.customerId;
                _event.feedType = event.feedType;
                _event.eventCreatedDate = event.eventCreatedDate;
                _event.lastUpdated = event.lastUpdated;
                _event.eventHasTicket = event.eventHasTicket;
                _event.prognosisSummary1 = event.prognosisSummary1;
                _event.prognosisDetails1 = event.prognosisDetails1;
                _event.assetTag = event.assetTag;
                _event.assetType = event.assetType;
                _event.assetAddress = event.assetAddress;
                _event.follow = event.follow;
                _event.eventComments = event.eventComments;
            } else if (event.feedType == "UT" || event.feedType == "AT") {
                _event.ticketId = event.ticketId;
                _event.assetId = event.assetId;
                _event.customerId = event.customerId;
                _event.feedType = event.feedType;
                _event.ticketState = event.ticketState;
                _event.ticketAssignedTo = event.ticketAssignedTo;
                _event.ticketClosedBy = event.ticketClosedBy;
                _event.tickeAssignee = event.tickeAssignee;
                _event.ticketReopenedDate = event.ticketReopenedDate;
                _event.ticketCreatedDate = event.ticketCreatedDate;
                _event.ticketDueDate = event.ticketDueDate;
                _event.lastUpdated = event.lastUpdated;
                _event.ticketPriority = event.ticketPriority;
                _event.checkupResult = event.checkupResult;
                _event.diagnosis = event.diagnosis;
                _event.hasFeedback = event.hasFeedback;
                _event.assetTag = event.assetTag;
                _event.assetType = event.assetType;
                _event.assetAddress = event.assetAddress;
                _event.follow = event.follow;
                _event.ticketComments = event.ticketComments;
                _event.eventComments = event.eventComments;
                _event.prognosisDetails1 = event.prognosisDetails1
            }
            resolve(_event);
        });
    }).catch((error) => reject(error));
});


export const updateFollowStatusOnDb = (schemaName, eventId, followFlag) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let _event = [];
            _event = realm.objectForPrimaryKey(schemaName, eventId);
            _event.follow = followFlag;
        });
        resolve(findAll(schemaType.MAIN_SCHEMA));
    }).catch((error) => reject(error));
});

export const updateCommetsOnDb = (comment, type) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let _event = [];
            // console.log("comment", comment)
            if (type == "AT") {
                _event = realm.objectForPrimaryKey(schemaType.TICKET_SCHEMA, comment.commentId.eventId);
                // const TICKET_COMMENTS = realm.create(schemaType.TICKET_COMMENTS, {
                //     userId: eval(comment.userId),
                //     comment: comment.comment
                // });
                // TICKET_COMMENTS.commentId.push({
                //     ticketId: comment.commentId.ticketId,
                //     updatedAt: comment.commentId.updatedAt
                // });
                _event.lastUpdated = comment.commentId.updatedAt;
                _event.ticketComments.push(comment);
            } else if (type == "UE") {
                _event = realm.objectForPrimaryKey(schemaType.USER_SCHEMA, comment.commentId.eventId);
                // const USER_COMMENTS = realm.create(schemaType.USER_COMMENTS, {
                //     userId: eval(comment.userId),
                //     comment: comment.comment
                // });
                // USER_COMMENTS.commentId.push({
                //     eventId: comment.commentId.eventId,
                //     updatedAt: comment.commentId.updatedAt
                // });
               _event.lastUpdated = comment.commentId.updatedAt;
                _event.eventComments.push(comment);
            } else {
                _event = realm.objectForPrimaryKey(schemaType.ASSET_SCHEMA, comment.commentId.eventId);
                // const ASSET_COMMENTS = realm.create(schemaType.ASSET_COMMENTS, {
                //     userId: eval(comment.userId),
                //     comment: comment.comment
                // });
                // ASSET_COMMENTS.commentId.push({
                //     eventId: comment.commentId.eventId,
                //     updatedAt: comment.commentId.updatedAt
                // });
                _event.lastUpdated = comment.commentId.updatedAt;
                _event.eventComments.push(comment);
            }
        });
        resolve(findAll(schemaType.MAIN_SCHEMA));
    }).catch((error) => reject(error));
});


export const updateAssignedStatus = (schemaName, eventId) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let _event = [];
            _event = realm.objectForPrimaryKey(schemaName, eventId);
            realm.delete(_event);
        });
        resolve(findAll(schemaType.MAIN_SCHEMA));
    }).catch((error) => reject(error));
});

export const removeAssociatedEventForNewTickets = (schemaName, eventId) => new Promise((resolve, reject) => {
    var feedType = ((schemaName === schemaType.USER_SCHEMA)?"UE":"AE");
    var newFeedSchemaName = ((schemaName === schemaType.USER_SCHEMA)?schemaType.NEWFEED_USER_SCHEMA:schemaType.NEWFEED_ASSET_SCHEMA);
      Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let _event = [];
            _event = realm.objects(schemaName).filtered('eventId=' + eventId + 'AND feedType = "'+feedType+'"');
            if(_event)
                realm.delete(_event);
        });
        resolve(findAll(schemaType.MAIN_SCHEMA));
     }).catch((error) => reject(error));
        Realm.open(databaseOptions).then(realm => {
            realm.write(() => {
                let _event = [];
                _event = realm.objectForPrimaryKey(newFeedSchemaName, eventId);
                if(_event){
                    realm.delete(_event);
                }
            });
    resolve(findAll(schemaType.MAIN_SCHEMA));
    }).catch((error) => reject(error));
});



export const updateTicketAssignedToDB = (schemaName, ticketAssignedTo, eventId, ticketAssignedToId) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let _event = [];
            _event = realm.objectForPrimaryKey(schemaName, eventId);
            _event.ticketAssignedTo = ticketAssignedTo;
            _event.ticketAssignedToId = ticketAssignedToId;
        });
        resolve(findAll(schemaType.MAIN_SCHEMA));
    }).catch((error) => reject(error));
});


export const saveFeedbackToDB = (schemaName, feedback) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let _event = [];
            _event = realm.objectForPrimaryKey(schemaName, feedback.eventId);
            _event.checkupResult = feedback.checkupResult;
            _event.diagnosis = feedback.checkupFaultDiagnosisEnum;
            _event.hasFeedback = "Y";
            _event.notes = feedback.notes;
        });
        resolve(findAll(schemaType.MAIN_SCHEMA));
    }).catch((error) => reject(error));
});


export const closeTicket = (schemaName, ticket) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let _event = [];
            _event = realm.objectForPrimaryKey(schemaName, ticket.eventId);
            // _event.ticketClosedDate = ticket.ticketClosedDate;
            _event.lastUpdated = ticket.ticketLastUpdated;
            _event.ticketState = ticket.ticketState;
            _event.ticketClosedBy = parseInt(ticket.ticketClosedBy, 10);
            _event.hasFeedback = ticket.hasFeedback;
            _event.ticketReopenedDate = ticket.ticketReopenedDate;
        });
        resolve(findAll(schemaType.MAIN_SCHEMA));
    }).catch((error) => reject(error));
});


export const getLastUpdateDate = (eventLastUpdated) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let data = [];
        realm.write(() => {

            let sorteduserSchema, sortedassetSchema, sortedTicketSchema;
            if (eventLastUpdated.userFeed == 0) {
                sorteduserSchema = realm.objects(schemaType.USER_SCHEMA);
                sorteduserSchema = sorteduserSchema.sorted('lastUpdated', true);
                if (sorteduserSchema.length > 0)
                    data.userEventLastUpdated = sorteduserSchema[0].lastUpdated;
                else
                    data.userEventLastUpdated = eventLastUpdated.userFeed;
            } else {
                data.userEventLastUpdated = eventLastUpdated.userFeed;
            }

            if (eventLastUpdated.assetFeed == 0) {
                sortedassetSchema = realm.objects(schemaType.ASSET_SCHEMA);
                sortedassetSchema = sortedassetSchema.sorted('lastUpdated', true);
                if (sortedassetSchema.length > 0)
                    data.assetEventLastUpdated = sortedassetSchema[0].lastUpdated;
                else
                    data.assetEventLastUpdated = eventLastUpdated.assetFeed;
            } else {
                data.assetEventLastUpdated = eventLastUpdated.assetFeed;
            }

            if (eventLastUpdated.ticketFeed == 0) {
                sortedTicketSchema = realm.objects(schemaType.TICKET_SCHEMA);
                sortedTicketSchema = sortedTicketSchema.sorted('lastUpdated', true);
                if (sortedTicketSchema.length > 0)
                    data.ticketEventLastUpdated = sortedTicketSchema[0].lastUpdated;
                else
                    data.ticketEventLastUpdated = eventLastUpdated.ticketFeed;
            } else {
                data.ticketEventLastUpdated = eventLastUpdated.ticketFeed;
            }
        });
        resolve(data);
    }).catch((error) => reject(error));
});


export const updateEventsStateWithNewFeeds = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let newfeeedSchema = realm.objects(schemaType.NEWFEED_SCHEMA);
            if (newfeeedSchema.length == 0) {
                resolve([]);
            } else {
                resolve(newfeeedSchema);
                // realm.close();
            }
        });
    }).catch((error) => reject(error));
});

export const deleteNewFeedsOldData = (btnId) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let newfeeedSchema = null;
            if (btnId == 2) {
                newfeeedSchema = realm.objects(schemaType.NEWFEED_ASSET_SCHEMA);
                realm.delete(newfeeedSchema);
            } else if (btnId == 3) {
                newfeeedSchema = realm.objects(schemaType.NEWFEED_USER_SCHEMA);
                realm.delete(newfeeedSchema);
            } else if (btnId == 1) {
                newfeeedSchema = realm.objects(schemaType.NEWFEED_TICKET_SCHEMA);
                realm.delete(newfeeedSchema);
            }
        });
    }).catch((error) => reject(error));
});

export const saveNewFeed = (mainSchemaName, schemaName, value) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let mainSchema = realm.objects(mainSchemaName);
            let _event = [];
            if (mainSchema.length == 0) {
                mainSchema = realm.create(mainSchemaName, { userFeed: [], assetFeed: [], ticketFeed: [] });
            }
            mainSchema = realm.objects(mainSchemaName);
            if (schemaName === schemaType.NEWFEED_USER_SCHEMA) {
                console.log(' inside user schema\n')
                _event = realm.objectForPrimaryKey(schemaType.NEWFEED_USER_SCHEMA, value.eventId);
                console.log(' inside user schema\n' + JSON.stringify(_event))

                if (_event) {
                    console.log( value.lastUpdated + _event.lastUpdated +   '  =greter or less='+value.lastUpdated > _event.lastUpdated)
                    if (value.lastUpdated > _event.lastUpdated) {
                        realm.delete(_event);
                        mainSchema[0].userFeed.push(value);
                    }
                } else {
                    mainSchema[0].userFeed.push(value);
                }
            } else if (schemaName === schemaType.NEWFEED_ASSET_SCHEMA) {
                _event = realm.objectForPrimaryKey(schemaType.NEWFEED_ASSET_SCHEMA, value.eventId);
                console.log(' inside user schema\n' + JSON.stringify(_event))
                if (_event) {
                    if (value.lastUpdated > _event.lastUpdated) {
                        realm.delete(_event);
                        mainSchema[0].assetFeed.push(value);
                    }
                } else {
                    mainSchema[0].assetFeed.push(value);
                }
            } else if (schemaName === schemaType.NEWFEED_TICKET_SCHEMA) {
                _event = realm.objectForPrimaryKey(schemaType.NEWFEED_TICKET_SCHEMA, value.eventId);
                if (_event) {
                    if (value.lastUpdated > _event.lastUpdated) {
                        realm.delete(_event);
                        mainSchema[0].ticketFeed.push(value);
                    }
                } else {
                    mainSchema[0].ticketFeed.push(value);
                }
            }
            resolve(value);
        });
    }).catch((error) => reject(error));
});



export const getEventsCount = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let newfeeedAssetSchema = realm.objects(schemaType.NEWFEED_ASSET_SCHEMA);
            let newfeeedTicketSchema = realm.objects(schemaType.NEWFEED_TICKET_SCHEMA);
            let newfeeedUserSchema = realm.objects(schemaType.NEWFEED_USER_SCHEMA);
            let returnData = {
                countOfAE: newfeeedAssetSchema.length,
                countOfUE: newfeeedUserSchema.length,
                countOfT: newfeeedTicketSchema.length
            };
            resolve(returnData);
        });
    }).catch((error) => reject(error));
});

export const getNewAssetAndUserEvents = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let newfeedAssetSchema = realm.objects(schemaType.NEWFEED_ASSET_SCHEMA);
            let newfeedUserSchema = realm.objects(schemaType.NEWFEED_USER_SCHEMA);
            let newFeedData = {
                dataAE: newfeedAssetSchema,
                dataUE: newfeedUserSchema.length
            };
            resolve(newFeedData);
        });
    }).catch((error) => reject(error));
});


export const saveAssetsList = (schemaName, value) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let _event = [];
            _event = realm.objectForPrimaryKey(schemaType.ASSETLIST_SCHEMA, value.assetId);
            if (_event) {
                // if (value._event > _event._event) {
                _event.customerId = value.customerId;
                _event.assetType = value.assetType;
                _event.assetTag = value.assetTag;
                _event.assetAddress = value.assetAddress;
                _event.datetimeAssetAdded = value.datetimeAssetAdded;
                _event.assetState = value.assetState;
                _event.prognosisSummary1 = value.prognosisSummary1;
                _event.prognosisDetails1 = value.prognosisDetails1;
                _event.checkupTime = value.checkupTime;                
                _event.ticketIdAndStatus = value.ticketIdAndStatus;               
                _event.customerName = value.customerName;
                _event.interventionTimeline = value.interventionTimeline;
                _event.prognosisTimelineDataTime = value.prognosisTimelineDataTime;
                _event.prognosisTimelineNote = value.prognosisTimelineNote;
                // }
            } else {
                realm.create(schemaName, value);
            }
            resolve(value);
        });
    }).catch((error) => reject(error));
});

export const updateLoginInfo = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let loginInfo = realm.objects(schemaType.LOGIN_SCHEMA);
            loginInfo[0].isUserLicenseAgreed = true;
            resolve(loginInfo[0]);
        });
    }).catch((error) => reject(error));
});

export const getFeedbackHistory = (ticketId) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let data = [];
        data = realm.objects(schemaType.FEEDBACK_HISTORY);
        if (data.length > 0) {
            data.maxCheckupTime = realm.objects(schemaType.FEEDBACK_HISTORY).max('checkupTime');
            data.list = realm.objects(schemaType.FEEDBACK_HISTORY).filtered('ticketId=' + ticketId + '');
            resolve(data);
        } else {
            data.maxCheckupTime = 0;
            data.list = [];
            resolve(data);
        }

    }).catch((error) => reject(error));
});

export const saveFeedbackHistory = (schemaName, feedback) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let _event = [];
            _event = realm.objects(schemaName).filtered('dateTime=' + feedback.dateTime + '');
            if (_event) {
                realm.delete(_event);
                realm.create(schemaName, feedback);
            } else {
                realm.create(schemaName, feedback);
            }
        });
        resolve(feedback);
    }).catch((error) => reject(error));
});

export const getAssetOperationalInfo = (assetId) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let _event = realm.objectForPrimaryKey(schemaType.ASSET_OPERATIONAL_INFO, assetId);
            if (_event) {
                resolve(_event);
            }
            else { resolve([]) }
        });
    }).catch((error) => reject(error));
});

export const getAssetDetailsById = (assetId) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            console.log(assetId + '==========')
            let _event = realm.objectForPrimaryKey(schemaType.ASSETLIST_SCHEMA, assetId);
            console.log(_event)
            if (_event) {
                resolve(_event);
            }
            else { resolve([]) }
        });
    }).catch((error) => reject(error));
});


export const saveAssetOperationalInfo = (value) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let _event = [];
            _event = realm.objectForPrimaryKey(schemaType.ASSET_OPERATIONAL_INFO, value.assetId);
            if (_event) {
                // if (value.cumulativeActive > _event.cumulativeActive) {
                realm.delete(_event);
                realm.create(schemaType.ASSET_OPERATIONAL_INFO, value);
                // }
            } else {
                realm.create(schemaType.ASSET_OPERATIONAL_INFO, value);
            }
            resolve(value);
        });
    }).catch((error) => reject(error));
});

export const getCustomerAssetList = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let customerAssetList = realm.objects(schemaType.CUSTOMER_ASSET_LIST);
        resolve(customerAssetList);
    }).catch((error) => reject(error));
});


export const saveCustomerAssetList = (schemaName, value) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let _event = [];
            _event = realm.objectForPrimaryKey(schemaType.CUSTOMER_ASSET_LIST, value.assetId);
            if (_event) {
                _event.customerId = value.customerId;
                _event.assetType = value.assetType;
                _event.assetTag = value.assetTag;
                _event.assetAddress = value.assetAddress;
                _event.datetimeAssetAdded = value.datetimeAssetAdded;
                _event.assetState = value.assetState;
                _event.prognosisSummary1 = value.prognosisSummary1;
                _event.prognosisDetails1 = value.prognosisDetails1;
                _event.override = value.override;
                _event.checkupTime = value.checkupTime;
                _event.checkupResult = value.checkupResult;
                _event.checkupFaultDiagnosisEnum = value.checkupFaultDiagnosisEnum;
               // _event.associatedTicketIds = value.associatedTicketIds;
                _event.ticketIdAndStatus = value.ticketIdAndStatus;
                _event.interventionTimeline = value.interventionTimeline;
                _event.prognosisTimelineDataTime = value.prognosisTimelineDataTime;
                _event.prognosisTimelineNote = value.prognosisTimelineNote;
                // realm.create(schemaName, value);
            } else {
                realm.create(schemaName, value);
            }
            resolve(value);
        });
    }).catch((error) => reject(error));
});


export const saveCustomerUserList = (value) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let _event = [];
            _event = realm.objectForPrimaryKey(schemaType.USERLIST_SCHEMA, value.userId);
            if (_event) {
                delete value.userId;
                _event = value;
            } else {
                realm.create(schemaType.USERLIST_SCHEMA, value);
            }
            resolve(value);
        });
    }).catch((error) => reject(error));
});


export const getCustomerUserList = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let customerUserList = realm.objects(schemaType.USERLIST_SCHEMA);
        resolve(customerUserList);
    }).catch((error) => reject(error));
});

function clearRealm() {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let data = realm.objects(schemaType.ASSET_SCHEMA);
            if (data.length > 0) {
                realm.delete(data)
            }
            // data = realm.objects(schemaType.EVENT_SCHEMA);
            // if (data.length > 0) {
            //     realm.delete(data)
            // }

            data = realm.objects(schemaType.MAIN_SCHEMA);


            if (data.length > 0) {

                realm.delete(data)
            }

            data = realm.objects(schemaType.USER_SCHEMA);
            if (data.length > 0) {
                realm.delete(data)
            }

            data = realm.objects(schemaType.TICKET_SCHEMA);
            if (data.length > 0) {
                realm.delete(data)
            }

            data = realm.objects(schemaType.NEWFEED_SCHEMA);
            if (data.length > 0) {
                realm.delete(data)
            }

            data = realm.objects(schemaType.NEWFEED_USER_SCHEMA);
            if (data.length > 0) {
                realm.delete(data)
            }

            data = realm.objects(schemaType.NEWFEED_TICKET_SCHEMA);
            if (data.length > 0) {
                realm.delete(data)
            }

            data = realm.objects(schemaType.NEWFEED_ASSET_SCHEMA);
            if (data.length > 0) {
                realm.delete(data)
            }

            data = realm.objects(schemaType.ASSETLIST_SCHEMA);
            if (data.length > 0) {
                realm.delete(data)
            }

            // data = realm.objects(schemaType.ASSET_DETAILS_SCHEMA);
            // if (data.length > 0) {
            //     realm.delete(data)
            // }

            data = realm.objects(schemaType.FEEDBACK_HISTORY);
            if (data.length > 0) {
                realm.delete(data)
            }

            data = realm.objects(schemaType.ASSET_OPERATIONAL_INFO);
            if (data.length > 0) {
                realm.delete(data)
            }

            data = realm.objects(schemaType.CUSTOMER_ASSET_LIST);
            if (data.length > 0) {
                realm.delete(data)
            }

            data = realm.objects(schemaType.USERLIST_SCHEMA);
            if (data.length > 0) {
                realm.delete(data)
            }

            data = realm.objects(schemaType.PROCESSED_GRAPH_DATA);
            if (data.length > 0) {
                realm.delete(data)
            }

            data = realm.objects(schemaType.PROCCESED_GRAPHS);
            if (data.length > 0) {
                realm.delete(data)
            }

            data = realm.objects(schemaType.PROCCESED_GRAPHS_POINTS);
            if (data.length > 0) {
                realm.delete(data)
            }

            data = realm.objects(schemaType.TICKET_HISTORY);
            if (data.length > 0) {
                realm.delete(data)
            }

            data = realm.objects(schemaType.ASSET_INTERVENTION_TIMELINE);
            if (data.length > 0) {
                realm.delete(data)
            }

            data = realm.objects(schemaType.CUSTOMER_ASSET_INTERVENTION_TIMELINE);
            if (data.length > 0) {
                realm.delete(data)
            }
        });

    }).catch((error) => console.log("clearRealm", error));
}

export const updateMoteState = (schemaName, value) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let _event = [];
            _event = realm.objectForPrimaryKey(schemaName, value.assetId);
            if (_event) {
                if ( _event.state != value.state ) {
                    _event.state = value.state;
                }
            } else {
                realm.create(schemaName, value);
            }
            resolve(value);
        });
    }).catch((error) => reject(error));
});



export const saveProcessedData = (schemaName, value) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let _event = [];
            _event = realm.objectForPrimaryKey(schemaName, value.assetId);
            if (_event) {
                if (value.dateTime > _event.dateTime) {
                    if (value.lineGraphParams == null)
                        value.lineGraphParams = [];
                    _event.moteId = value.moteId;
                    _event.locationLabel = value.locationLabel;
                    console.log('\n---Date      -   -   -   -----------------'+ value.dateTime)
                    _event.dateTime = value.dateTime;
                    _event.lineGraphParams = value.lineGraphParams;
                    _event.graphs = value.graphs;
                    _event.state = value.state;
                } 
                if ( _event.state != value.state ) {
                    _event.state = value.state;
                }
            } else {
                realm.create(schemaName, value);
            }
            resolve(value);
        });
    }).catch((error) => reject(error));
});

export const getProcessedData = (schemaName, assetId) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let assetGraphData = realm.objectForPrimaryKey(schemaName, assetId);
        if (!assetGraphData)
            assetGraphData = [];
        resolve(assetGraphData);
    }).catch((error) => {
        reject(error);
    });
});


export const getTicketHistoryByTicketId = (ticketId) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let data = [];
        data = realm.objects(schemaType.TICKET_HISTORY).filtered('ticketId=' + ticketId + '');
        if (data) {
            resolve(data);
        } else {
            resolve([]);
        }

    }).catch((error) => reject(error));
});

export const saveTicketHistory = (schemaName, history) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let _event = realm.objectForPrimaryKey(schemaType.TICKET_HISTORY, history.id);
            if (_event) {
                _event.userId1 = _event.userId1;
                _event.userId2 = _event.userId2;
                _event.ticketDate = _event.ticketDate;
                _event.ticketState = _event.ticketState;
            } else {
                realm.create(schemaName, history);
            }
        });
        resolve(history);
    }).catch((error) => reject(error));
});


export const saveUpgradeWindowDisplayedTimeStamp = (schemaName, windowDisplayedTimestamp) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            console.log(windowDisplayedTimestamp + '   Save UpgradeWindow Displayed TimeStamp   -     - \n')
            let _event = [];
            _event = realm.objects(schemaName);
            console.log( _event + '       Existing  save UpgradeWindow Displayed TimeStamp   -     - \n')
            if ( _event.length > 0 ) {
                _event[0].upgradionWindowDisplayedDateTime = Date.parse(windowDisplayedTimestamp);
            } else {
                console.log(windowDisplayedTimestamp + ' -    New save UpgradeWindow Displayed TimeStamp   -     - \n')
                realm.create(schemaName, { upgradionWindowDisplayedDateTime:Date.parse(windowDisplayedTimestamp)});                
            }
            resolve( _event );
        });
    }).catch((error) => reject(error));
});

export const fetchUpgradeWindowDisplayedTimeStamp = (schemaName) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let upgradionWindowDisplayedDateTime = realm.objects(schemaName);
        if  ( Object.keys(upgradionWindowDisplayedDateTime).length != 0 ) {
            resolve(upgradionWindowDisplayedDateTime[0].upgradionWindowDisplayedDateTime);
        }   else {
            resolve([]);
        }
    }).catch((error) => {
        console.log('\n\n Error fetchUpgradeWindowDisplayedTimeStamp -       -       -:  '+ error)
        reject(error);
    });
});



// export const updateTodoList = todoList => new Promise((resolve, reject) => {
//     Realm.open(databaseOptions).then(realm => {
//         realm.write(() => {
//             let updatingTodoList = realm.objectForPrimaryKey(TODOLIST_SCHEMA, todoList.id);
//             updatingTodoList.name = todoList.name;
//             resolve();
//         });
//     }).catch((error) => reject(error));;
// });
// export const deleteTodoList = todoListId => new Promise((resolve, reject) => {
//     Realm.open(databaseOptions).then(realm => {
//         realm.write(() => {
//             let deletingTodoList = realm.objectForPrimaryKey(TODOLIST_SCHEMA, todoListId);
//             realm.delete(deletingTodoList);
//             resolve();
//         });
//     }).catch((error) => reject(error));;
// });
// export const deleteAllTodoLists = () => new Promise((resolve, reject) => {
//     Realm.open(databaseOptions).then(realm => {
//         realm.write(() => {
//             let allTodoLists = realm.objects(TODOLIST_SCHEMA);
//             realm.delete(allTodoLists);
//             resolve();
//         });
//     }).catch((error) => reject(error));;
// });
// export const queryAllTodoLists = () => new Promise((resolve, reject) => {
//     Realm.open(databaseOptions).then(realm => {
//         let allTodoLists = realm.objects(TODOLIST_SCHEMA);
//         resolve(allTodoLists);
//     }).catch((error) => {
//         reject(error);
//     });
// });

export default new Realm(databaseOptions);





