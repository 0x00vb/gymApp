import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";

import Topbar from "../components/Topbar";

const WorkoutSection = () => {
    const navigation = useNavigation();

    const hanldeCardPress = (title) => {
        navigation.navigate('WorkoutDays', {title})
      
    }

    return(
        <View>
            <Topbar title={'Workouts'}/>
            <ScrollView contentContainerStyle={styles.workoutsList}>

                <TouchableOpacity style={styles.workoutSplitCard} activeOpacity={0.7} onPress={() => hanldeCardPress('Arnold Split')}>
                    <Text style={styles.workoutSplitTitle}>Arnold Split</Text>
                    <Text style={styles.workoutSplitFrec}>6 days/week</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    workoutsList: {
        height: '100%',
        alignItems: 'center',
        marginTop: 30,
        gap: 24
    },
    workoutSplitCard: {
        width: 340,
        height: 80,
        backgroundColor: '#D9D9D9',
        borderRadius: 10,
        paddingTop: 10,
        paddingLeft: 15,
        gap: 3,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 4,
        shadowOpacity: 0.30,
    },
    workoutSplitTitle: {
        fontSize: 22,
        fontWeight: '500'
    },
    workoutSplitFrec: {
        fontSize: 14
    }
})

export default WorkoutSection;