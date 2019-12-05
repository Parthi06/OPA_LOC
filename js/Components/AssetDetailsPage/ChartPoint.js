import React from "react";
import { Point } from "victory-native";
import { G, Line, Text } from "react-native-svg";
import * as AppUtils from '../../Utils/AppUtils';

class ChartPoint extends React.Component {
  state = {

  };

  render() {
    const {
      x,
      y,
      datum,
      activeX
    } = this.props;
    let size = 0;
    let lineContent = null;

    size = 9;
    lineContent = (
      <G>

        <Line
          stroke="grey"
          strokeWidth="1"
          x1={x}
          x2={x}
          y1={y - 200}
          y2={y + 200}
        />
      </G>
    );
    //  }
    return (

      <G>
        {lineContent}
        <Point
          datum={datum}
          size={size}
          symbol={"circle"}
          x={x}
          y={y}
        />
        {(this.props.chartType == 1) ?
          <G>
            <Text x="150" y="10" fill="black" text-anchor="middle" alignment-baseline="central">{"Freq[Hz] : " + datum.y}</Text>
            <Text x="150" y="25" fill="black" text-anchor="middle" alignment-baseline="central">{"PSD[g^2/Hz] : " + datum.psd}</Text>
            <Text x="150" y="40" fill="black" text-anchor="middle" alignment-baseline="central">{"Label : " + datum.labelPoint}</Text>
            <Text x="150" y="55" fill="black" text-anchor="middle" alignment-baseline="central">{AppUtils.convertTimestampToDateTime(datum.x)}</Text>
          </G> :
          <G>
            <Text x="150" y="10" fill="black" text-anchor="middle" alignment-baseline="central">{this.props.paramName + " : " + datum.y + " " + ((datum.unit) ? datum.unit : "")}</Text> 
            <Text x="150" y="25" fill="black" text-anchor="middle" alignment-baseline="central">{AppUtils.convertTimestampToDateTime(datum.x)}</Text>
          </G>
        }

      </G>
    );
  }
}
export default ChartPoint;
