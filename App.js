import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView, Constants, TextInput, AsyncStorage } from 'react-native';
// import { AsyncStorage } from '@react-native-community/async-storage'
import firebase from 'react-native-firebase';
import { createAppContainer } from "react-navigation";
// Navigators
import LoginSwitchNavigator from "./navigation/switches/LoginSwitchNavigator";
import AppSwitchNavigator from "./navigation/switches/AppSwitchNavigator";
//  Screens
import TestScreen from './Screens/TestScreen'
import HomeScreen from './Screens/HomeScreen'
import LoginScreen from './Screens/auth/LoginScreen'
//  Constants
import ApiKeys from "./constants/ApiKeys";
//  Components
import GetCurrentLocation from './components/GetCurrentLocation'

export default class App extends React.Component {
  constructor() {
    super();
    this.unsubscriber = null;
    this._isMounted = false;
    this.state = {
      user: null,
    };
  }

  componentWillMount() {
    this.getCurrentLocation()
  }

  componentDidMount() {
    this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
      this.setState({ user });
      this._isMounted = true ;
    });
    console.log("in App.js")
  }

  getCurrentLocation = async () => {
    console.log("Trying to get current location")
    const location = await GetCurrentLocation()
    // this.setState({ latitude: location.coords.latitude,
    //                 longitude: location.coords.longitude})
    console.log("Current Location: ", location)
  }

  _storeData = async () => {
    console.log("App.js Set Data uid: ", this.state.user.uid);
    try {
      await AsyncStorage.setItem("uid", this.state.user.uid);
    } catch (error) {
      // Error saving data
    }
  };

  componentWillUnmount() {
    if (this.unsubscriber) {
      this.unsubscriber();
    }
    this._isMounted = false

  }

render() {
  // this.getCurrentLocation()
  const user = this.state.user;
  // return (
  return (
    <View style={styles.container}>
      {!user ? <LoginContainer /> : <AppContainer />}
    </View>
  );
}
}

const AppContainer = createAppContainer(AppSwitchNavigator);
const LoginContainer = createAppContainer(LoginSwitchNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
    padding: 8
  },
});
