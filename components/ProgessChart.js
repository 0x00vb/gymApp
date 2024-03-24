import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const ProgressChart = () => {
  return (
    <View>
      <View style={{flexDirection: 'row', gap: 15, alignItems: 'center'}}>
        <Text style={{fontSize: 20, fontWeight: '500'}}>Progress Chart</Text>
        <Text style={{backgroundColor: "#FDFDFD",fontSize: 18, borderRadius: 10, padding: 3}}>
          Bench Press
        
        </Text>
      </View>
      <LineChart
        data={{
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [
            {
              data: [
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100
              ]
            }
          ]
        }}
        width={Dimensions.get("window").width - 40} // from react-native
        height={220}
        yAxisLabel="$"
        yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#D9D9D9",
          backgroundGradientFrom: "#D9D9D9",
          backgroundGradientTo: "#F1F1F1",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(33, 126, 194, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(33, 126, 194, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#FFFFFF"
          }
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />
    </View>
  )
}

export default ProgressChart;