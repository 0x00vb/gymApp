import React, { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Animated, TouchableWithoutFeedback } from 'react-native';
import Modal from 'react-native-modal'
import { useNavigation } from "@react-navigation/native";
import { useDatabase } from "../context/DatabaseContext";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import useDeleteButtonAnimation from "../hooks/useDeleteButtonAnimation";

import Topbar from "../components/Topbar";

const WorkoutSection = () => {
    const [workoutSplits, setWorkoutSplits] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newWorkoutSplit, setNewWorkoutSplit] = useState("");
    const [selectedDays, setSelectedDays] = useState([]);
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    const navigation = useNavigation();
    const db = useDatabase();

    const { longPressed, setLongPressed, animationProgress, showDeleteButton, hideDeleteButton } = useDeleteButtonAnimation();

    useEffect(() => {
        if(db){
            getWorkoutSplits();
        }
    }, [db])

    const getWorkoutSplits = async () => {
        try {
          const splits = await db.executeQuery('SELECT * FROM WorkoutSplits;');
          setWorkoutSplits(splits);
        } catch (e) {
          console.log('Error fetching workout splits:', e);
        }
      };
    

    const hanldeCardPress = (title, workoutSplit_id) => {
        navigation.navigate('WorkoutDays', {title, workoutSplit_id})
    }

    const addWorkoutSplit = async () => {
        try {
            console.log(db);
          await db.executeRun('INSERT INTO WorkoutSplits (workout_split_name) VALUES (?)', [newWorkoutSplit.toString()]);
          await getWorkoutSplits();
          setModalVisible(false);
          setNewWorkoutSplit("");
        } catch (e) {
          console.log('Error adding workout split:', e);
        }
    };

    const removeWorkoutSplit = async (workoutSplitId) => {
        try {
          await db.executeRun(
            'DELETE FROM Logs WHERE exercise_id IN (SELECT id FROM Exercises WHERE workout_day_id IN (SELECT id FROM WorkoutDays WHERE workout_splits_id = ?))', 
            [workoutSplitId]
          );
          
          await db.executeRun(
            'DELETE FROM Exercises WHERE workout_day_id IN (SELECT id FROM WorkoutDays WHERE workout_splits_id = ?)', 
            [workoutSplitId]
          );
          
          await db.executeRun('DELETE FROM WorkoutDays WHERE workout_splits_id = ?', [workoutSplitId]);
          
          await db.executeRun('DELETE FROM WorkoutSplits WHERE id = ?', [workoutSplitId]);
          
          await getWorkoutSplits();
          setLongPressed(null);
        } catch (e) {
          console.log('Error deleting workout split and related data:', e);
        }
      };

    return(
        <TouchableWithoutFeedback onPress={hideDeleteButton}>
            <View style={{backgroundColor: '#01050e'}}>
                <Topbar title={'Workouts'} setModalVisible={setModalVisible}/>
                <ScrollView contentContainerStyle={styles.workoutsList}>
                    {
                        workoutSplits.map((item, index) => (
                            <TouchableOpacity
                                style={styles.workoutSplitCard}
                                activeOpacity={0.7}
                                onPress={() => hanldeCardPress(item.workout_split_name, item.id)} key={item.id}
                                onLongPress={() => showDeleteButton(index)}
                            >
                                <Text style={styles.workoutSplitTitle}>{item.workout_split_name}</Text>
                                <Icon name="dumbbell" size={28} color={'#3C83F6'} style={{position: 'absolute', right: 20, backgroundColor: '#18263E', borderRadius: 50, padding: 4}}/>
                                <Animated.View style={[styles.trashIconContainer, {right: longPressed == index ? animationProgress : -100}]}>
                                    <TouchableOpacity
                                        onPress={() => console.log(removeWorkoutSplit(item.id))}
                                        activeOpacity={0.9}
                                    >
                                        <Icon name='trash-can' size={28} color={'#D9D9D9'}/>
                                    </TouchableOpacity>
                                </Animated.View>
                            </TouchableOpacity>
                        ))
                    }

                </ScrollView>
                <Modal 
                    isVisible={modalVisible} 
                    style={styles.modalView} 
                    onBackdropPress={() => {setNewWorkoutSplit("");setModalVisible(false)}}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : null}
                    >
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add a new workout split</Text>
                            <Text style={styles.modalDescription}>Create a new workout split for your training program. You can add exercises  later.</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Workout name"
                                value={newWorkoutSplit}
                                onChangeText={(text) => setNewWorkoutSplit(text)}
                            />
<View style={styles.checkboxContainer}>
  <Text style={styles.checkboxLabel}>Select Training Days:</Text>
  <View style={styles.checkboxGrid}>
    {daysOfWeek.map((day) => {
      const selected = selectedDays.includes(day);
      return (
        <TouchableOpacity
          key={day}
          onPress={() => {
            setSelectedDays((prev) =>
              selected ? prev.filter(d => d !== day) : [...prev, day]
            );
          }}
          style={[
            styles.dayPill,
            selected && styles.dayPillSelected
          ]}
        >
          <Text style={[
            styles.dayPillText,
            selected && styles.dayPillTextSelected
          ]}>
            {day.slice(0, 3)}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
</View>
                            <TouchableOpacity onPress={() => addWorkoutSplit()} style={styles.saveButton} activeOpacity={0.6}>
                                <Text style={{fontSize: 18, fontWeight: '700', color: '#f1f1f1'}}>Save workout</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    workoutsList: {
        height: '100%',
        alignItems: 'center',
        marginTop: 30,
        gap: 24,
        backgroundColor: '#01050e',
    },
    workoutSplitCard: {
        backgroundColor: '#121212',
        width: '90%',
        borderRadius: 5,
        height: 80,
        paddingLeft: 25,
        gap: 3,
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 4,
        shadowOpacity: 0.30,
        overflow: 'hidden'
    },
    workoutSplitTitle: {
        color: 'hsl(210, 40%, 98%)',
        fontSize: 24,
        fontWeight: '600'
    },
    modalView: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'hsl(223, 84%, 3%)',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderWidth: 1,
        borderColor: '#f1f1f1',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#f1f1f1'
    },
    modalDescription: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20
    },
    input: {
        color: '#f1f1f1',
        height: 40,
        borderColor: '#3C83F6',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 10
    },
    saveButton: {
        height: 40,
        backgroundColor: '#3C83F6',
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        marginBlockEnd: 5,
    },
    checkboxContainer: {
        marginTop: 10,
        marginBottom: 20,
    },
    checkboxLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#f1f1f1'
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    checkboxText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#f1f1f1'
    },      
    checkboxGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    dayPill: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: '#1e293b',
        borderWidth: 1,
        borderColor: '#4b5563',
        marginBottom: 8,
    },
    dayPillSelected: {
        backgroundColor: '#228CDB',
        borderColor: '#228CDB',
    },
    dayPillText: {
        color: '#f1f1f1',
        fontSize: 14,
        fontWeight: '500',
    },
    dayPillTextSelected: {
        color: '#ffffff',
        fontWeight: '600',
    },
    trashIconContainer: {
        height: 80,
        width: 70,
        backgroundColor: '#aa1212',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10
    }
})

export default WorkoutSection;