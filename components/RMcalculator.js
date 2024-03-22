import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Modal from 'react-native-modal';

const RMcalculator = ({ isVisible, setIsVisible }) => {
    const [weight, setWeight] = useState();
    const [reps, setReps] = useState();


    return (
    <Modal isVisible={isVisible}
        style={styles.modalView}
        onBackdropPress={() => setIsVisible(false)}
        animationIn={'slideInDown'}
        animationOut={'slideOutDown'}
    >
        <View style={styles.modalContent}>
            <View style={{gap: 15, marginTop: 10}}>
                <View style={styles.modalRows}>
                    <Text style={styles.modalText}>Weight</Text>
                    <TextInput
                        style={styles.input}
                        placeholder=''
                        value={weight}
                        onChangeText={(w) => setWeight(w)}
                        keyboardType='numeric'
                    />
                </View>
                <View style={styles.modalRows}>
                    <Text style={styles.modalText}>Reps</Text>
                    <TextInput
                        style={styles.input}
                        placeholder=''
                        value={reps}
                        onChangeText={(reps) => setReps(reps)}
                        keyboardType='numeric'   
                    />
                </View>
            </View>
            <TouchableOpacity style={styles.modalButton} activeOpacity={0.6}>
                <Text style={{fontSize: 24, fontWeight: 'bold', color: '#F1F1F1'}}>Calculate 1RM</Text>
            </TouchableOpacity>
        </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
    modalView: {
        margin: 0,
        justifyContent: 'flex-end',
        height: 200
    },
    modalContent: {
        backgroundColor: '#2D2D2D',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    modalRows: {
        flexDirection: 'row',
        gap: 40
    },
    modalText: {
        color: '#FFFFFF',
        fontSize: 24,
        width: '20%'
    },
    input: {
        backgroundColor: '#F1F1F1',
        width: '70%',
        height: 45,
        borderRadius: 10
    },
    modalButton: {
        backgroundColor: '#228CDB',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 20
    }
})

export default RMcalculator