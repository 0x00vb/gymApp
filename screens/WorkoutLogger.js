import React, { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import useDeleteButtonAnimation from "../hooks/useDeleteButtonAnimation";
import Topbar from "../components/Topbar";
import Icon from "react-native-vector-icons/FontAwesome";
import ModalInput from "../components/ModalInput";
import LoggerModal from "../components/LoggerModal";
import { useSQLiteContext } from "expo-sqlite/next";

const WorkoutLogger = (props) => {
    const { title, subtitle, workoutDay_id } = props.route.params;
    const [exercises, setExercises] = useState([]);
    const [exerciseLogs, setExerciseLogs] = useState([]);
    const [expandedCard, setExpandedCard] = useState(null);
    const [addExerciseModalVisible, setAddExerciseModalVisible] = useState(false);
    const [exerciseText, setExerciseText] = useState("");
    const [selectedExerciseId, setSelectedExerciseId] = useState();
    const [selectedExerciseName, setSelectedExerciseName] = useState();
    const [selectedExerciseLogId, setSelectedExerciseLogId] = useState(null);
    const expandedCardAnimation = useRef(new Animated.Value(0)).current;
    
    const db = useSQLiteContext();

    const { longPressed, setLongPressed, animationProgress, showDeleteButton, hideDeleteButton } = useDeleteButtonAnimation();

    useEffect(() => {
        db.withTransactionAsync(async () => {
            await getExercises();
        })
    }, [])

    const getExercises = async () => {
        const response = await db.getAllAsync('SELECT * FROM Exercises WHERE workout_day_id = ?', [workoutDay_id]);
        setExercises(response);
    }

    const getExerciseLogs = async (exercise_id) => {
        const response = await db.getAllAsync('SELECT * FROM Logs WHERE exercise_id = ? ORDER BY date ASC', [exercise_id]);
        setExerciseLogs([]);
        setExerciseLogs(response);
    }

    const toggleAddExerciseModal = () => {
        setAddExerciseModalVisible(true);
    }

    const [LogModalVisible, setLogModalVisible] = useState(false);

    const toggleLogModal = (exerciseId) => {
        setSelectedExerciseId(exerciseId);
        setLogModalVisible(true);
    }

    const hanldeCardPress = async (cardIndex, cardId) => {
        await getExerciseLogs(cardId);
        const isCardAlreadyExpanded = (cardIndex === expandedCard);
        setExpandedCard(isCardAlreadyExpanded ? null : cardIndex);
    
        // Determine the target height based on whether the card is already expanded
        const targetHeight = isCardAlreadyExpanded ? 0 : 400;
    
        Animated.timing(expandedCardAnimation, { toValue: targetHeight, duration: 600, useNativeDriver: false }).start();
    }

    const [editLogModalVisible, setEditLogModalVisible] = useState(false);
    const hanldeEditLog = (logId) => {
        setSelectedExerciseLogId(logId);
        setEditLogModalVisible(true);
    }
    
    const handleAddExercise = async () => {
        try{    
            await db.withTransactionAsync(async () => {
                await db.runAsync('INSERT INTO Exercises (workout_day_id, exercise_name) VALUES (?, ?)', [workoutDay_id, exerciseText.toLocaleLowerCase()]);
            });
            await getExercises();
            setAddExerciseModalVisible(false);
        }catch(e){
            console.log(e);
        }
    }

    const handleRemoveExercise = async (exerciseId) => {
        try{
            await db.withTransactionAsync(async () => {
                await db.runAsync('DELETE FROM Logs WHERE exercise_id = ?', [exerciseId]);
                await db.runAsync('DELETE FROM Exercises WHERE id = ?', [exerciseId]);
            });
            await getExercises();
            setLongPressed(null);
        }catch(e){
            console.log("Error removing exercise: ", e);
        }
    }

    return(
        <TouchableWithoutFeedback onPress={hideDeleteButton}>
            <View>
                <Topbar title={title} subtitle={subtitle}/>
                <ScrollView contentContainerStyle={styles.workoutsList}>
                    {
                        exercises.map((item, index) => (
                            <TouchableOpacity
                                style={styles.workoutCard}
                                activeOpacity={0.6}
                                onPress={() => hanldeCardPress(index, item.id)}
                                onLongPress={() => expandedCard !== index && showDeleteButton(index)}
                                key={item.id}
                            >
                                <Text style={styles.workoutTitle}>{item.exercise_name}</Text>
                                <Animated.View style={[styles.trashIconContainer, {right: longPressed == index ? animationProgress : -100}]}>
                                    <TouchableOpacity
                                        onPress={() => handleRemoveExercise(item.id)}
                                        activeOpacity={0.9}
                                    >
                                        <Icon name='trash' size={28} color={'#D9D9D9'}/>
                                    </TouchableOpacity>
                                </Animated.View>

                                {
                                    expandedCard === index && longPressed !== index && (
                                        <View > 
                                            <Animated.View style={[styles.workoutCardExpandedGridContainer, {maxHeight: expandedCard === index && expandedCardAnimation}]}>
                                                <View style={styles.gridHeader}>
                                                    <Text style={styles.gridHeaderText}>Sets</Text>
                                                    <Text style={styles.gridHeaderText}>Weight</Text>
                                                    <Text style={styles.gridHeaderText}>Reps</Text>
                                                </View>
                                                <ScrollView contentContainerStyle={styles.gridList}>
                                                    {
                                                        exerciseLogs?.length === 0 ? 
                                                            <Text style={{alignSelf: 'center', fontSize: 17, color: '#808080'}}>
                                                                No logs found...
                                                            </Text> 
                                                        :
                                                        exerciseLogs?.map((item) => (
                                                            <TouchableOpacity style={styles.workoutRow} key={item.id}
                                                                onPress={() => hanldeEditLog(item.id)}
                                                            >
                                                                <View style={styles.workoutRowField}>
                                                                    <Text style={styles.workoutRowText}>{item.sets}</Text>
                                                                </View>
                                                                <View style={[styles.workoutRowField, , {borderColor: '#000000', borderLeftWidth: 1, borderRightWidth: 1}]}>
                                                                    <Text style={styles.workoutRowText}>{item.weights}</Text>
                                                                </View>
                                                                <View style={styles.workoutRowField}>
                                                                    <Text style={styles.workoutRowText}>{item.reps}</Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                        ))
                                                    }
                                                </ScrollView>
                                            </Animated.View>
                                            <TouchableOpacity
                                                style={styles.addWorkout}
                                                onPress={() => {toggleLogModal(item.id), setSelectedExerciseName(item.exercise_name)}}>
                                                <Icon name="plus" size={30} color={'#f1f1f1'}/>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }
                            </TouchableOpacity>
                        ))
                    }   


                    {/* -------  */}
                    <TouchableOpacity style={styles.addExercise} activeOpacity={0.6} onPress={toggleAddExerciseModal}>
                        <Text style={{color: '#f1f1f1', fontSize: 22, fontWeight: '700'}}>Add exercise</Text>
                    </TouchableOpacity>
                </ScrollView>
                <LoggerModal
                    modalVisible={LogModalVisible}
                    setModalVisible={setLogModalVisible}
                    exerciseId={selectedExerciseId}
                    exerciseName={selectedExerciseName}
                    getExerciseLogs={getExerciseLogs}
                    setExerciseLogs={setExerciseLogs}
                />
                <LoggerModal
                    modalVisible={editLogModalVisible}
                    setModalVisible={setEditLogModalVisible}
                    exerciseId={selectedExerciseId}
                    exerciseName={selectedExerciseName}
                    getExerciseLogs={getExerciseLogs}
                    setExerciseLogs={setExerciseLogs}
                    selectedExerciseLogId={selectedExerciseLogId}
                />
                <ModalInput
                    title={"Add Exercise"}
                    buttonText={'Save exercise'}
                    setText={setExerciseText}
                    placeholder={"Exercise name"}
                    inputValue={exerciseText}
                    modalVisible={addExerciseModalVisible}
                    setModalVisible={setAddExerciseModalVisible}    
                    onSubmit={handleAddExercise}
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
        gap: 24
    },
    workoutCard: {
        width: '88%',
        minHeight: 60,
        height: 'auto',
        backgroundColor: '#D9D9D9',
        borderRadius: 10,
        justifyContent: 'center',
        gap: 3,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 4,
        shadowOpacity: 0.30,
        overflow: 'hidden'
    },
    workoutTitle: {
        fontSize: 22,
        fontWeight: '600',
        marginLeft: 15

    },
    addWorkout: {
        width: '98%',
        height: 45,
        backgroundColor: '#228CDB',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginVertical: 10,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 4,
        shadowOpacity: 0.25,
    },
    workoutCardExpandedGridContainer: {
        
        alignSelf: 'center',
        backgroundColor: '#f1f1f1',
        width: '98%',
        paddingBottom: 10,
        borderRadius: 10
    },
    gridHeader: {
        flexDirection: 'row',   
        justifyContent: 'space-around',
        marginVertical: 7,
        marginHorizontal: 15
    },
    gridHeaderText: {
        fontSize: 15,
        fontWeight: '600',
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
        justifyContent: 'space-between',
        backgroundColor: '#d9d9d9',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 4,
    },
    workoutRowField: {
        height: '100%',
        width: '33%',
        justifyContent: 'center',

    },
    workoutRowText: {
        fontSize: 15,
        textAlign: 'center'
    },
    addExercise: {
        width: '88%',
        height: 40,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#228CDB',
        marginVertical: 10,
        borderRadius: 10
    },
    trashIconContainer: {
        height: '100%',
        width: 50,
        backgroundColor: '#aa1212',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10
    }
})

export default WorkoutLogger;