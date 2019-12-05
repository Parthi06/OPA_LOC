import * as schemaTypes from './schemaTypes';

export const FeedbackHistorySchema = {
    name: schemaTypes.FEEDBACK_HISTORY,
    properties: {
        assetId: 'int',
        dateTime: { type: 'double' },
        checkupTime: { type: 'double' },
        checkupResult: { type: 'string?', default: "" },
        checkupFaultDiagnosisEnum: 'int',
        override: { type: 'string?', default: "" },
        notes: { type: 'string?', default: "" },
        ticketId: { type: 'int', indexed: true }
    }
};



