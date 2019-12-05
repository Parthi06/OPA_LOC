import * as schemaType from './schemaTypes';
// Define your models and their properties

export const NewFeedSchema = {
    name: schemaType.NEWFEED_SCHEMA,
    properties: {
        userFeed: { type: 'list', objectType: schemaType.NEWFEED_USER_SCHEMA },
        assetFeed: { type: 'list', objectType: schemaType.NEWFEED_ASSET_SCHEMA },
        ticketFeed: { type: 'list', objectType: schemaType.NEWFEED_TICKET_SCHEMA }
    }
};
