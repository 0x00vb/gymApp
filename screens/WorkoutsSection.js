import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Modal from 'react-native-modal'
import { useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite/next";
import Icon from "react-native-vector-icons/Ionicons";

import Topbar from "../components/Topbar";

const WorkoutSection = () => {
    const [workoutSplits, setWorkoutSplits] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newWorkoutSplit, setNewWorkoutSplit] = useState("");
    const [longPressed, setLongPressed] = useState(null);
    const navigation = useNavigation();

    const db = useSQLiteContext();

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
            setModalVisible(false);
        }catch(e){
            console.log(e);
        }
    }

    const removeWorkoutSplit = () => {
        
    }

    const handleLongTouch = (itemId) => {
        setLongPressed(itemId);
    }

    return(
        <View>
            <Topbar title={'Workouts'} setModalVisible={setModalVisible}/>
            <ScrollView contentContainerStyle={styles.workoutsList}>

                {
                    workoutSplits.map((item, index) => (
                        <TouchableOpacity
                            style={[styles.workoutSplitCard, longPressed === index && styles.longPressedSpan]}
                            activeOpacity={0.7}
                            onPress={() => hanldeCardPress(item.workout_split_name, item.id)} key={item.id}
                            onLongPress={() => handleLongTouch(index)}
                        >
                            <Text style={styles.workoutSplitTitle}>{item.workout_split_name}</Text>
                            <Text style={styles.workoutSplitFrec}>6 days/week</Text>
                            {
                                longPressed === index && (
                                    <TouchableOpacity
                                        style={styles.trashIconContainer}
                                        onPress={null}
                                    >
                                        <Icon name='trash' size={28} color={'#aa1212'}/>
                                    </TouchableOpacity>
                                )
                            }
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
    longPressedSpan: {
        borderColor: '#aa1212',
        borderWidth: 2,
    },
    trashIconContainer: {
        position: 'absolute',
        top: '30%',
        right: 10
    }
})

export default WorkoutSection;