import * as schemaTypes from './schemaTypes';

export const AssetOperationlInfo = {
    name: schemaTypes.ASSET_OPERATIONAL_INFO,
    primaryKey: 'assetId',
    properties: {
        assetId: 'int',
        state: 'int?',
        dateTimeState: { type: 'double?' },
        cumulativeActive: { type: 'double?' },
        cumulativeInactive: { type: 'double?' },
        lastState: 'int?',
        dateTimeLastState: { type: 'double?' },
        stateStr: 'string?',
        lastStateStr: 'string?',
        customInfo: 'string?'
    }
};
