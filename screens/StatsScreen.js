import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Topbar from "../components/Topbar";
import Icon from "react-native-vector-icons/Ionicons";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import { useSQLiteContext } from "expo-sqlite/next";
import ProgressChart from "../components/ProgessChart";
import PieChartGraph from "../components/PieChartGraph";
import RMcalculator from "../components/RMcalculator";
import StopWatch from '../components/StopWatch';

const StatsScreen = () => {
    const [RMcalcVisible, setRMcalcVisible] = useState(false);
    const [workoutsAmount, setWorkoutsAmount] = useState(0);

    const db = useSQLiteContext();

    useEffect(() => {
        const getWidgetData = async () => {
            try{
                const workoutsAmountResponse = await db.getAllAsync('SELECT COUNT(DISTINCT date) AS workout_count FROM Logs');
                
                setWorkoutsAmount(workoutsAmountResponse[0].workout_count);
            }catch(e){
                console.log(e);
            }
        }
        getWidgetData();
    }, [])
    
    return(
        <View>
            <Topbar title={"Statistics"}/>
            <ScrollView contentContainerStyle={{paddingBottom: 175}}>
                <View style={styles.widgetsContainer}>
                    <View style={styles.upperSection}>
                        <View style={styles.widget}>
                            <Text style={styles.widgetTitle}>Workouts</Text>
                            <View style={styles.widgetSpan}>
                                <Text style={{fontSize: 20}}>{workoutsAmount}</Text>
                            </View>
                            <Icon name="barbell" size={60}/>
                        </View>
                        <View style={[styles.widget, {backgroundColor: '#2d2d2d'}]}>
                            <Text style={styles.widgetTitle}>
                                Rest timer
                            </Text>
                            <StopWatch/>
                        </View>
                    </View>

                    <ProgressChart/>
                    <PieChartGraph/>

                    <TouchableOpacity style={styles.RMcalcWidget} onPress={() => setRMcalcVisible(true)}>
                        <Icon2 name="weight-lifter" size={34} color={'#000000'}/>
                        <Text style={{fontSize: 24, fontWeight: '500'}}>Calculate your 1 RM</Text>
                    </TouchableOpacity>
                </View>
                <RMcalculator isVisible={RMcalcVisible} setIsVisible={setRMcalcVisible}/>
            </ScrollView>
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
        fontSize: 24,
        fontWeight: 'bold',
        color: '#217EC2',
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: {width: -0.2, height: 0.2},
        textShadowRadius: 10,
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center'
    },
    widgetSpan: {
        backgroundColor: '#e6e6e6',
        padding: 3,
        borderRadius: 100,
        aspectRatio: '1/1',
        alignItems: 'center',
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        elevation: 7, // android
        shadowOffset: {
            height: 1,
            width: 1
        },
        shadowOpacity: 0.5,
        shadowRadius: 3,
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