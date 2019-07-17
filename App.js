import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView, TextInput } from 'react-native';
import firebase from 'react-native-firebase';

import TestScreen from './Screens/TestScreen'
import LoginScreen from './Screens/auth/LoginScreen'
import ApiKeys from "./constants/ApiKeys";

export default class App extends React.Component {
  constructor() {
    super();
    this.unsubscriber = null;
    this.state = {
      user: null,
    };
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
    // if (this.unsubscriber) {
      this.unsubscriber();
    // }
  }

  render() {
    if (this.state.user) {
      this._storeData()
    } else {
      return <LoginScreen />;
    }

    return (
      <TestScreen />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
