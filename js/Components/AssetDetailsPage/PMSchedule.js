import React from "react";
import { View, ScrollView,StyleSheet,Alert } from "react-native";
import { Col, Row } from 'react-native-easy-grid';
import { Thumbnail, Text } from 'native-base';
import SectionSeparator from '../General/SectionSeparator';




function PMScheduleTable(title, colNames,alignmentRules,values) {
  this.title = title || 'PM Schedule';
  this.colNames = colNames || [];
  this.alignmentRules = alignmentRules || [];
  this.values = values || new Array();
}

function PMSchedule({ pm_schedule }) {
    let pmScheduleTables = [];
    let data = [];
    let table = null;
    let sectionHeader = [];
    let colHeadings =[];
    let alignmentRules =[];
    let tableValues = new Array();
    let minHeightValue = 30;

    /* Ticket - 227 set minimum height for each row inside table */
    getMinHeight = ( firstColumnData ) =>{
        let large = 0;
        firstColumnData.forEach(element => {
            if( large < element.length ){
                large = element.length;
            }
        });
        if( large> 45){
            minHeightValue = minHeightValue + 40;
        }else if ( large > 30 ){
             minHeightValue = minHeightValue + 30;
        }else if( large > 20 ) {
             minHeightValue = minHeightValue + 20;
        }else if( large > 10 ) {
            minHeightValue = minHeightValue + 10;
       }   
    };
    //Ticket #158 Display of customer custom info on Asset details
    //Ticket #174 PM Schedule table
    try {
        table = JSON.parse(pm_schedule).table;
    }
    catch(e)
    {
        return [];
    }
    if (!Array.isArray(table)){
        data.push(table);
    }else{
        data = table;
    }
    for (let i = 0; i < data.length; i++) {
       
        sectionHeader[i] =  Object.keys(data[i]);
        colHeadings = data[i][sectionHeader[i][0]].col_name;
        alignmentRules = data[i][sectionHeader[i][0]].align;
        tableValues  = data[i][sectionHeader[i][0]].values;
        var pmScheduleTable = new PMScheduleTable(sectionHeader[i][0],colHeadings,alignmentRules,tableValues);
        pmScheduleTables.push(pmScheduleTable);
        getMinHeight( tableValues[0] ); 
    }
        pmScheduleTables =
            <View>
               { pmScheduleTables.map((table,index) => 
                <View key={index}>
               
                    <Row  style={{ paddingTop:4}}></Row> 
                    <SectionSeparator sectionHeader ={table.title} index={index}/> 
                    <Row  style={{ paddingTop:4}}></Row> 
                    <Row size={1} style={{ borderWidth: 0.8, borderColor: 'black',paddingVertical:3,backgroundColor:'#CEDDE1'}}>
                                {table.colNames.map((colHeader, colHeaderIndex) =>
                                    <Col key={colHeaderIndex} style={{ justifyContent: "center", alignItems: "center", borderRightWidth: 0.8 }} size={1}>
                                        <Text key={colHeaderIndex} style={{ fontWeight: 'bold', textAlign: 'center' }}>{colHeader}</Text>
                                    </Col>
                                  )}
                                                               
                    </Row>  
                    <Row size={1} style={{ borderWidth: 0.8, borderColor: 'black' ,backgroundColor:'#E2ECEE'}}>
                                 {table.values.map((colData, colIndex) =>
                                 <Col size={1} key={colIndex} style={{ borderColor: 'blue' }}>
                                 {
                                     colData.map((data, index) =>
                                        <Row key={colIndex +" "+index} style={[ {minHeight:minHeightValue} ,table.alignmentRules[colIndex] === "L"? 
                                        styles.alignLeftTrue:table.alignmentRules[colIndex] === "R"?styles.alignRightTrue:styles.alignCenterTrue]} size={1}>
                                           
                                            {((data === 'R' || data === 'G' || data === 'Y')  && (table.colNames[colIndex] === 'Severity'|| table.colNames[colIndex] === 'severity'))? 

                                                <Thumbnail key={colIndex + '_' + index} style={{ height: 20, width: 20 }} small
                                                source={(data === "Y") ? require("../AssetList/Images/checkupAsset.png") :
                                                        (data === "R") ? require("../AssetList/Images/emergencyAsset.png") :
                                                        (data === "G") ? require("../AssetList/Images/goodAsset.png") : null}/> :
                                                        (data && data != null && data != undefined) ?
                                                    <Text key={colIndex + '_' + index}> {data}</Text> : <Text key={colIndex + '_' + index}>-</Text>}
                                            
                                        </Row>
                                        
                                        )
                                 }
                                </Col>
                                )
                              
                                }           
                    </Row>                 
                </View>

               )
               }
            
            </View >
 //   }

    return (
        <View style={{ padding: 5 }}>
            {pmScheduleTables}
        </View>
    );
}


export default PMSchedule;

const styles = StyleSheet.create({
    alignCenterTrue: {
       justifyContent: "center", alignItems: "center", borderRightWidth: 0.8   
    },
    alignRightTrue: {
        justifyContent: "flex-end", alignItems:"center",  borderRightWidth: 0.8, paddingRight:2.5       
    },
    alignLeftTrue: {
        justifyContent: "flex-start", alignItems: "center", borderRightWidth: 0.8,paddingLeft:2.5 
    },
    alignCenterFalse: {
        borderRightWidth: 0.8
    }
});