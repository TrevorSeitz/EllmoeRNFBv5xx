import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView, Constants, TextInput, AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';
import { createAppContainer } from "react-navigation";
// import { AsyncStorage } from '@react-native-community/async-storage'  // change to this once AsyncStorage is depricated from react-native
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
  }

  getCurrentLocation = async () => {
    const location = await GetCurrentLocation()
  }

  _storeData = async () => {
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
  const user = this.state.user;
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
    backgroundColor: "#ecf0f1",
    padding: 8
  },
});
