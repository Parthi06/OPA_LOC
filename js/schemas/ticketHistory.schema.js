import * as schemaType from './schemaTypes';

export const ticketHistorySchema = {
    name: schemaType.TICKET_HISTORY,
    primaryKey: 'id',
    properties: {
        id: { type: 'int' },
        userId1: { type: 'int?' },
        userId2: { type: 'int?' },
        ticketDate: { type: 'double?' },
        ticketState: { type: 'string?' },
        ticketId: { type: 'int' }
    }
};