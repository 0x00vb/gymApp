import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Topbar from "../components/Topbar";
import Icon from "react-native-vector-icons/Ionicons";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import RMcalculator from "../components/RMcalculator";
import ProgressChart from "../components/ProgessChart";

const StatsScreen = () => {
    const [RMcalcVisible, setRMcalcVisible] = useState(false);

    return(
        <View>
            <Topbar title={"Statistics"}/>
            <View style={styles.widgetsContainer}>
                <View style={styles.upperSection}>

                    <View style={styles.widget}>
                        <Text style={styles.widgetTitle}>Workouts</Text>
                        <View style={styles.widgetSpan}>
                            <Text style={{fontSize: 20}}>64</Text>
                        </View>
                        <Icon name="barbell" size={60} color={'#212121'}/>
                    </View>

                    <View style={styles.widget}>
                        <Text style={styles.widgetTitle}>Workouts</Text>
                        <View>
                            <Text style={{fontSize: 20}}>64</Text>
                        </View>
                        <Icon name="barbell" size={60}/>
                    </View>

                </View>

                <ProgressChart/>

                <TouchableOpacity style={styles.RMcalcWidget} onPress={() => setRMcalcVisible(true)}>
                    <Icon2 name="weight-lifter" size={34} color={'#21212'}/>
                    <Text style={{fontSize: 24, fontWeight: '500'}}>Calculate your 1 RM</Text>
                </TouchableOpacity>
            </View>
            <RMcalculator isVisible={RMcalcVisible} setIsVisible={setRMcalcVisible}/>   
        </View>
    )
}

const styles = StyleSheet.create({
    widgetsContainer: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 20,
        gap: 20
    },
    upperSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    widget: {
        backgroundColor: '#D9D9D9',
        width: '45%',
        aspectRatio: '1/1',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: 'rgb(0, 0, 0)',
        shadowRadius: 2,
        elevation: 7,
        shadowOffset: {
            width: 2,
            height: 4,
        },
    },
    widgetTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#217EC2',
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: {width: -0.2, height: 0.2},
        textShadowRadius: 10,
        marginTop: 5,
        marginBottom: 10
    },
    widgetSpan: {
        backgroundColor: '#F9F1F9',
        padding: 5,
        borderRadius: 100,
        aspectRatio: '1/1',
        alignItems: 'center',
        shadowColor: 'rgba(0, 0, 0, 0.75)',
        elevation: 7,
    },
    RMcalcWidget: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: '#D9D9D9',
        width: '100%',
        paddingVertical: 10,
        borderRadius: 10
    }
})

export default StatsScreen;