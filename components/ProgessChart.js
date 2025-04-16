import {React, useEffect, useState} from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import DropdownSelect from 'react-native-input-select';
import { useDatabase } from "../context/DatabaseContext";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const calculate1RM = (weight, reps) => {
  return weight / (1.0278 - 0.0278 * reps);
}

const ProgressChart = () => {
  const [exercisesList, setExercisesList] = useState([]);
  const [selectExercise, setSelectedExercise] = useState(null);
  const [selectedExerciseData, setSelectedExerciseData] = useState([]);
  const [timeScale, setTimeScale] = useState(1); // 1 month

  const db = useDatabase();

  useEffect(() => {
    const getExercises = async () => {
      const response = await db.executeQuery('SELECT DISTINCT exercise_name FROM Exercises');
      setExercisesList(response.map(item => item.exercise_name));
    };
    getExercises();
  }, [setExercisesList])
  
  const filterLogsByTimeScale = logs => {
    const currentDate = new Date();
    const filteredLogs = logs.filter(log => {
      const [year, month, day] = log.date.split('/').map(Number); // Extract year, month, and day
      const logDate = new Date(Date.UTC(year, month - 1, day)); // Create Date object in UTC
      const timeDiff = currentDate.getTime() - logDate.getTime();
      const monthsDiff = timeDiff / (1000 * 3600 * 24 * 30); // Calculate months difference
      return monthsDiff <= timeScale;
    });
    return filteredLogs;
  };

  const getExerciseLogsData = async (exerciseName) => {
    setSelectedExercise(exerciseName);
    try{
        const response = await db.executeQuery(
          'SELECT * FROM Logs WHERE exercise_id IN (SELECT id FROM Exercises WHERE exercise_name = ?)',
          [exerciseName]
        );
        setSelectedExerciseData(response);
      }catch(e){
      console.log('Error fetching exercise data: ', e);
    }
  }

  const prepareChartData = (logs) => {
    // Extracting and sorting dates
    const datesWithWeightsReps = logs.map(log => {
      const [year, month, day] = log.date.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      const weights = log.weights.split('/').map(weight => parseFloat(weight));
      const reps = log.reps.split('/').map(rep => parseInt(rep));
      return { date, weights, reps };
    });
    datesWithWeightsReps.sort((a, b) => a.date - b.date); // Sort dates in ascending order
  
    // Formatting sorted dates and synchronizing weights and reps
    const labels = [];
    const weights = [];
    datesWithWeightsReps.forEach(item => {
      const month = item.date.getMonth() + 1;
      const day = item.date.getDate();
      labels.push(`${month}/${day}`);
      weights.push(item.weights);
    });
  
    // Prepare other chart data
    const oneRepMax = weights.map((weightArr, index) => {
      const repsForExercise = datesWithWeightsReps[index].reps;
      if (repsForExercise.length === 1) {
        return [calculate1RM(weightArr[0], repsForExercise[0])];
      } else {
        const oneRepMaxForExercise = repsForExercise.map((rep, repIndex) => {
          const weightIndex = Math.min(repIndex, weightArr.length - 1);
          return calculate1RM(weightArr[weightIndex], rep);
        });
        return oneRepMaxForExercise;
      }
    });
  
    const data = labels.map((label, index) => {
      const sum = oneRepMax[index].reduce((acc, val) => acc + val, 0);
      const average = sum / oneRepMax[index].length;
      return average;
    });
  
    return { labels, data: [data] };
  }
  
  useEffect(() => {
    if (selectedExerciseData.length > 0) {
      const filteredLogs = filterLogsByTimeScale(selectedExerciseData);
      const chartData = prepareChartData(filteredLogs);
      setChartData(chartData)
    }
  }, [selectedExerciseData, timeScale]);

  const [chartData, setChartData] = useState({ labels: [], data: [] });
  return (
    <View>
      <View style={{width: '100%', flexDirection: 'column', marginBottom: -20, gap: 10}}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <Text style={{fontSize: 20, fontWeight: '500', color: '#f8fafc'}}>Progress Chart</Text>
          <Icon name="chart-line-variant" size={24} color="#3C83F6" />
        </View>
        <View style={{ flexDirection:'row', alignItems: 'center', justifyContent: 'space-between', gap: 5}}>
          <View style={{flexShrink: 1}}>
            <DropdownSelect
            dropdownContainerStyle={{width: 130}}
              dropdownStyle={styles.dropdown}
              placeholderStyle={{fontSize: 16, fontWeight: '500', color: '#7f7f7f'}}
              selectedItemStyle={{fontSize: 16, fontWeight: '500', color: '#7f7f7f'}}
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
          </View>
          <View style={{ flexDirection: 'row', gap: 8}}>
            {[1, 3, 6, 12].map((val) => (
              <TouchableOpacity
                key={val}
                onPress={() => setTimeScale(val)}
                style={{
                  paddingVertical: 0,
                  paddingHorizontal: 12,
                  backgroundColor: timeScale === val ? '#3C83F6' : '#2f2f2f',
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    color: timeScale === val ? '#F7F7F7' : '#7F7F7F',
                    fontSize: 16,
                    fontWeight: timeScale === val ? 'bold' : 'normal',
                  }}
                >
                  {val}M
                </Text>
              </TouchableOpacity>
            ))}
          </View>

        </View>
      </View>
      <LineChart
        data={{
          labels: chartData.labels,
          datasets: [
            {
              data: chartData.data.length > 0 ? chartData.data[0] : [0]
            }
          ]
        }}
        width={Dimensions.get("window").width - 40} // from react-native
        height={220}
        yAxisSuffix="Kg"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "hsl(223, 84%, 3%)",
          backgroundGradientFrom: "hsl(223, 84%, 3%)",
          backgroundGradientTo: "hsl(222, 100.00%, 8.40%)",
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
    backgroundColor: '#2f2f2f',
    width: 80,
    minHeight: 20,
    paddingVertical: 0,
    paddingHorizontal: 0,
    alignItems: 'center',
  }
})

export default ProgressChart;