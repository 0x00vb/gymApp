import {React, useEffect, useState} from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import DropdownSelect from 'react-native-input-select';
import { useSQLiteContext } from "expo-sqlite/next";

const ProgressChart = () => {
  const [exercisesList, setExercisesList] = useState([]);
  const [selectExercise, setSelectedExercise] = useState(null);
  const [selectedExerciseData, setSelectedExerciseData] = useState([]);
  const [timeScale, setTimeScale] = useState(1); // 1 month

  const db = useSQLiteContext();

  useEffect(() => {
    const getExercises = async () => {
      const response = await db.getAllAsync('SELECT DISTINCT exercise_name FROM Exercises');
      setExercisesList(response.map(item => item.exercise_name));
    };
    getExercises();
  }, [setExercisesList])

  // Function to filter logs based on time scale (e.g., 1, 3, 6, 12 months)
  const filterLogsByTimeScale = (logs) => {
    // Filter logs based on the selected time scale
    const currentDate = new Date();
    const filteredLogs = logs.filter(log => {
      const logDate = new Date(log.date);
      const timeDiff = currentDate.getTime() - logDate.getTime();
      const monthsDiff = timeDiff / (1000 * 3600 * 24 * 30); // Calculate months difference
      return monthsDiff <= timeScale;
    });
    return filteredLogs;
  }
  const weights = 0;
  const getExerciseLogsData = async (exerciseName) => {
    setSelectedExercise(exerciseName);
    try{
        const response = await db.getAllAsync(
          'SELECT * FROM Logs WHERE exercise_id IN (SELECT id FROM Exercises WHERE exercise_name = ?)',
          [exerciseName]
        );
        const timeFilteredResults = filterLogsByTimeScale(response);
        setSelectedExerciseData(timeFilteredResults);
    }catch(e){
      console.log('Error fetching exercise data: ', e);
    }
  }

  return (
    <View>
      <View style={{width: '100%', flexDirection: 'row', marginBottom: -20, gap: 10}}>
        <Text style={{fontSize: 20, fontWeight: '600'}}>Progress Chart</Text>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
          <DropdownSelect
          dropdownContainerStyle={{width: 'auto'}}
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
            placeholder='Exercise'
            options={
              exercisesList.map(exercise => ({
                value: exercise,
                label: exercise
              }))
            }
            onValueChange={(exerciseName) => getExerciseLogsData(exerciseName)}
            selectedValue={selectExercise}
          />
          <DropdownSelect
            dropdownStyle={{width: 80, minHeight: 20, paddingVertical: 0,paddingHorizontal: 0, alignItems: 'center', marginLeft: 0}}
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
            placeholder='Select time scale'
            options={[
              { value: 1, label: '1 Month' },
              { value: 3, label: '3 Months' },
              { value: 6, label: '6 Months' },
              { value: 12, label: '12 Months' }
            ]}
            onValueChange={(value) => setTimeScale(value)}
            selectedValue={timeScale}
          />
        </View>
      </View>
      <LineChart
        data={{
          labels: selectedExerciseData.map(log => log.date),
          datasets: [
            {
              data: weights.length > 0 ? weights : [0]
            }
          ]
        }}
        width={Dimensions.get("window").width - 40} // from react-native
        height={220}
        yAxisSuffix="Kg"
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
    width: 80,
    minHeight: 20,
    paddingVertical: 0,
    paddingHorizontal: 0,
    alignItems: 'center',
  }
})

export default ProgressChart;