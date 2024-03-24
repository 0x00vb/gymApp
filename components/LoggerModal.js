import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Modal from 'react-native-modal';
import { useSQLiteContext } from "expo-sqlite/next";

const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Adding 1 because months are zero-based
    const day = ('0' + currentDate.getDate()).slice(-2);
    return `${year}/${month}/${day}`;
};

const LoggerModal = ({ modalVisible, setModalVisible, exerciseId, exerciseName, getExerciseLogs }) => {
    const [date, setDate] = useState(getCurrentDate());
    const [sets, setSets] = useState();
    const [weights, setWeights] = useState('');
    const [reps, setReps] = useState('');

    const db = useSQLiteContext();

    const resetFields = () => {
        setDate(getCurrentDate());
        setWeights('');
        setSets('');
        setReps('');
    }

    const handleSaveLog = async () => {
        try{
            db.withTransactionAsync(async () => {
                await db.runAsync(
                    'INSERT INTO Logs (exercise_id, date, weights, sets, reps) VALUES (?, ?, ?, ?, ?)',
                    [exerciseId, date, weights, sets, reps]
                );
            })
            getExerciseLogs(exerciseId);
            resetFields();
            setModalVisible(false);
        }catch(error){
            console.log(error);
        }
    }

    return(    
        <Modal
            isVisible={modalVisible}
            style={styles.modalView}
            onBackdropPress={() => (setModalVisible(false), resetFields())}
            animationIn={"slideInRight"}
            animationOut={'slideOutRight'}
        >
            <KeyboardAvoidingView
                style={{flex:0.6, justifyContent: 'center'}}
                behavior={Platform.OS === 'ios' ? 'padding' : null}
            >

                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{exerciseName} Log</Text>
                    <View style={styles.modalTable}>
                        <View style={styles.rows}>
                            <Text style={styles.rowText}>Date</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={'DD/MM'}
                                value={date}
                                onChangeText={(text) => setDate(text)}
                            />
                        </View>

                        <View style={styles.rows}>
                            <Text style={styles.rowText}>Sets</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={'---'}
                                value={sets}
                                onChangeText={(text) => setSets(text)}
                            />
                        </View>

                        <View style={styles.rows}>
                            <Text style={styles.rowText}>Weight</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={"---/---/---"}
                                value={weights}
                                onChangeText={(text) => setWeights(text)}
                            />
                        </View>

                        <View style={styles.rows}>
                            <Text style={styles.rowText}>Reps</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={"---/---/---"}
                                value={reps}
                                onChangeText={(text) => setReps(text)}
                            />
                        </View>

                    </View>
                    <TouchableOpacity style={styles.submit} activeOpacity={0.6} onPress={handleSaveLog}>
                        <Text style={{fontSize: 20, fontWeight: '700', color: '#F1F1F1'}}>Save log</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalView: {
        margin: 10,
        justifyContent: 'center'
    },
    modalContainer: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 20,
        borderRadius: 10

    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 15
    },
    input: {
        flex: 1,
        height: 40,
        width: 'auto',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#228CDB',
        borderRadius: 10,
        textAlign: 'center',
        paddingHorizontal: 10
    },
    submit: {
        height: 40,
        backgroundColor: '#228CDB',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    modalTable: {
        gap: 10,
        marginBottom: 15
    },
    rows: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },
    rowText: {
        width: '30%',
        height: 40,
        textAlign: 'center',
        fontSize: 25,



    }
})

export default LoggerModal;