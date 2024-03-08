import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Modal from 'react-native-modal';

const LoggerModal = ({ modalVisible, setModalVisible }) => {
    return(
        <Modal
            isVisible={modalVisible}
            style={styles.modalView}
            onBackdropPress={() => setModalVisible(false)}
            animationIn={"slideInRight"}
            animationOut={'slideOutRight'}
        >
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Bench Press Log</Text>
                <View style={styles.modalTable}>
                    <View style={styles.rows}>
                        <Text style={styles.rowText}>Date</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={'DD/MM'}
                            // onChangeText={(text) => setText(text)}
                        />
                    </View>

                    <View style={styles.rows}>
                        <Text style={styles.rowText}>Sets</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={'---'}
                            // onChangeText={(text) => setText(text)}
                        />
                    </View>

                    <View style={styles.rows}>
                        <Text style={styles.rowText}>Weight</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={"---/---/---"}
                            // onChangeText={(text) => setText(text)}
                        />
                    </View>

                    <View style={styles.rows}>
                        <Text style={styles.rowText}>Reps</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={"---/---/---"}
                            // onChangeText={(text) => setText(text)}
                        />
                    </View>

                </View>
                <TouchableOpacity style={styles.submit} activeOpacity={0.6}>
                    <Text style={{fontSize: 20, fontWeight: '700', color: '#F1F1F1'}}>Save log</Text>
                </TouchableOpacity>
            </View>
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