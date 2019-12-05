import * as mainSchema from '../schemas/main.schema';
import * as assetsSchema from '../schemas/assetsFeed.schema';
import * as ticketSchema from '../schemas/ticketFeed.schema';
import * as userSchema from '../schemas/userFeed.schema';

import * as newFeedSchema from '../schemas/newFeed.schema';
import * as newFeedassetsSchema from '../schemas/newFeedassetsFeed.schema';
import * as newFeedticketSchema from '../schemas/newFeedticketFeed.schema';
import * as newFeeduserSchema from '../schemas/newFeeduserFeed.schema';
import * as loginSchema from '../schemas/login.schema';
import * as assetListSchema from '../schemas/assetList.schema';
import * as feedbackHistory from '../schemas/feedbackHistory.schema';

import * as assetOperationalInfo from '../schemas/assetOperationalInfo.schema';
import * as customerAssetList from '../schemas/customerAssetList.schema';
import * as cutsomerUserList from '../schemas/cutsomerUserList.schema';
import * as processedData from '../schemas/processedData.schema';
import * as ticketHistory from '../schemas/ticketHistory.schema';
import * as forceUpgrade from '../schemas/forceUpgrade.schema';

export const SCHEMA_CONTAINER = [
    mainSchema.MainSchema,
    assetsSchema.AssetSchema,
    assetsSchema.AssetComments,
    assetsSchema.AssetCommentId,
    ticketSchema.TicketSchema,
    ticketSchema.TicketComments,
    ticketSchema.TicketCommentId,
    ticketSchema.TicketEventComments,
    ticketSchema.TicketEventCommentId,
    userSchema.UserSchema,
    userSchema.UserComments,
    userSchema.UserCommentId,

    newFeedSchema.NewFeedSchema,
    newFeedassetsSchema.newFeedAssetSchema,
    newFeedassetsSchema.newFeedAssetComments,
    newFeedassetsSchema.newFeedAssetCommentId,
    newFeedticketSchema.newFeedTicketSchema,
    newFeedticketSchema.newFeedTicketComments,
    newFeedticketSchema.newFeedTicketCommentId,
    newFeedticketSchema.newFeedTicketEventComments,
    newFeedticketSchema.newFeedTicketEventCommentId,
    newFeeduserSchema.newFeedUserSchema,
    newFeeduserSchema.newFeedUserComments,
    newFeeduserSchema.newFeedUserCommentId,

    loginSchema.LoginSchema,
    assetListSchema.AssetListSchema,
    assetListSchema.InterventionTimeline,
    feedbackHistory.FeedbackHistorySchema,
    assetOperationalInfo.AssetOperationlInfo,
    customerAssetList.CustomerAssetListSchema,
    cutsomerUserList.UserListSchema,
    customerAssetList.CustomerInterventionTimeline,
    customerAssetList.AssociatedTicketIdsAndStatus,
    processedData.processedGraphsPoints,
    processedData.processedGraphs,
    processedData.processedGraphDataSchema,
    ticketHistory.ticketHistorySchema,

    forceUpgrade.Force_Upgrade
];


