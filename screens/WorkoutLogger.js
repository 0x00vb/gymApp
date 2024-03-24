import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
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
    
    const db = useSQLiteContext();

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
        const response = await db.getAllAsync('SELECT * FROM Logs WHERE exercise_id = ?', [exercise_id]);
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
        console.log(exercises)
        console.log(cardIndex)
        setExpandedCard((cardIndex) === expandedCard ? null : (cardIndex));
    }

    const handleAddExercise = async () => {
        try{    
            db.withTransactionAsync(async () => {
                await db.runAsync('INSERT INTO Exercises (workout_day_id, exercise_name) VALUES (?, ?)', [workoutDay_id, exerciseText]);
            });
            await getExercises();
            setAddExerciseModalVisible(false);
        }catch(e){
            console.log(e);
        }
    }

    return(
        <View>
            <Topbar title={title} subtitle={subtitle}/>
            <ScrollView contentContainerStyle={styles.workoutsList}>
                {
                    exercises.map((item, index) => (
                        <TouchableOpacity style={styles.workoutCard} activeOpacity={0.6} onPress={() => hanldeCardPress(index, item.id)} key={item.id}>
                            <Text style={styles.workoutTitle}>{item.exercise_name}</Text>
                            {
                                expandedCard === index && (
                                    <View>
                                        <View style={styles.workoutCardExpandedGridContainer}>
                                            <View style={styles.gridHeader}>
                                                <Text style={styles.gridHeaderText}>Date</Text>
                                                <Text style={styles.gridHeaderText}>Sets</Text>
                                                <Text style={styles.gridHeaderText}>Weight</Text>
                                                <Text style={styles.gridHeaderText}>Reps</Text>
                                            </View>
                                            <ScrollView contentContainerStyle={styles.gridList}>
                                                {
                                                    exerciseLogs.length === 0 ? 
                                                        <Text style={{alignSelf: 'center', fontSize: 17, color: '#808080'}}>
                                                            No logs found...
                                                        </Text> 
                                                    :
                                                    exerciseLogs.map((item) => (
                                                        <TouchableOpacity style={styles.workoutRow} key={item.id}>
                                                            <Text style={styles.workoutRowText}>{item.date}</Text>
                                                            <Text style={styles.workoutRowText}>{item.sets}</Text>
                                                            <Text style={styles.workoutRowText}>{item.weights}</Text>
                                                            <Text style={styles.workoutRowText}>{item.reps}</Text>
                                                        </TouchableOpacity>
                                                    ))
                                                }
                                            </ScrollView>
                                        </View>
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
        maxHeight: 400,
        height: 'auto',
        width: '98%',
        paddingBottom: 10,
        borderRadius: 10
    },
    gridHeader: {
        flexDirection: 'row',   
        justifyContent: 'center',
        gap: 50,
        marginVertical: 7,     
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
    addExercise: {
        width: '88%',
        height: 40,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#228CDB',
        marginVertical: 10,
        borderRadius: 10
    }
})

export default WorkoutLogger;