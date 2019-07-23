import React from "react";
// import * as Permissions from 'expo-permissions'
// import * as Location from 'expo-location'
// import Constants from 'expo-constants'
import { Location, Constants, Permissions } from 'react-native'
// import { AsyncStorage } from 'react-native-community/async-storage'

 const GetCurrentLocation = async () => {
  // let { status } = await Permissions.askAsync(Permissions.LOCATION);
  let { status } = await navigator.geolocation.requestAuthorization()

  if (status !== "granted") {
    this.setState({
      errorMessage: "Permission to access location was denied"
    });
  }

// navigator.geolocation.getCurrentPosition(geo_success, [geo_error], [geo_options])
  let location = navigator.geolocation.getCurrentPosition(console.log(result))
  // let location = await Location.getCurrentPositionAsync({});
  // await AsyncStorage.multiSet([ ["latitude", this.state.latitude], ["longitude", this.state.longitude] ]);
  return(location)
}
export default GetCurrentLocation
