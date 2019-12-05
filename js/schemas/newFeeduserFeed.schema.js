import * as schemaType from './schemaTypes';


export const newFeedUserCommentId = {
    name: schemaType.NEWFEED_USER_COMMENTID,
    properties: {
        eventId: { type: 'int' },
        updatedAt: { type: 'double?' }
    }
};

export const newFeedUserComments = {
    name: schemaType.NEWFEED_USER_COMMENTS,
    properties: {
        commentId: { type: schemaType.NEWFEED_USER_COMMENTID },
        userId: { type: 'int' },
        comment: { type: 'string' }
    }
};

export const newFeedUserSchema = {
    name: schemaType.NEWFEED_USER_SCHEMA,
    primaryKey: 'eventId',
    properties: {
        eventId: { type: 'int' },
        assetId: { type: 'int' },
        customerId: { type: 'int' },
        feedType: { type: 'string' },
        eventCreatedDate: { type: 'double' },
        lastUpdated: { type: 'double?' },
        eventHasTicket: { type: 'string' },
        userId: { type: 'int' },
        userName: { type: 'string' },
        userType: { type: 'string' },
        userText: { type: 'string' },
        assetTag: { type: 'string' },
        assetType: { type: 'string' },
        assetAddress: { type: 'string' },
        customerType: { type: 'string'},
        follow: { type: 'int' },
        eventComments: { type: 'list', objectType: schemaType.NEWFEED_USER_COMMENTS }
    }
};
