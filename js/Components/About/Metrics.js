import React from "react";
import { Accordion } from "native-base";

export default Metrics = (props) => { 
    return (
            <Accordion 
                style={{border:0}}
                dataArray={props.dataArray}
                headerStyle={{ backgroundColor: "transparent", padding:15, borderBottomWidth: 1, borderColor: '#c8c7cc' }}
                contentStyle={{ backgroundColor: "#dfdfec", padding:15 }}
                //icon="add"// shows plus icon
                //expandedIcon="remove" //shows minus icon
                iconStyle={{ color: "black" }}
                expandedIconStyle={{ color: "black" }}
            />
    )
  }
