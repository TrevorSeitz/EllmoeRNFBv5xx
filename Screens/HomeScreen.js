import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { AsyncStorage } from '@react-native-community/async-storage'
import Map from "./Map";

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: ""
    };
    this._retrieveData();
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("uid");
      if (value !== null) {
        this.setState({ uid: value });
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Map {...this.props} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 0
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"
  }
});
