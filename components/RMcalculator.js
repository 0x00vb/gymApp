import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import Modal from 'react-native-modal';

const RMcalculator = ({ isVisible, setIsVisible }) => {
    const [weight, setWeight] = useState();
    const [reps, setReps] = useState();
    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [RMresults ,setRMresults] = useState([]);

    const calculateRM = () => {
        if(weight == null || reps == null){return;}
        setWeight();
        setReps();
        const result1 = weight / (1.0278 - 0.0278 * reps);
        const result2 = result1 * 95 / 100;
        const result3 = result1 * 90 / 100;
        setRMresults([result1, result2, result3].map(i => (i.toFixed(2))));
        Keyboard.dismiss();
        setResultModalVisible(true);
    }

    return (
    <Modal isVisible={isVisible}
        style={styles.modalView}
        onBackdropPress={() => {setIsVisible(false); setResultModalVisible(false);}}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
    >
        <KeyboardAvoidingView
            style={{}}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
        >
            {
                !resultModalVisible ? 
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
                        <TouchableOpacity style={styles.modalButton} activeOpacity={0.6} onPress={calculateRM}>
                            <Text style={{fontSize: 24, fontWeight: 'bold', color: '#F1F1F1'}}>Calculate 1RM</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={styles.modalContent}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, borderBottomWidth: 1, borderBottomColor: '#D9D9D9'}}>
                            <View>
                                <Text style={styles.resultHeaderTitles}>
                                    1RM percentage
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.resultHeaderTitles}>
                                    Lift weight
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.resultHeaderTitles}>
                                    Repetitions
                                </Text>
                            </View>
                        </View>
                        <View style={styles.resultsGrid}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-around', borderBottomColor: 'gray', borderBottomWidth: 1, paddingVertical: 7}}>
                                <View>
                                    <Text style={styles.resultsText}>
                                        100%
                                    </Text>
                                </View>
                                <View>
                                    <Text style={styles.resultsText}>
                                        {RMresults[0]}kg
                                    </Text>
                                </View>
                                <View>
                                    <Text style={styles.resultsText}>
                                        1
                                    </Text>
                                </View>
                            </View>

                            <View style={{flexDirection: 'row', justifyContent: 'space-around', borderBottomColor: 'gray', borderBottomWidth: 1, paddingVertical: 7}}>
                                <View>
                                    <Text style={styles.resultsText}>
                                        95%
                                    </Text>
                                </View>
                                <View>
                                    <Text style={styles.resultsText}>
                                        {RMresults[1]}kg
                                    </Text>
                                </View>
                                <View>
                                    <Text style={styles.resultsText}>
                                        2
                                    </Text>
                                </View>
                            </View>

                            <View style={{flexDirection: 'row', justifyContent: 'space-around', borderBottomColor: 'gray', borderBottomWidth: 1, paddingVertical: 7}}>
                                <View>
                                    <Text style={styles.resultsText}>
                                    90%
                                    </Text>
                                </View>
                                <View>
                                    <Text style={styles.resultsText}>
                                        {RMresults[2]}kg
                                    </Text>
                                </View>
                                <View>
                                    <Text style={styles.resultsText}>
                                        4
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

            }
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
    },
    resultHeaderTitles: {
        fontSize: 17,
        fontWeight: '600',
        color: '#D9D9D9'
    },
    resultsGrid: {
        backgroundColor: '#D9D9D9',

        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    resultsText: {
        fontSize: 18,
    }
})

export default RMcalculator