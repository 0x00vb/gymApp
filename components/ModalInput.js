import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Modal from 'react-native-modal';

const ModalInput = ({ title, buttonText, setText, placeholder, inputValue, modalVisible, setModalVisible, onSubmit }) => {
    return(
        <Modal isVisible={modalVisible} style={styles.modalView} onBackdropPress={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>{title}</Text>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={inputValue}
                    onChangeText={(text) => setText(text)}
                />
                <TouchableOpacity style={styles.submit} activeOpacity={0.6} onPress={onSubmit}>
                    <Text style={{fontSize: 18, fontWeight: '700', color: '#F1F1F1'}}>{buttonText}</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalView: {
        margin: 0,
        justifyContent: 'flex-end'
    },
    modalContainer: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 20

    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 15
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#228CDB',
        borderRadius: 10,
        marginBottom: 10,
        paddingHorizontal: 10
    },
    submit: {
        height: 40,
        backgroundColor: '#228CDB',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    }
})

export default ModalInput;