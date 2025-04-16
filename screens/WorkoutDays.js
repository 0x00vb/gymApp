import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import useDeleteButtonAnimation from "../hooks/useDeleteButtonAnimation";
import Icon from "react-native-vector-icons/Ionicons";


import Topbar from "../components/Topbar";
import ModalInput from '../components/ModalInput'
import { useDatabase } from "../context/DatabaseContext";


const WorkoutLogger = (props) => {
    const { title, workoutSplit_id } = props.route.params;
    const [workoutDays, setWorkoutDays] = useState([]);
    const navigation = useNavigation();

    const [modalVisible, setModalVisible] = useState(false);
    const [dayInput, setDayInput] = useState('');

    const { longPressed, setLongPressed, animationProgress, showDeleteButton, hideDeleteButton } = useDeleteButtonAnimation();

    const db = useDatabase();

    useEffect(() => {
        getWorkoutDays();
    }, [])
    
    const getWorkoutDays = async () => {
        try {
          const response = await db.executeQuery('SELECT * FROM WorkoutDays WHERE workout_splits_id = ?', [workoutSplit_id]);
          setWorkoutDays(response);
        } catch (e) {
          console.log('Error fetching workout days:', e);
        }
      }
    const toggleModal = () => {
        setModalVisible(true);
    }

    const hanldeAddDay = async () => {
        try {
          await db.executeRun('INSERT INTO WorkoutDays (workout_splits_id, workout_day_name) VALUES (?, ?)', [workoutSplit_id, dayInput]);
          await getWorkoutDays();
          setDayInput("");
          setModalVisible(false);
        } catch (e) {
          console.log('Error adding workout day:', e);
        }
      }
      
    const removeWorkoutDay = async (workoutDayId) => {
        try {
            await db.withTransaction(async (execute) => {
            // Delete logs associated with the workout day (based on the exercises)
            await execute('DELETE FROM Logs WHERE exercise_id IN (SELECT id FROM Exercises WHERE workout_day_id = ?)', [workoutDayId]);
            // Delete exercises associated with the workout day
            await execute('DELETE FROM Exercises WHERE workout_day_id = ?', [workoutDayId]);
            // Delete the workout day itself
            await execute('DELETE FROM WorkoutDays WHERE id = ?', [workoutDayId]);
            });
            await getWorkoutDays();
            setLongPressed(null);
        } catch (e) {
            console.log("Error removing workoutDay: ", e);
        }
    }
    return(
        <TouchableWithoutFeedback onPress={hideDeleteButton}>
            <View style={{flex: 1, backgroundColor: '#01050e'}}>
                <Topbar title={title} style={{flex: 1}}/>
                <ScrollView contentContainerStyle={styles.workoutsList}>
                    {
                        workoutDays.map((item, index) => (
                            <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => navigation.navigate('WorkoutLogger', {
                                title: title,
                                subtitle: item.workout_day_name,
                                workoutDay_id: item.id
                            })}
                            onLongPress={() => showDeleteButton(index)}
                            key={item.id}
                            style={styles.workoutCard}
                        >
                            

                                <Text style={styles.workoutTitle}>{item.workout_day_name}</Text>
                                <Animated.View style={[
                                    styles.trashIconContainer,
                                    { right: longPressed == index ? animationProgress : -100 }
                                ]}>
                                    <TouchableOpacity
                                        onPress={() => removeWorkoutDay(item.id)}
                                        activeOpacity={0.9}
                                    >
                                        <Icon name='trash' size={28} color={'#D9D9D9'} />
                                    </TouchableOpacity>
                                </Animated.View>
                        </TouchableOpacity>
                        ))
                    }
                    {/* -------  */}
                    <TouchableOpacity style={styles.addDay} activeOpacity={0.6} onPress={toggleModal}>
                        <Text style={{color: '#f1f1f1', fontSize: 22, fontWeight: '700'}}>Add Day</Text>
                    </TouchableOpacity>
                </ScrollView>
                <ModalInput
                    title={'Add a new Workout day'}
                    buttonText={'Save Day'}
                    setText={setDayInput}
                    inputValue={dayInput}
                    placeholder={null}
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    onSubmit={hanldeAddDay}
                />
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
        flexGrow: 1
    },
    workoutCard: {
        backgroundColor: '#121212',
        width: 340,
        minHeight: 60,
        height: 'auto',
        borderRadius: 10,
        justifyContent: 'center',
        gap: 3,
        shadowColor: 'rgba(60, 131, 246, 0.79)',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 4,
        shadowOpacity: 0.30,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    workoutTitle: {
        fontSize: 22,
        fontWeight: '600',
        marginLeft: 15,
        color: '#fdfdfd'
    },
    addDay: {
        width: 340,
        height: 45,
        backgroundColor: '#3C83F6',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 3,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 4,
        shadowOpacity: 0.50,
    },
    workoutCardExpandedGridContainer: {
        alignSelf: 'center',
        backgroundColor: '#f1f1f1',
        height: 400,
        width: '98%',
        borderRadius: 10
    },
    gridHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 50,
        marginTop: 5,
    },
    gridList: {
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
        gap: 9

    },
    workoutRow: {
        height: 40,
        width: '97%',
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
        backgroundColor: '#d9d9d9',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 4,
    },
    workoutRowText: {
        fontSize: 15,
    },
    addWorkout: {
        width: '97%',
        height: 40,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#228CDB',
        marginVertical: 10,
        borderRadius: 10
    },
    trashIconContainer: {
        height: 60,
        width: 70,
        backgroundColor: '#aa1212',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10
    }
})

export default WorkoutLogger;