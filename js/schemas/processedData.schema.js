// {
//     "moteId": 20,
//     "assetId": 27,
//     "locationLabel": "cover",
//     "dateTime": 1528833281000,
//     "lineGraphParams": [
//         "Temperature",
//         "RMS Acc",
//         "Peak-to-Avg Acc"
//     ],
//     "graphs": {
//         "lineGraph": [
//             {
//                 "param": "Peak-to-Avg Acc",
//                 "y": "2.2",
//                 "label": "",
//                 "opacity": "",
//                 "x": 1528833281000,
//                 "densityValue": ""
//             }
//         ],
//         "bubbleGraph": [
//             {
//                 "param": "",
//                 "y": "707.1",
//                 "label": "14.0x:BLADE_PASS",
//                 "opacity": "0.033",
//                 "x": 1528833281000,
//                 "densityValue": "0.033"
//             }
//         ]
//     }
// }

import * as schemaType from './schemaTypes';


export const processedGraphsPoints = {
    name: schemaType.PROCCESED_GRAPHS_POINTS,
    properties: {
        param: { type: 'string?' },
        y: { type: 'string?' },
        label: { type: 'string?' },
        opacity: { type: 'string?' },
        x: { type: 'double?' },
        densityValue: { type: 'string?' },
    }
};

export const processedGraphs = {
    name: schemaType.PROCCESED_GRAPHS,
    properties: {
        lineGraph: { type: 'list', objectType: schemaType.PROCCESED_GRAPHS_POINTS },
        bubbleGraph: { type: 'list', objectType: schemaType.PROCCESED_GRAPHS_POINTS },
    }
};
//     "graphs": {
//         "lineGraph": [

export const processedGraphDataSchema = {
    name: schemaType.PROCESSED_GRAPH_DATA,
    primaryKey: 'assetId',
    properties: {
        moteId: { type: 'int' },
        assetId: { type: 'int' },
        locationLabel: { type: 'string?' },
        dateTime: { type: 'double?' },
        lineGraphParams: { type: 'string?[]' },
        graphs: { type: schemaType.PROCCESED_GRAPHS },
        state: { type: 'string?' }
    }
};

