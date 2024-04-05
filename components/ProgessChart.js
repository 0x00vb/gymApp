import {React, useEffect, useState} from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import DropdownSelect from 'react-native-input-select';
import { useSQLiteContext } from "expo-sqlite/next";


const ProgressChart = () => {
  const [exercisesList, setExercisesList] = useState([]);
  const [selectExercise, setSelectedExercise] = useState(null);
  const [selectedExerciseData, setSelectedExerciseData] = useState([]);
  
  const db = useSQLiteContext();

  useEffect(() => {
    const getExercises = async () => {
      const response = await db.getAllAsync('SELECT DISTINCT exercise_name FROM Exercises');
      setExercisesList(response.map(item => item.exercise_name));
    };
    getExercises();
  }, [setExercisesList])

  const getExerciseData = async (exerciseName) => {
    try{
      await db.withTransactionAsync(async () => {
        await db.getAllAsync(
          'SELECT * FROM Exercises WHERE exercise_name = ?',
          [exerciseName]
        )
      })
    }catch(e){
      console.log('Error fetching exercise data: ', e);
    }
  }

  return (
    <View>
      <View style={{flexDirection: 'row', gap: 15, marginBottom: -20}}>
        <Text style={{fontSize: 20, fontWeight: '500'}}>Progress Chart</Text>
        <DropdownSelect
          dropdownStyle={styles.dropdown}
          placeholderStyle={{fontSize: 16}}
          selectedItemStyle={{fontSize: 16}}
          checkboxControls={{
            checkboxLabelStyle: {
              fontSize: 18,
              paddingBottom: 5,
            },
            checkboxStyle: {
              backgroundColor: '#228CDB',
              borderColor: '#228CDB',
            },
            checkboxSize: 18
          }}
          dropdownIconStyle={{opacity: 0}}
          placeholder='Select an exercise'
          options={
            exercisesList.map(exercise => ({
              value: exercise,
              label: exercise
            }))
          }
          onValueChange={(x) => setSelectedExercise(x)}
          selectedValue={selectExercise}
        />
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

const styles = StyleSheet.create({
  dropdown: {
    width: 200,
    minHeight: 30,
    paddingVertical: 0,
    paddingHorizontal: 0,
    alignItems: 'center'
  }
})

export default ProgressChart;