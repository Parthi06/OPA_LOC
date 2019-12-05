import * as schemaType from './schemaTypes';


export const AssetCommentId = {
    name: schemaType.ASSET_COMMENTID,
    properties: {
        eventId: { type: 'int' },
        updatedAt: { type: 'double?' }
    }
};

export const AssetComments = {
    name: schemaType.ASSET_COMMENTS,
    properties: {
        commentId: { type: schemaType.ASSET_COMMENTID },
        userId: { type: 'int' },
        comment: { type: 'string' }
    }
};


export const AssetSchema = {
    name: schemaType.ASSET_SCHEMA,
    primaryKey: 'eventId',
    properties: {
        eventId: { type: 'int' },
        assetId: { type: 'int' },
        customerId: { type: 'int' },
        feedType: { type: 'string' },
        eventCreatedDate: { type: 'double' },
        lastUpdated: { type: 'double' },
        eventHasTicket: { type: 'string' },
        prognosisSummary1: { type: 'string' },
        prognosisDetails1: { type: 'string' },
        assetTag: { type: 'string' },
        assetType: { type: 'string' },
        assetAddress: { type: 'string?' },
        customerType: { type: 'string'},
        follow: { type: 'int' },
        eventComments: { type: 'list', objectType: schemaType.ASSET_COMMENTS }
    }
};
