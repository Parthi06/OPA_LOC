import * as schemaType from './schemaTypes';


export const LineGraph = {
    name: schemaType.ASSET_LINE_GRAPH,
    properties: {
        param: { type: 'string?' },
        y: { type: 'string?' },
        label: { type: 'string?' },
        opacity: { type: 'string?' },
        x: { type: 'double?' },
        densityValue: { type: 'string?' }
    }
};


export const BubbleGraph = {
    name: schemaType.ASSET_BUBBLE_GRAPH,
    properties: {
        param: { type: 'string?' },
        y: { type: 'string?' },
        label: { type: 'string?' },
        opacity: { type: 'string?' },
        x: { type: 'double?' },
        densityValue: { type: 'string?' }
    }
};



export const AssetDetailsSchema = {
    name: schemaType.ASSET_DETAILS_SCHEMA,
    primaryKey: 'assetId',
    properties: {
        moteId: { type: 'int' },
        assetId: { type: 'int', indexed: true },
        locationLabel: { type: 'string?' },
        dateTime: { type: 'double?' },
        lineGraphParams: { type: 'string?[]' },
        graphs: {
            lineGraph: { type: 'ASSET_LINE_GRAPH?[]' },
            bubbleGraph: []
        }
    }
};
