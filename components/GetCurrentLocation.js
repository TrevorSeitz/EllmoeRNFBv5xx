import React from "react";
// import * as Permissions from 'expo-permissions'
// import * as Location from 'expo-location'
// import Constants from 'expo-constants'
import { Constants, Permissions } from 'react-native'
// import { AsyncStorage } from 'react-native-community/async-storage'

const GetCurrentLocation = async () => {
  // console.log("inside Get Current Location")
  // Permissions.askAsync(Permissions.NOTIFICATIONS).then(console.log).catch(console.warn);
  // let { status } = await Permissions.askAsync(Permissions.LOCATION);
  // if (status !== "granted") {
  //   this.setState({
  //     errorMessage: "Permission to access location was denied"
  //   });
  // }
  //
  // let location = await Location.getCurrentPositionAsync({});
  // // await AsyncStorage.multiSet([ ["latitude", this.state.latitude], ["longitude", this.state.longitude] ]);
  //   return(location)

  let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
      console.log(" Permission status in Get Current Location: ", status)
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  }
export default GetCurrentLocation
