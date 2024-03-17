import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Topbar from "../components/Topbar";

const StatsScreen = () => {
    return(
        <View>
            <Topbar title={"Statistics"}/>
        </View>
    )
}

const styles = StyleSheet.create({
    
})

export default StatsScreen;