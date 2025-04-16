import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Stopwatch } from 'react-native-stopwatch-timer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const StopWatch = () => {
  const [stopwatchStart, setStopwatchStart] = useState(false);
  const [stopwatchReset, setStopwatchReset] = useState(false);
  const [displayTime, setDisplayTime] = useState('00:00');

  const toggleStopwatch = () => {
    setStopwatchStart(prev => !prev);
    setStopwatchReset(false);
  };

  const resetStopwatch = () => {
    setStopwatchStart(false);
    setStopwatchReset(true);
    setDisplayTime('00:00');
  };

  return (
    <View style={styles.container}>
      {/* Hidden Stopwatch just to drive time updates */}
      <Stopwatch
        start={stopwatchStart}
        reset={stopwatchReset}
        options={{ container: { display: 'none' } }} // Hide the original display
        msecs={false}
        getTime={(time) => {
          const [, mm, ss] = time.split(':'); // Ignore hours
          setDisplayTime(`${mm}:${ss}`);
        }}
      />
      
      {/* Custom time display */}
      <Text style={styles.timeText}>{displayTime}</Text>

      <View style={styles.controls}>
        <TouchableOpacity onPress={toggleStopwatch} style={styles.controlBtn}>
          <Text style={styles.controlText}>
            {
            stopwatchStart ?           
              <Icon name="pause" size={24} color="#fff" />
                : 
                <Icon name="play" size={24} color="#fff" />

              }
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={resetStopwatch} style={styles.controlBtn}>
          <Icon name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  timeText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 0,
  },
  controls: {
    flexDirection: 'row',
    gap: 10,
  },
  controlBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#2f2f2f',
  },
});

export default StopWatch;
