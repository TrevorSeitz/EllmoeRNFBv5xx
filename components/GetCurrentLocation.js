import React from "react";
// import * as Permissions from 'expo-permissions'
// import * as Location from 'expo-location'
// import Constants from 'expo-constants'
import { Location, Constants, Permissions } from 'react-native'
import { AsyncStorage } from '@react-native-community/async-storage'

const GetCurrentLocation = () => {
  console.log("inside Get Current Location")
  navigator.geolocation.getCurrentPosition(
    position => {
      const location = position.coords
      this._storeData(location)
      console.log("Position Current Location - latitude: ", location.latitude)
      console.log("Position Current Location - longitude: ", location.longitude)

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
