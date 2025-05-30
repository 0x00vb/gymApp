import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Modal from 'react-native-modal';

const ModalInput = ({ title, buttonText, setText, placeholder, inputValue, modalVisible, setModalVisible, onSubmit }) => {
    return(
        <Modal isVisible={modalVisible} style={styles.modalView} onBackdropPress={() => {setText("");setModalVisible(false)}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : null}
            >
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
            </KeyboardAvoidingView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalView: {
        margin: 0,
        justifyContent: 'flex-end'
    },
    modalContainer: {
        backgroundColor: '01050e',
        padding: 20
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 15,
        color: '#fdfdfd'
    },
    input: {
        color: '#fdfdfd',
        height: 40,
        borderWidth: 1,
        borderColor: '#3C83F6',
        borderRadius: 10,
        marginBottom: 10,
        paddingHorizontal: 10
    },
    submit: {
        height: 40,
        backgroundColor: '#3C83F6',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    }
})

export default ModalInput;