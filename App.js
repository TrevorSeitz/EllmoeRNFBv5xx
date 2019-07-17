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

<<<<<<< HEAD
  componentDidMount() {
    this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
      this.setState({ user });
    });
    console.log("in App.js")
=======
  async componentDidMount() {
    // TODO: You: Do firebase things
    // const { user } = await firebase.auth().signInAnonymously();
    // console.warn('User -> ', user.toJSON());

    // await firebase.analytics().logEvent('foo', { bar: '123'});

    this.authListener();
    // this.getCurrentLocation()
    this._ismounted = true;
  }


  getCurrentLocation = async () => {
    const location = await GetCurrentLocation()
    this.setState({ latitude: location.coords.latitude,
                    longitude: location.coords.longitude})
>>>>>>> 69b6088ae4c7544b10c66f3927b6a9b4399aeb8f
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

<<<<<<< HEAD
  render() {
    if (this.state.user) {
      this._storeData()
    } else {
      return <LoginScreen />;
    }
=======
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
>>>>>>> 69b6088ae4c7544b10c66f3927b6a9b4399aeb8f

  render() {
    const user = this.state.user;
    // return (
    return (
<<<<<<< HEAD
      <TestScreen />
=======
      <View style={styles.container}>
        {!user ? <LoginContainer /> : <AppContainer />}
      </View>
>>>>>>> 69b6088ae4c7544b10c66f3927b6a9b4399aeb8f
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
