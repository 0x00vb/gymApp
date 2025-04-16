import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Topbar from "../components/Topbar";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDatabase } from "../context/DatabaseContext";
import ProgressChart from "../components/ProgessChart";
import PieChartGraph from "../components/PieChartGraph";
import RMcalculator from "../components/RMcalculator";
import StopWatch from '../components/StopWatch';
import { LinearGradient } from 'expo-linear-gradient';

const StatsScreen = () => {
    const [RMcalcVisible, setRMcalcVisible] = useState(false);
    const [workoutsAmount, setWorkoutsAmount] = useState(0);

    const db = useDatabase();

    useEffect(() => {
        const getWidgetData = async () => {
          try {
            const workoutsAmountResponse = await db.executeQuery('SELECT COUNT(DISTINCT date) AS workout_count FROM Logs');
            setWorkoutsAmount(workoutsAmountResponse[0].workout_count);
          } catch (e) {
            console.log('Error fetching widget data:', e);
          }
        }
        getWidgetData();
      }, [])    
    return(
        <View style={{backgroundColor: '#01050e'}}>
            <Topbar title={"Statistics"}/>
            <ScrollView contentContainerStyle={{paddingBottom: 175}}>
                <View style={styles.widgetsContainer}>
                    <View style={styles.upperSection}>
                        <LinearGradient
                            colors={['rgb(10, 20, 46)', 'rgb(6, 13, 27)', 'rgb(1, 6, 17)']}
                            start={{x: 1, y: 0}}
                            end={{x:0, y: 1}}       
                                                 
                            style={styles.widget}>
                            <View style={styles.widgetHeader}>
                                <Text style={styles.widgetTitle}>Workouts</Text>
                                <Icon name="weight-lifter" size={20} color={'#3C83F6'}/>
                            </View>
                            <View style={styles.widgetSpan}>
                                <Text style={{fontSize: 34, fontWeight:'bold', color: '#fdfdfd'}}>{workoutsAmount}</Text>
                                <Text style={{color: 'rgba(255, 255, 255, 0.7)'}}>This week</Text>
                            </View>
                        </LinearGradient>
                        <LinearGradient
                            colors={['rgb(10, 20, 46)', 'rgb(6, 13, 27)', 'rgb(1, 6, 17)']}
                            start={{x: 1, y: 0}}
                            end={{x: 0, y: 1}}                            
                            style={styles.widget}>
                            <View style={styles.widgetHeader}>
                                <Text style={styles.widgetTitle}>
                                    Rest timer
                                </Text>
                                <Icon name="timer-outline" size={20} color={'#3C83F6'}/>
                            </View>
                            <StopWatch/>
                        </LinearGradient>
                    </View>

                    <ProgressChart/>
                    <PieChartGraph/>

                    <TouchableOpacity style={styles.RMcalcWidget} onPress={() => setRMcalcVisible(true)}>
                        <Icon name="weight-lifter" size={34} color={'#000000'}/>
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
        overflow: 'hidden', // Ensures the gradient respects the border radius
    },
    widgetHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
    },
    widgetTitle: {
        fontSize: 20,
        fontWeight: '500',
        color: '#3C83F6',
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: {width: -0.2, height: 0.2},
        textShadowRadius: 10,
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center'
    },
    widgetSpan: {
        width: '100%',
        alignItems: 'center',
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