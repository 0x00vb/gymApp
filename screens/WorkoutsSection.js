import React, { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Animated, TouchableWithoutFeedback } from 'react-native';
import Modal from 'react-native-modal'
import { useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite/next";
import Icon from "react-native-vector-icons/Ionicons";
import useDeleteButtonAnimation from "../hooks/useDeleteButtonAnimation";

import Topbar from "../components/Topbar";

const WorkoutSection = () => {
    const [workoutSplits, setWorkoutSplits] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newWorkoutSplit, setNewWorkoutSplit] = useState("");
    
    const navigation = useNavigation();
    const db = useSQLiteContext();

    const { longPressed, setLongPressed, animationProgress, showDeleteButton, hideDeleteButton } = useDeleteButtonAnimation();

    useEffect(() => {
        db.withTransactionAsync(async () => {
            await getWorkoutSplits();
        })
    }, [db])

    const getWorkoutSplits = async () => {
        const result = await db.getAllAsync(
            'SELECT * FROM WorkoutSplits;'
        );
        setWorkoutSplits(result);
    }

    const hanldeCardPress = (title, workoutSplit_id) => {
        navigation.navigate('WorkoutDays', {title, workoutSplit_id})
    }

    const addWorkoutSplit = async () => {
        try{
            db.withTransactionAsync(async () => {
                await db.runAsync('INSERT INTO WorkoutSplits (workout_split_name) VALUES (?)', [newWorkoutSplit])
            })
            await getWorkoutSplits();
            setModalVisible(false);
            setLongPressed();
        }catch(e){
            console.log(e);
        }
    }

    const removeWorkoutSplit = async (workoutSplitId) => {
        try {
            await db.withTransactionAsync(async () => {
                // Delete logs associated with exercises within workout days associated with the workout split
                await db.runAsync('DELETE FROM Logs WHERE exercise_id IN (SELECT id FROM Exercises WHERE workout_day_id IN (SELECT id FROM WorkoutDays WHERE workout_splits_id = ?))', [workoutSplitId]);
                // Delete exercises associated with workout days associated with the workout split
                await db.runAsync('DELETE FROM Exercises WHERE workout_day_id IN (SELECT id FROM WorkoutDays WHERE workout_splits_id = ?)', [workoutSplitId]);
                // Delete workout days associated with the workout split
                await db.runAsync('DELETE FROM WorkoutDays WHERE workout_splits_id = ?', [workoutSplitId]);
                // Delete the workout split itself
                await db.runAsync('DELETE FROM WorkoutSplits WHERE id = ?', [workoutSplitId]);
            });
            await getWorkoutSplits();
        } catch (e) {
            console.log('Error deleting workout split and related data:', e);
        }
    }

    return(
        <TouchableWithoutFeedback onPress={hideDeleteButton}>
            <View>
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
                                <Text style={styles.workoutSplitFrec}>6 days/week</Text>
                                <Animated.View style={[styles.trashIconContainer, {right: longPressed == index ? animationProgress : -100}]}>
                                    <TouchableOpacity
                                        onPress={() => console.log(removeWorkoutSplit(item.id))}
                                        activeOpacity={0.9}
                                    >
                                        <Icon name='trash' size={28} color={'#D9D9D9'}/>
                                    </TouchableOpacity>
                                </Animated.View>
                            </TouchableOpacity>

                        ))
                    }

                </ScrollView>
                <Modal isVisible={modalVisible} style={styles.modalView} onBackdropPress={() => setModalVisible(false)}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : null}
                    >
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add workout</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Workout name"
                                value={newWorkoutSplit}
                                onChangeText={(text) => setNewWorkoutSplit(text)}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder=""
                            />
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
        gap: 24
    },
    workoutSplitCard: {
        width: '83%',
        height: 80,
        backgroundColor: '#D9D9D9',
        borderRadius: 10,
        paddingTop: 10,
        paddingLeft: 15,
        gap: 3,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 4,
        shadowOpacity: 0.30,
        overflow: 'hidden'
    },
    workoutSplitTitle: {
        fontSize: 22,
        fontWeight: '500'
    },
    workoutSplitFrec: {
        fontSize: 14
    },
    modalView: {
        margin: 0,
        justifyContent: 'flex-end'
    },
    modalContent: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15
    },
    input: {
        height: 40,
        borderColor: '#228CDB',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 10
    },
    saveButton: {
        height: 40,
        backgroundColor: '#228CDB',
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 10
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