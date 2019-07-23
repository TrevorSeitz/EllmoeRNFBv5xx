import React from "react";
import * as firebase from 'react-native-firebase';
import { View } from "react-native";

export default class LogoutScreen extends React.Component {
  logout = () => {
    firebase.auth().signOut().then((response) => {
      console.log("Logout response: ", response)
      this.props.navigation.navigate("Welcome")
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
      console.log("Logout error: ", error)
    });
  };
  render() {
    this.logout();
    return <View />;
  }
}
