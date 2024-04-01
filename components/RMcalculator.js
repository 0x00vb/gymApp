import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Modal from 'react-native-modal';

const RMcalculator = ({ isVisible, setIsVisible }) => {
    const [weight, setWeight] = useState();
    const [reps, setReps] = useState();


    return (
    <Modal isVisible={isVisible}
        style={styles.modalView}
        onBackdropPress={() => setIsVisible(false)}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
    >
        <KeyboardAvoidingView
            style={{}}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
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

        </KeyboardAvoidingView>
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
        gap: 35
    },
    modalText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '500',
        width: '20%'
    },
    input: {
        backgroundColor: '#F1F1F1',
        width: '70%',
        height: 45,
        borderRadius: 10,
        fontSize: 18,
        textAlign: 'center'
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