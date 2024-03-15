import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


const Topbar = (props) => {
    const { title, subtitle } = props;

    return(
        <View style={styles.topbarContainer}>
            <View style={styles.topbarHeader}>
                <Text style={styles.topbarText}>{title}</Text>
                { 
                    title === 'Workouts' && 
                        <TouchableOpacity style={{position: 'absolute', right: '5%', bottom: 0}} onPress={() => props.setModalVisible(true)}>
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
})

export default Topbar;