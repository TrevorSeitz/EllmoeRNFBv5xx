import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView, TextInput } from 'react-native';
import firebase from 'react-native-firebase';

import TestScreen from './Screens/TestScreen'
import LoginScreen from './Screens/auth/LoginScreen'
import ApiKeys from "./constants/ApiKeys";

export default class App extends React.Component {
  constructor() {
    super();
    this.unsubscriber = null;
    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    // TODO: You: Do firebase things
    // const { user } = await firebase.auth().signInAnonymously();
    // console.warn('User -> ', user.toJSON());

    // await firebase.analytics().logEvent('foo', { bar: '123'});

    this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
      this.setState({ user });
    });
  }

  componentWillUnmount() {
    // if (this.unsubscriber) {
      this.unsubscriber();
    // }
  }

  render() {
    if (!this.state.user) {
      return <LoginScreen />;
    }

    return (
      <View style={styles.container}>
          <Text>There is a user</Text>
          <TextInput
            placeholder={"User"}
            value={this.state.user.email}
            onChangeText={text => this.updateTextInput(text, "name")}
          />
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
