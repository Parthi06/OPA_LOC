import * as schemaType from './schemaTypes';

export const newFeedTicketCommentId = {
    name: schemaType.NEWFEED_TICKET_COMMENTID,
    properties: {
        ticketId: { type: 'int' },
        updatedAt: { type: 'double?' },
    }
};

export const newFeedTicketComments = {
    name: schemaType.NEWFEED_TICKET_COMMENTS,
    properties: {
        commentId: { type: schemaType.NEWFEED_TICKET_COMMENTID },
        userId: { type: 'int' },
        comment: { type: 'string' }
    }
};

export const newFeedTicketEventCommentId = {
    name: schemaType.NEWFEED_TICKET_EVENT_COMMENTID,
    properties: {
        eventId: { type: 'int' },
        updatedAt: { type: 'double?' },
    }
};

export const newFeedTicketEventComments = {
    name: schemaType.NEWFEED_TICKET_EVENT_COMMENTS,
    properties: {
        commentId: { type: schemaType.NEWFEED_TICKET_EVENT_COMMENTID },
        userId: { type: 'int' },
        comment: { type: 'string' }
    }
};


export const newFeedTicketSchema = {
    name: schemaType.NEWFEED_TICKET_SCHEMA,
    primaryKey: 'eventId',
    properties: {
        ticketId: { type: 'int' },
        eventId: { type: 'int' },
        assetId: { type: 'int' },
        customerId: { type: 'int' },
        feedType: { type: 'string' },
        ticketState: { type: 'string' },
        ticketAssignedTo: { type: 'string' },
        ticketAssignedToId: { type: 'int?' },
        ticketClosedBy: { type: 'int' },
        tickeAssignee: { type: 'int' },
        ticketAssignName: { type: 'string' },
        ticketReopenedDate: { type: 'double?' },
        ticketCreatedDate: { type: 'double?' },
        ticketDueDate: { type: 'double?' },
        lastUpdated: { type: 'double?' },
        ticketPriority: { type: 'int' },
        checkupResult: { type: 'string?' },
        diagnosis: { type: 'int' },
        hasFeedback: { type: 'string' },
        notes: { type: 'string?' },
        assetTag: { type: 'string' },
        assetType: { type: 'string' },
        assetAddress: { type: 'string' },
        customerType: { type: 'string'},
        follow: { type: 'int' },
        ticketComments: { type: 'list', objectType: schemaType.NEWFEED_TICKET_COMMENTS },
        eventComments: { type: 'list', objectType: schemaType.NEWFEED_TICKET_EVENT_COMMENTS },
        prognosisDetails1: { type: 'string?' }
    }
};