import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from "@react-navigation/native";

import Topbar from "../components/Topbar";
import ModalInput from '../components/ModalInput'
import Icon from "react-native-vector-icons/FontAwesome";
import { useSQLiteContext } from "expo-sqlite/next";

const WorkoutLogger = (props) => {
    const { title, workoutSplit_id } = props.route.params;
    const [workoutDays, setWorkoutDays] = useState([]);
    const navigation = useNavigation();

    const [modalVisible, setModalVisible] = useState(false);
    const [dayInput, setDayInput] = useState('');

    const db = useSQLiteContext();

    useEffect(() => {
        db.withTransactionAsync(async () => {
            await getWorkoutDays();
        })
    }, [])
    
    const getWorkoutDays = async () => {
        const response = await db.getAllAsync('SELECT * FROM WorkoutDays WHERE workout_splits_id = ?', [workoutSplit_id]);
        setWorkoutDays(response);
    }

    const toggleModal = () => {
        setModalVisible(true);
    }

    const hanldeAddDay = async () => {

    }

    return(
        <View>
            <Topbar title={title}/>
            <ScrollView contentContainerStyle={styles.workoutsList}>
                {
                    workoutDays.map((item) => (
                        <TouchableOpacity
                            style={styles.workoutCard}
                            activeOpacity={0.6}
                            onPress={() => navigation.navigate('WorkoutLogger', {title: title, subtitle: item.workout_day_name, workoutDay_id: item.id})}
                            key={item.id}>
                            <Text style={styles.workoutTitle}>{item.workout_day_name}</Text>
                        </TouchableOpacity>
                    ))
                }


                {/* -------  */}
                <TouchableOpacity style={styles.addDay} activeOpacity={0.6} onPress={toggleModal}>
                    <Text style={{color: '#f1f1f1', fontSize: 22, fontWeight: '700'}}>Add Day</Text>
                </TouchableOpacity>

            </ScrollView>
            <ModalInput
                title={'Add Day'}
                buttonText={'Save Day'}
                setText={setDayInput}
                inputValue={dayInput}
                placeholder={null}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
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
        width: 340,
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
    addDay: {
        width: 340,
        height: 45,
        backgroundColor: '#228CDB',
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
})

export default WorkoutLogger;