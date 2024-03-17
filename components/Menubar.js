import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/Ionicons'
const Menubar = () => {
    const navigation = useNavigation();

    return(
        <View style={styles.menubarContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Workouts')}>
                <Icon name="barbell" size={38} color={'#f1f1f1'}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Stats')}>
                <Icon name="stats-chart" size={38} color={'#f1f1f1'}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('GymsMap')}>
                <Icon name="map" size={38} color={'#f1f1f1'}/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    menubarContainer:{
        position: 'absolute',
        bottom: 20,
        backgroundColor: '#2d2a2ad8',
        width: 'auto',
        height: 45,
        borderRadius: 40,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
        gap: 20
    }

})

export default Menubar;