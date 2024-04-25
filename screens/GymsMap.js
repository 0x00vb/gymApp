import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Topbar from "../components/Topbar";
import Icon from 'react-native-vector-icons/FontAwesome';

const GOOGLE_MAPS_API_KEY = "YOUR_API_HERE";

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
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=4000&type=gym&key=${GOOGLE_MAPS_API_KEY}`
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
                showsMyLocationButton={true}
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
        <TouchableOpacity
          style={locationBtnStyle}
          activeOpacity={0.9}
          onPress={null}
        >
          <Icon name='location-arrow' size={25} color={'#228CDB'}/>
        </TouchableOpacity>
    </View>
  )
}

const locationBtnStyle = {
  backgroundColor: "#f1f1f1",
  width: 50,
  height: 50,
  borderRadius: 30,
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  bottom: 60,
  right: 30,
  shadowOffset: {
    width: 1,
    height: 2,
  },
  shadowOpacity: 0.6,
  shadowRadius: 4,
  elevation: 5, // Android
}

export default GymsMap;
