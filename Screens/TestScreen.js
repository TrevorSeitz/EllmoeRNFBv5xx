import React from "react";
import { StyleSheet, Text, View } from "react-native";

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
