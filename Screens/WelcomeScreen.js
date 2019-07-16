import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

class WelcomeScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Text>Welcome to ELLMOE!!</Text>
          <Text>Your Electronic Location Manager</Text>
        </View>
        <Button
          title="Login"
          onPress={() => this.props.navigation.navigate("Login")}
        />
        <Button
          title="Sign Up"
          onPress={() => this.props.navigation.navigate("Signup")}
        />
        <Button
          title="ForgotPassword"
          onPress={() => this.props.navigation.navigate("ForgotPassword")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 25
  }
});

export default WelcomeScreen;
