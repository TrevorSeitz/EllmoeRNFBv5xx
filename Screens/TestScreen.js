import React from "react";
import { StyleSheet, Text } from "react-native";

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: "Test"
  };

  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    return (
      <View>
        <Test>TEST SCREEN</Test>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
