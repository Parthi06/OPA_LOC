import * as schemaType from './schemaTypes';

export const CustomerInterventionTimeline = {
    name: schemaType.CUSTOMER_ASSET_INTERVENTION_TIMELINE,
    properties: {
        ticketId: { type: 'int' },
        checkupTime: { type: 'double?' },
        checkupResult: { type: 'string?' },
        checkupFaultDiagnosisEnum: { type: 'int?' },
        override: { type: 'string?' },
        notes: { type: 'string?' },
        dateTime: { type: 'double?' }
    }
};

export const AssociatedTicketIdsAndStatus = {
    name: schemaType.ASSOCIATED_TICKETIDS_AND_STATUS,
    properties: {
        id: { type: 'string?' },
        status: { type: 'string?' }
    }
};


export const CustomerAssetListSchema = {
    name: schemaType.CUSTOMER_ASSET_LIST,
    primaryKey: 'assetId',
    properties: {
        assetId: { type: 'int', indexed: true },
        customerId: { type: 'int' },
        assetType: { type: 'string?' },
        assetTag: { type: 'string?' },
        assetAddress: { type: 'string?' },
        datetimeAssetAdded: { type: 'double?' },
        assetState: { type: 'string?' },
        prognosisSummary1: { type: 'string?' },
        prognosisDetails1: { type: 'string?' },
        override: { type: 'string?' },
        checkupTime: { type: 'double?' },
        checkupResult: { type: 'string?' },
        checkupFaultDiagnosisEnum: { type: 'int?' },
        ticketIdAndStatus :{  type: schemaType.ASSOCIATED_TICKETIDS_AND_STATUS  + "[]"  },
        customerName: { type: 'string?', default: '' },
        interventionTimeline: { type: schemaType.CUSTOMER_ASSET_INTERVENTION_TIMELINE + "?" },
        prognosisTimelineDataTime: { type: 'double?' },
        prognosisTimelineNote: { type: 'string?' }
    }
};

