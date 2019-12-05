import * as schemaType from './schemaTypes';

export const UserListSchema = {
    name: schemaType.USERLIST_SCHEMA,
    primaryKey: 'userId',
    properties: {
        userDetailsId: { type: 'int', indexed: true },
        userId: { type: 'int' },
        tenantId: { type: 'int' },
        firstName: { type: 'string?' },
        lastName: { type: 'string?' },
        userProfilePic: { type: 'string?' },
        userType: { type: 'string?' },
        userState: { type: 'string?' },
        location: { type: 'string?' },
        lastActiveDatetime: { type: 'double?' }
    }
};
