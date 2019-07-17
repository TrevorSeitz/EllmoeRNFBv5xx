import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView, Button, Constants } from 'react-native';
import { createAppContainer } from "react-navigation";
import ApiKeys from "./constants/ApiKeys";
import firebase from 'react-native-firebase';
// import { AsyncStorage } from 'react-native-community/async-storage'
// Components
// import GetCurrentLocation from './components/GetCurrentLocation'
// Navigators
import LoginSwitchNavigator from "./navigation/switches/LoginSwitchNavigator";
import AppSwitchNavigator from "./navigation/switches/AppSwitchNavigator";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.unsubscriber = null
    this.state = {
      switchValue: false,
      isLoadingComplete: false,
      isAuthenticationReady: false,
      isAuthenticated: false,
      latatude: 0,
      longitude: 0,
      user: null,
      uid: ""
    };
    this._ismounted = false;
  }

  componentDidMount() {
    this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
      this.setState({ user });
    });
    console.log("in App.js")
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
    this._ismounted = false;
  }

  authListener() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this._storeData(user);
        this.setState({ user, uid: user.uid });
      } else {
        this.setState({ user: null });
      }
    });
  }

  _storeData = async user => {
    try {
        await AsyncStorage.multiSet([["uid", user.uid], ["latitude", this.state.latitude], ["longitude", this.state.longitude] ]);
    } catch (error) {}
  };

  render() {
    const user = this.state.user;
    // return (
    return (
      <TestScreen />
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
