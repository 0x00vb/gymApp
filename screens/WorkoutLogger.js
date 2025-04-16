import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  SafeAreaView,
  TextInput,
  Animated,
  Easing
} from 'react-native';
import { useDatabase } from "../context/DatabaseContext";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from 'react-native-modal';

const WorkoutLogger = ({ route, navigation }) => {
  const { title, subtitle, workoutDay_id } = route.params;
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [sets, setSets] = useState([]);
  const [viewMode, setViewMode] = useState('current'); // 'current' or 'history'
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [quickLog, setQuickLog] = useState({ weight: '', reps: '' });
  const [history, setHistory] = useState([]);
  
  // Animation values
  const setAddedAnimation = useState(new Animated.Value(0))[0];
  
  const db = useDatabase();
  
  useEffect(() => {
    loadExercises();
  }, []);
  
  const loadExercises = async () => {
    try {
      const response = await db.executeQuery(
        'SELECT * FROM Exercises WHERE workout_day_id = ? ORDER BY exercise_name ASC', 
        [workoutDay_id]
      );
      setExercises(response);
      if (response.length > 0 && !currentExercise) {
        setCurrentExercise(response[0]);
        loadSets(response[0].id);
      }
    } catch (error) {
      console.error('Error loading exercises:', error);
    }
  };
  
  const loadSets = async (exerciseId) => {
    try {
      // Get today's sets
      const today = new Date().toISOString().split('T')[0];
      const setsResponse = await db.executeQuery(
        'SELECT * FROM Logs WHERE exercise_id = ? AND date = ? ORDER BY id DESC',
        [exerciseId, today]
      );      
      setSets(setsResponse);
    } catch (error) {
      console.error('Error loading sets:', error);
    }
  };
  
  const loadHistory = async (exerciseId) => {
    try {
      // Get all workout dates for this exercise
      const datesResponse = await db.executeQuery(
        `SELECT DISTINCT date FROM Logs 
         WHERE exercise_id = ? 
         ORDER BY date DESC 
         LIMIT 15`,
        [exerciseId]
      );
      
      // For each date, get all sets
      const historyData = [];
      for (const dateRecord of datesResponse) {
        const setsForDate = await db.executeQuery(
          'SELECT * FROM Logs WHERE exercise_id = ? AND date = ? ORDER BY id ASC',
          [exerciseId, dateRecord.date]
        );
        
        // Don't include today's data in history
        const today = new Date().toISOString().split('T')[0];
        if (dateRecord.date !== today && setsForDate.length > 0) {
          historyData.push({
            date: dateRecord.date,
            sets: setsForDate
          });
        }
      }
      
      setHistory(historyData);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };
  
  const addSet = async () => {
    if (!quickLog.weight || !quickLog.reps) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      await db.executeRun(
        'INSERT INTO Logs (exercise_id, date, weights, reps) VALUES (?, ?, ?, ?)',
        [currentExercise.id, today, quickLog.weight, quickLog.reps]
      );
      
      // Refresh sets
      await loadSets(currentExercise.id);
      
      // Play animation
      setAddedAnimation.setValue(0);
      Animated.timing(setAddedAnimation, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      }).start();
      
      // Clear input
      setQuickLog({ weight: '', reps: '' });
    } catch (error) {
      console.error('Error adding set:', error);
    }
  };
  
  const removeSet = async (setId) => {
    try {
      await db.executeRun('DELETE FROM Logs WHERE id = ?', [setId]);
      // Refresh
      loadSets(currentExercise.id);
    } catch (error) {
      console.error('Error removing set:', error);
    }
  };
  
  const addExercise = async () => {
    if (!newExerciseName.trim()) return;
    
    try {
      await db.executeRun(
        'INSERT INTO Exercises (workout_day_id, exercise_name) VALUES (?, ?)',
        [workoutDay_id, newExerciseName.toLowerCase().trim()]
      );
      
      // Refresh and reset
      await loadExercises();
      setNewExerciseName('');
      setShowAddExercise(false);
    } catch (error) {
      console.error('Error adding exercise:', error);
    }
  };
  
  const selectExercise = (exercise) => {
    setCurrentExercise(exercise);
    loadSets(exercise.id);
    setViewMode('current');
  };
  
  const toggleHistoryView = async () => {
    if (viewMode === 'history') {
      setViewMode('current');
    } else {
      setViewMode('history');
      await loadHistory(currentExercise.id);
    }
  };
  
  const renderExerciseTab = ({ item }) => {
    const isActive = currentExercise && item.id === currentExercise.id;
    
    return (
      <TouchableOpacity
        style={[styles.exerciseTab, isActive && styles.activeExerciseTab]}
        onPress={() => selectExercise(item)}
      >
        <Text style={[styles.exerciseTabText, isActive && styles.activeExerciseTabText]}>
          {item.exercise_name}
        </Text>
      </TouchableOpacity>
    );
  };
  
  const renderSet = ({ item, index }) => {
    const isLatestSet = index === 0;
    const animatedStyle = isLatestSet ? {
      opacity: setAddedAnimation,
      transform: [{ 
        translateY: setAddedAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 0]
        })
      }]
    } : {};
    
    const updateSetField = async (setId, field, value) => {
        try {
          await db.executeRun(
            `UPDATE Logs SET ${field} = ? WHERE id = ?`,
            [value, setId]
          );
          loadSets(currentExercise.id);
        } catch (error) {
          console.error('Error updating set:', error);
        }
    };
      

    return (
      <Animated.View style={[styles.setRow, animatedStyle]}>
        <View style={styles.setNumber}>
          <Text style={styles.setNumberText}>{sets.length - index}</Text>
        </View>
        <View style={styles.setDetails}>
        <TextInput
            style={styles.setWeightText}
            keyboardType="numeric"
            value={item.weights.toString()}
            onChangeText={(text) => updateSetField(item.id, 'weights', text)}
            />
        <TextInput
            style={styles.setRepsText}
            keyboardType="numeric"
            value={item.reps.toString()}
            onChangeText={(text) => updateSetField(item.id, 'reps', text)}
        />
        </View>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeSet(item.id)}
        >
          <Icon name="close-circle" size={22} color="#ff4d4d" />
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyCard}>
      <Text style={styles.historyDate}>
        {new Date(item.date).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short', 
          day: 'numeric'
        })}
      </Text>
      
      {item.sets.map((set, idx) => (
        <View key={set.id} style={styles.historySetRow}>
          <Text style={styles.historySetNumber}>{idx + 1}</Text>
          <Text style={styles.historySetWeight}>{set.weights} kg</Text>
          <Text style={styles.historySetReps}>{set.reps} reps</Text>
        </View>
      ))}
      
      <View style={styles.historySummary}>
        <Text style={styles.historySummaryText}>
          Total: {item.sets.length} sets • Max: {Math.max(...item.sets.map(s => s.weights))} kg
        </Text>
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        </View>
      </View>
      
      {/* Exercise Tabs */}
      <View style={styles.exerciseTabs}>
        <FlatList
          data={exercises}
          renderItem={renderExerciseTab}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.exerciseTabsContent}
        />
        <TouchableOpacity 
          style={styles.addExerciseButton}
          onPress={() => setShowAddExercise(true)}
        >
          <Icon name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {/* Add Exercise Input */}
      <Modal
        isVisible={showAddExercise}
        onBackdropPress={() => setShowAddExercise(false)}
        style={{ justifyContent: 'flex-end', margin: 0 }}
        backdropOpacity={0.5}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        >
        <View style={{
            backgroundColor: '#121212',
            padding: 20,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
        }}>
            <TextInput
            style={styles.addExerciseInput}
            placeholder="New exercise name"
            value={newExerciseName}
            onChangeText={setNewExerciseName}
            autoFocus
            />
            <View style={styles.addExerciseActions}>
            <TouchableOpacity 
                style={styles.addExerciseCancel}
                onPress={() => setShowAddExercise(false)}
            >
                <Text style={styles.actionButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.addExerciseConfirm}
                onPress={addExercise}
            >
                <Text style={styles.actionButtonText}>Add</Text>
            </TouchableOpacity>
            </View>
        </View>
        </Modal>      
      {currentExercise && (
        <>
          {/* View Toggle */}
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[
                styles.viewToggleButton, 
                viewMode === 'current' && styles.activeViewToggleButton
              ]}
              onPress={() => setViewMode('current')}
            >
              <Text style={[
                styles.viewToggleText,
                viewMode === 'current' && styles.activeViewToggleText
              ]}>Today</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.viewToggleButton, 
                viewMode === 'history' && styles.activeViewToggleButton
              ]}
              onPress={toggleHistoryView}
            >
              <Text style={[
                styles.viewToggleText,
                viewMode === 'history' && styles.activeViewToggleText
              ]}>History</Text>
            </TouchableOpacity>
          </View>
          
          {viewMode === 'current' ? (
            <>
              {/* Quick Log */}
              <View style={styles.quickLogContainer}>
                <View style={styles.quickLogInputs}>
                  <View style={styles.quickLogField}>
                    <Text style={styles.quickLogLabel}>Weight (kg)</Text>
                    <TextInput
                      style={styles.quickLogInput}
                      placeholder="0"
                      keyboardType="numeric"
                      value={quickLog.weight}
                      onChangeText={value => setQuickLog({...quickLog, weight: value})}
                    />
                  </View>
                  
                  <View style={styles.quickLogField}>
                    <Text style={styles.quickLogLabel}>Reps</Text>
                    <TextInput
                      style={styles.quickLogInput}
                      placeholder="0"
                      keyboardType="numeric"
                      value={quickLog.reps}
                      onChangeText={value => setQuickLog({...quickLog, reps: value})}
                    />
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.addSetButton}
                  onPress={addSet}
                >
                  <Icon name="add-circle" size={28} color="#fff" />
                  <Text style={styles.addSetButtonText}>Log Set</Text>
                </TouchableOpacity>
              </View>
              
              {/* Sets List */}
              <View style={styles.setsContainer}>
                <Text style={styles.setsTitle}>
                  Today's Sets · {sets.length > 0 ? sets.length : 'None yet'}
                </Text>
                
                {sets.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Icon name="barbell-outline" size={48} color="#8e9eb5" />
                    <Text style={styles.emptyStateText}>Add your first set</Text>
                  </View>
                ) : (
                  <FlatList
                    data={sets}
                    renderItem={renderSet}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.setsList}
                  />
                )}
              </View>
            </>
          ) : (
            <View style={styles.historyContainer}>
              {history.length === 0 ? (
                <View style={styles.emptyState}>
                  <Icon name="time-outline" size={48} color="#8e9eb5" />
                  <Text style={styles.emptyStateText}>No workout history yet</Text>
                </View>
              ) : (
                <FlatList
                  data={history}
                  renderItem={renderHistoryItem}
                  keyExtractor={item => item.date}
                  contentContainerStyle={styles.historyList}
                />
              )}
            </View>
          )}
        </>
      )}
      
      {!currentExercise && !showAddExercise && (
        <View style={styles.noExercisesContainer}>
          <Icon name="barbell-outline" size={64} color="#8e9eb5" />
          <Text style={styles.noExercisesText}>No exercises yet</Text>
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => setShowAddExercise(true)}
          >
            <Text style={styles.startButtonText}>Add your first exercise</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#121212',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  backButton: {
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9e9e9e',
  },
  exerciseTabs: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  exerciseTabsContent: {
    paddingHorizontal: 8,
  },
  exerciseTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginHorizontal: 4,
    backgroundColor: '#2a2a2a',
  },
  activeExerciseTab: {
    backgroundColor: '#3384ff',
  },
  exerciseTabText: {
    color: '#e0e0e0',
    fontWeight: '500',
    fontSize: 15,
  },
  activeExerciseTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  addExerciseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3384ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    shadowColor: '#3384ff',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  addExerciseForm: {
    backgroundColor: '#121212',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  addExerciseInput: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
  },
  addExerciseActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  addExerciseCancel: {
    backgroundColor: '#404040',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  addExerciseConfirm: {
    backgroundColor: '#3384ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  viewToggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    margin: 4,
  },
  activeViewToggleButton: {
    backgroundColor: '#2a2a2a',
  },
  viewToggleText: {
    color: '#9e9e9e',
    fontWeight: '600',
    fontSize: 15,
  },
  activeViewToggleText: {
    color: '#fff',
  },
  quickLogContainer: {
    backgroundColor: '#121212',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  quickLogInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickLogField: {
    flex: 1,
    marginHorizontal: 4,
  },
  quickLogLabel: {
    color: '#9e9e9e',
    marginBottom: 6,
    fontWeight: '500',
  },
  quickLogInput: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3384ff',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 16,
    shadowColor: '#3384ff',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  addSetButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
  setsContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 16,
  },
  setsTitle: {
    color: '#e0e0e0',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  setsList: {
    paddingBottom: 24,
  },
  setRow: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  setNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3384ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#3384ff',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  setNumberText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  setDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  setWeightText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 16,
  },
  setRepsText: {
    color: '#9e9e9e',
    fontSize: 16,
    fontWeight: '500',
  },
  removeButton: {
    padding: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    color: '#9e9e9e',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  noExercisesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noExercisesText: {
    color: '#e0e0e0',
    fontSize: 20,
    marginVertical: 12,
  },
  startButton: {
    backgroundColor: '#3384ff',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: '#3384ff',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  startButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  historyContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 16,
  },
  historyList: {
    paddingBottom: 24,
  },
  historyCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  historyDate: {
    color: '#e0e0e0',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
    paddingBottom: 8,
  },
  historySetRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    alignItems: 'center',
  },
  historySetNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2a2a2a',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#9e9e9e',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 30,
    marginRight: 12,
  },
  historySetWeight: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  historySetReps: {
    width: 80,
    textAlign: 'right',
    color: '#9e9e9e',
    fontSize: 16,
  },
  historySummary: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  historySummaryText: {
    color: '#9e9e9e',
    fontSize: 14,
    fontWeight: '500',
  },
  setWeightText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 12,
    minWidth: 50,
    textAlign: 'center',
  },
  setRepsText: {
    color: '#fff',
    fontSize: 16,
    minWidth: 50,
    textAlign: 'center',
  },
  
});

export default WorkoutLogger;