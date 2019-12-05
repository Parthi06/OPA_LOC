import * as schemaTypes from './schemaTypes';

//indicates date time when the later upgrade window is displayed.
export const Force_Upgrade = {
    name: schemaTypes.FORCE_UPGRADE,
    properties: {
        upgradionWindowDisplayedDateTime: { type: 'double' } 
    }
};



