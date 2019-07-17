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
      uid: '',
      currentLatitude:0,
      currentLongitude: 0
    };
    this._retrieveData()
    this._getKeys()
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.multiGet(["uid", "currentLatitude", "currentLongitude"]);
      if (value !== null) {
        this.setState({ uid: value[0][1] });
        this.setState({ currentLatitude: value[1][1] });
        this.setState({ currentLongitude: value[2][1] });
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  _getKeys = async () => {
    const keys = await AsyncStorage.getAllKeys()
    console.log("All Stored Keys: ", keys)
  }


  render() {
    console.log("This.state in TestScreen: ", this.state)
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
