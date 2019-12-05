import React from "react";
import {VictoryVoronoiContainer,VictoryChart,VictoryScatter,VictoryAxis} from "victory-native";
import {View,Text} from "react-native";
import ChartPoint from './ChartPoint';

export default class BubbleGraph extends React.Component {


  constructor(props,context)
  {
    super(props,context);
  }

  render () {

    return (
      <View>
      {this.props.moteFrequencyData.length < 1?<Text note>{"\nSpectral Analysis Graph - Not Available"}</Text>:
      <View>
      <Text>Spectral Analysis: Dominant Frequencies</Text>

      <VictoryChart domain={this.props.zoomDomain} domainPadding={{x:100,y:30}} scale={{ x: "time" }} fixLabelOverlap={true}
            containerComponent={<VictoryVoronoiContainer
             labels={(d) => (d.y)}
             labelComponent={<ChartPoint chartType={1}/>}
            />}>
            <VictoryAxis dependentAxis label="Freq[Hz])" style={{
              axis: {stroke: "#756f6a"},
              axisLabel: { padding: 37},
              grid: {stroke: "#EDFBFD"},
              ticks: {stroke: "grey", size: 5},
              tickLabels: {padding: 5}
            }}/>
           <VictoryAxis label="Time" style={{
             axis: {stroke: "#756f6a"},
             axisLabel: { padding: 30},
             grid: {stroke: "#EDFBFD"},
             ticks: {stroke: "grey", size: 5},
             tickLabels: {paddingRight:5,angle: -35 }
           }} />
          <VictoryScatter
            style={{ data: { fill: "#c43a31" } }}
             size={7}
             fixLabelOverlap={true}
             data={this.props.moteFrequencyData}
         />
        </VictoryChart>
        </View>
       }
      </View>
      );

  }

}
