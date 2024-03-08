import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/Ionicons'
const Menubar = () => {
    const navigation = useNavigation();

    return(
        <View style={styles.menubarContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Workouts')}>
                <Icon name="barbell" size={31} color={'#f1f1f1'}/>
            </TouchableOpacity>
            <TouchableOpacity>
                <Icon name="stats-chart" size={31} color={'#f1f1f1'}/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    menubarContainer:{
        position: 'absolute',
        bottom: 20,
        backgroundColor: '#2d2a2ad8',
        width: 115,
        height: 45,
        borderRadius: 20,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 15
    }

})

export default Menubar;