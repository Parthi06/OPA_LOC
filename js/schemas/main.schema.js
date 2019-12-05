import * as schemaType from './schemaTypes';
// Define your models and their properties

export const MainSchema = {
    name: schemaType.MAIN_SCHEMA,
    properties: {
        userFeed: { type: 'list', objectType: schemaType.USER_SCHEMA },
        assetFeed: { type: 'list', objectType: schemaType.ASSET_SCHEMA },
        ticketFeed: { type: 'list', objectType: schemaType.TICKET_SCHEMA }
    }
};
