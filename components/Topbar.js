import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Modal from 'react-native-modal'
import Icon from 'react-native-vector-icons/FontAwesome';


const Topbar = (props) => {
    const { title, subtitle } = props;
    const [modalVisible, setModalVisible] = useState(false);
    const [workoutName, setWorkoutName] = useState('');

    const toggleModal = () => {
        setModalVisible(true);
    }

    const handleAddWorkout = () => {

    }

    return(
        <View style={styles.topbarContainer}>
            <View style={styles.topbarHeader}>
                <Text style={styles.topbarText}>{title}</Text>
                { 
                    title === 'Workouts' && 
                        <TouchableOpacity style={{position: 'absolute', right: '5%', bottom: 0}} onPress={toggleModal}>
                            <Icon name="plus" size={30} color={'#228CDB'}/>
                        </TouchableOpacity>
                }
            </View>
            {
                subtitle && (
                    <View style={{width: '100%', borderTopWidth: 1, borderTopColor: '#f1f1f1', alignItems: 'center', paddingVertical: 5}}>
                        <Text style={{color: '#f1f1f1', fontSize: 24, fontWeight: '600'}}>{subtitle}</Text>
                    </View>
                )
            }
            <Modal isVisible={modalVisible} style={styles.modalView} onBackdropPress={() => setModalVisible(false)}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Add workout</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Workout name"
                        value={workoutName}
                        onChangeText={(text) => setWorkoutName(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder=""
                    />
                    <TouchableOpacity onPress={() => handleAddWorkout()} style={styles.saveButton} activeOpacity={0.6}>
                        <Text style={{fontSize: 18, fontWeight: '700', color: '#f1f1f1'}}>Save workout</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    topbarContainer: {
        backgroundColor: '#2d2d2d',
        alignItems: 'center',
        top: 0,
        minHeight: 100,
        height: 'auto',
        width: '100%',
        flexDirection: 'column',
        borderBottomEndRadius: 20,
        borderBottomLeftRadius: 20,
        gap: 10
    },
    topbarHeader: {
        width: '100%',
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'center'
        
    },
    topbarText: {
        color: '#f1f1f1',
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 30,
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
    }
})

export default Topbar;