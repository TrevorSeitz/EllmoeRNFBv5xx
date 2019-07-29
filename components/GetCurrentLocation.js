import React from "react";
// import * as Permissions from 'expo-permissions'
// import * as Location from 'expo-location'
// import Constants from 'expo-constants'
import { Location, Constants, Permissions, AsyncStorage } from 'react-native'
// import { AsyncStorage } from '@react-native-community/async-storage'

const GetCurrentLocation = () => {
  navigator.geolocation.getCurrentPosition(
    position => {
      const location = position.coords
      this._storeData(location)
    },
    error => Alert.alert(error.message),
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  );
}

  _storeData = async (location) => {
    try {
        await AsyncStorage.multiSet([ ["currentLatitude", location.latitude], ["currentLongitude", location.longitude] ]);
    } catch (error) {}
  };
export default GetCurrentLocation
