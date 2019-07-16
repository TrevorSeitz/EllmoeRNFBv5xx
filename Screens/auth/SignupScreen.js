import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Alert
} from "react-native";
import * as firebase from 'react-native-firebase';
// import * as firestore from '@react-native-firebase/firestore';
import { AsyncStorage } from '@react-native-community/async-storage'

export default class SignupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
      errorMessage: null
    };
  }

  handleSignup = () => {
    const { name, email, password, passwordConfirm } = this.state;
    if (password != passwordConfirm) {
      Alert.alert("Passwords do not match");
      return;
    }
    console.log("inside handleSignup");
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => (user = user.user))
      .then(user => {
        return firebase
          .firestore()
        // return firestore
          .collection("users")
          .doc(user.uid)
          .set({
            name: name,
            email: email
          });
      })
      .then(result => this.props.navigation.navigate("Map"))
      .catch(
        () => {},
        error => {
          Alert.alert(error);
        }
      );

    _storeData = async user => {
      try {
        await AsyncStorage.setItem("uid", user.uid);
      } catch (error) {
        // Error saving data
      }
      this._retrieveData();
    };
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ paddingTop: 20 }}>SignupScreen</Text>
        {this.state.errorMessage && (
          <Text style={{ color: "red" }}>{this.state.errorMessage}</Text>
        )}
        <TextInput
          placeholder="Name"
          autoCapitalize="none"
          style={styles.TextInput}
          onChangeText={name => this.setState({ name })}
          value={this.state.name}
        />
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          style={styles.TextInput}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={styles.TextInput}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <TextInput
          secureTextEntry
          placeholder="Confirm Password"
          autoCapitalize="none"
          style={styles.TextInput}
          onChangeText={passwordConfirm => this.setState({ passwordConfirm })}
          value={this.state.passwordConfirm}
        />
        <Button title="Sign Up" onPress={this.handleSignup} />
        <Button
          title="Already have an account? Login"
          onPress={() => this.props.navigation.navigate("Login")}
        />
        <Button
          title="Bypass this screen"
          onPress={() => this.props.navigation.navigate("Dashboard")}
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
    width: "90%",
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 8
  }
});
