import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import Topbar from "../components/Topbar";
import Icon from "react-native-vector-icons/FontAwesome";
import ModalInput from "../components/ModalInput";
import LoggerModal from "../components/LoggerModal";

const WorkoutLogger = (props) => {
    const {title, subtitle} = props.route.params;
    const [expandedCard, setExpandedCard] = useState(null);

    const [addExerciseModalVisible, setAddExerciseModalVisible] = useState(false);
    const [exerciseText, setExerciseText] = useState("");

    const toggleAddExerciseModal = () => {
        setAddExerciseModalVisible(true);
    }

    const [LogModalVisible, setLogModalVisible] = useState(false);

    const toggleLogModal = () => {
        setLogModalVisible(true);
    }


    const hanldeCardPress = (cardIndex) => {
        setExpandedCard(expandedCard === cardIndex ? null : cardIndex);
    }

    return(
        <View>
            <Topbar title={title} subtitle={subtitle}/>
            <ScrollView contentContainerStyle={styles.workoutsList}>

                <TouchableOpacity style={styles.workoutCard} activeOpacity={0.6} onPress={() => hanldeCardPress(1)}>
                    <Text style={styles.workoutTitle}>Bench Press</Text>
                    {
                        expandedCard === 1 && (
                            <View>
                                <View style={styles.workoutCardExpandedGridContainer}>
                                    <View style={styles.gridHeader}>
                                        <Text style={styles.gridHeaderText}>Date</Text>
                                        <Text style={styles.gridHeaderText}>Sets</Text>
                                        <Text style={styles.gridHeaderText}>Weight</Text>
                                        <Text style={styles.gridHeaderText}>Reps</Text>
                                    </View>
                                    <ScrollView contentContainerStyle={styles.gridList}>

                                        <TouchableOpacity style={styles.workoutRow}>
                                            <Text style={styles.workoutRowText}>10/10/2023</Text>
                                            <Text style={styles.workoutRowText}>3</Text>
                                            <Text style={styles.workoutRowText}>100kg</Text>
                                            <Text style={styles.workoutRowText}>12-12-12</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.workoutRow}>
                                            <Text style={styles.workoutRowText}>10/10/2023</Text>
                                            <Text style={styles.workoutRowText}>3</Text>
                                            <Text style={styles.workoutRowText}>100kg</Text>
                                            <Text style={styles.workoutRowText}>12-12-12</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.workoutRow}>
                                            <Text style={styles.workoutRowText}>10/10/2023</Text>
                                            <Text style={styles.workoutRowText}>3</Text>
                                            <Text style={styles.workoutRowText}>100kg</Text>
                                            <Text style={styles.workoutRowText}>12-12-12</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.workoutRow}>
                                            <Text style={styles.workoutRowText}>10/10/2023</Text>
                                            <Text style={styles.workoutRowText}>3</Text>
                                            <Text style={styles.workoutRowText}>100kg</Text>
                                            <Text style={styles.workoutRowText}>12-12-12</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.workoutRow}>
                                            <Text style={styles.workoutRowText}>10/10/2023</Text>
                                            <Text style={styles.workoutRowText}>3</Text>
                                            <Text style={styles.workoutRowText}>100kg</Text>
                                            <Text style={styles.workoutRowText}>12-12-12</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.workoutRow}>
                                            <Text style={styles.workoutRowText}>10/10/2023</Text>
                                            <Text style={styles.workoutRowText}>3</Text>
                                            <Text style={styles.workoutRowText}>100kg</Text>
                                            <Text style={styles.workoutRowText}>12-12-12</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.workoutRow}>
                                            <Text style={styles.workoutRowText}>10/10/2023</Text>
                                            <Text style={styles.workoutRowText}>3</Text>
                                            <Text style={styles.workoutRowText}>100kg</Text>
                                            <Text style={styles.workoutRowText}>12-12-12</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.workoutRow}>
                                            <Text style={styles.workoutRowText}>10/10/2023</Text>
                                            <Text style={styles.workoutRowText}>3</Text>
                                            <Text style={styles.workoutRowText}>100kg</Text>
                                            <Text style={styles.workoutRowText}>12-12-12</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.workoutRow}>
                                            <Text style={styles.workoutRowText}>10/10/2023</Text>
                                            <Text style={styles.workoutRowText}>3</Text>
                                            <Text style={styles.workoutRowText}>100kg</Text>
                                            <Text style={styles.workoutRowText}>12-12-12</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.workoutRow}>
                                            <Text style={styles.workoutRowText}>10/10/2023</Text>
                                            <Text style={styles.workoutRowText}>3</Text>
                                            <Text style={styles.workoutRowText}>100kg</Text>
                                            <Text style={styles.workoutRowText}>12-12-12</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.workoutRow}>
                                            <Text style={styles.workoutRowText}>10/10/2023</Text>
                                            <Text style={styles.workoutRowText}>3</Text>
                                            <Text style={styles.workoutRowText}>100kg</Text>
                                            <Text style={styles.workoutRowText}>12-12-12</Text>
                                        </TouchableOpacity>


                                    </ScrollView>
                                </View>
                                <TouchableOpacity style={styles.addWorkout} onPress={toggleLogModal}>
                                    <Icon name="plus" size={30} color={'#f1f1f1'}/>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                </TouchableOpacity>


                {/* -------  */}
                <TouchableOpacity style={styles.addExercise} activeOpacity={0.6} onPress={toggleAddExerciseModal}>
                    <Text style={{color: '#f1f1f1', fontSize: 22, fontWeight: '700'}}>Add exercise</Text>
                </TouchableOpacity>
            </ScrollView>
            <LoggerModal
                modalVisible={LogModalVisible}
                setModalVisible={setLogModalVisible}
                
            />

            <ModalInput
                title={"Add Exercise"}
                buttonText={'Save exercise'}
                setText={setExerciseText}
                placeholder={"Exercise name"}
                inputValue={exerciseText}
                modalVisible={addExerciseModalVisible}
                setModalVisible={setAddExerciseModalVisible}    
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
        height: 400,
        width: '98%',
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