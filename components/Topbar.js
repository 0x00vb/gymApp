import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


const Topbar = (props) => {
    const { title, subtitle } = props;

    return(
        <View style={styles.topbarContainer}>
            <View style={styles.topbarHeader}>
                <Text style={[styles.topbarText, Platform.OS == "android" && {marginTop: 15}]}>{title}</Text>
                { 
                    title === 'Workouts' && 
                        <TouchableOpacity
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'absolute', 
                                right: '5%', 
                                bottom: 0,
                                width: 35,
                                height: 35,
                                borderRadius: 50,
                                backgroundColor: '#18263E',
                            }}
                            onPress={() => props.setModalVisible(true)}
                        >
                            <Icon name="add" size={23} color={'#3C83F6'}/>
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
        backgroundColor: '01050e',
        minHeight: 10,
        height: 'auto',
        width: '100%',
        flexDirection: 'column',

    },
    topbarHeader: {
        width: '100%',
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 5,
        paddingLeft: 20,

    },
    topbarText: {
        color: '#f1f1f1',
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 30,
    },
})

export default Topbar;