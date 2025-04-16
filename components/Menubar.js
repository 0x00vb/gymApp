import React from "react";
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { navigationRef } from '../App'; // <- use the same ref
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Menubar = ({ currentRoute }) => {
    const iconColor = (screenName) => screenName === currentRoute ? '#3C83F6' : '#f1f1f1';

    return (
        <View style={styles.menubarContainer}>
            <TouchableOpacity onPress={() => navigationRef.navigate('Workouts')}>
                <Icon name="dumbbell" size={30} color={iconColor('Workouts')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigationRef.navigate('Stats')}>
                <Icon name="chart-timeline-variant" size={30} color={iconColor('Stats')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigationRef.navigate('GymsMap')}>
                <Icon name="calendar-blank-outline" size={30} color={iconColor('GymsMap')} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    menubarContainer: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#27272a',
        width: '100%',
        height: '9%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        paddingHorizontal: 15,
    }
});

export default Menubar;
