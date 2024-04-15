import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { Stopwatch, Timer } from 'react-native-stopwatch-timer';

const StopWatch = () => {
  const [timerStart, setTimerStart] = useState(false);
  const [stopwatchStart, setStopwatchStart] = useState(false);
  const [totalDuration] = useState(90000);
  const [timerReset, setTimerReset] = useState(false);
  const [stopwatchReset, setStopwatchReset] = useState(false);

  const toggleTimer = () => {
    setTimerStart(!timerStart);
    setTimerReset(false);
  }

  const resetTimer = () => {
    setTimerStart(false);
    setTimerReset(true);
  }

  const toggleStopwatch = () => {
    setStopwatchStart(!stopwatchStart);
    setStopwatchReset(false);
  }

  const resetStopwatch = () => {
    setStopwatchStart(false);
    setStopwatchReset(true);
  }

  return (
    <View style={{alignItems: 'center', width: "100%"}}>
      <Stopwatch
        laps
        start={stopwatchStart}
        reset={stopwatchReset}
        options={options}
      />
      <View style={{flexDirection: 'row', gap: 10, marginTop: 5}}>
        <TouchableHighlight onPress={toggleStopwatch} style={styles.controlBtn}>
            <Text style={{fontSize: 18, fontWeight: '600', color: '#fff'}}>{!stopwatchStart ? "Start" : "Stop"}</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={resetStopwatch} style={styles.controlBtn}>
            <Text style={{fontSize: 18, fontWeight: '600', color: '#fff'}}>Reset</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    controlBtn: {
    }
})

const options = {
  container: {
    backgroundColor: '#2d2d2d',
    padding: 5,
    borderRadius: 5,
  },
  text: {
    fontSize: 30,
    fontWeight: '500',
    color: '#FFF',
  }
};



export default StopWatch;