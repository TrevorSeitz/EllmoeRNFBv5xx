import React from "react";
import { StyleSheet, Text, View, AsyncStorage } from "react-native";

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: "Test"
  };

  constructor(props) {
    super(props);
    this.state = {
      user: {},
      uid: ''
    };
    this._retrieveData()
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("uid");
      console.log("Value: ", value)
      if (value !== null) {
        this.setState({ uid: value });
      }
    } catch (error) {
      // Error retrieving data
    }
    console.log(this.state)
  };


  render() {
    return (
      <View style={styles.container}>
        <Text>TEST SCREEN</Text>
      </View>
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
