import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Topbar from "../components/Topbar";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

function GymsMap() {
    const [initialRegion, setInitialRegion] = useState(null);
    const [gyms, setGyms] = useState([]);
    
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      await fetchGyms(location.coords.latitude, location.coords.longitude);
    };
    
    getLocation();
  }, []);

  const fetchGyms = async (latitude, longitude) => {
    try{
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=2000&type=gym&key=${GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        setGyms(data.results)
        console.log(data)
    }catch(e){
        console.log(e);
    }
  }

  return (
    <View style={{flex: 1}}>
        <Topbar title={'Gym finder'}/>
        <View style={{height: '100%'}}>
            <MapView
                style={{width: '100%', height: '100%'}}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                followsUserLocation={true}
                initialRegion={initialRegion}
            >
                {gyms.map((gym, index) => (
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: gym.geometry.location.lat,
                            longitude: gym.geometry.location.lng
                        }}
                        title={gym.name}
                        description={gym.vicinity}
                    />
                ))}
            </MapView>
                
        </View>
    </View>
  )
}

export default GymsMap;