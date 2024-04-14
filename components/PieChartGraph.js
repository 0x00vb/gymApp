import {React, useEffect, useState} from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useSQLiteContext } from "expo-sqlite/next";
const data = [
    { name: 'Seoul', population: 21500000, color: 'rgba(131, 167, 234, 1)', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Toronto', population: 2800000, color: '#F00', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Beijing', population: 527612, color: 'red', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'New York', population: 8538000, color: '#ffffff', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Moscow', population: 11920000, color: 'rgb(0, 0, 255)', legendFontColor: '#7F7F7F', legendFontSize: 15 }
]
const PieChartGraph = () => {
    return(
        <View>
        <View>
            <Text style={{fontSize: 20, fontWeight: '600'}}>
                Favorite execises
            </Text>
        </View>
            <PieChart
                data={data}
                width={Dimensions.get("window").width - 40} // from react-native
                height={220}
                hasLegend={true}
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
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}                 
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
                />  
        </View>
    )
}

const styles = StyleSheet.create({

})

export default PieChartGraph;