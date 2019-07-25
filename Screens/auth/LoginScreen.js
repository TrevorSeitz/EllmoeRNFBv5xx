import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  // AsyncStorage
} from "react-native";
import firebase from 'react-native-firebase';
// import { firebase } from '@react-native-firebase/auth';
import { AsyncStorage } from '@react-native-community/async-storage'

export default class LoginScreen extends React.Component {
  state = {
    name: "",
    email: "",
    password: "",
    errorMessage: null
  };
  _ismounted = false;

  componentDidMount() {
    this._ismounted = true;
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  handleLogin = () => {
    const { name, email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => this._storeData(user))
      .catch(error => this.setState({ errorMessage: error.message }));
  };

  handleNavToSignup = () => {
    this.props.navigation.navigate("Signup")
  }

  _storeData = async user => {
    try {
      await AsyncStorage.setItem("uid", user.user.uid);
    } catch (error) {
      // Error saving data
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Login Screen</Text>
        {this.state.errorMessage && (
          <Text style={{ color: "red" }}>{this.state.errorMessage}</Text>
        )}
        <TextInput
          style={styles.TextInput}
          autoCapitalize="none"
          placeholder="Email"
          placeholderColor="black"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          style={styles.TextInput}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button title="Login" onPress={this.handleLogin} />
        <Button
          title="Don't have an account? Sign Up"
          onPress={this.handleNavToSignup}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  TextInput: {
    height: 40,
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 8
  }
});
