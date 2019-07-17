import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView, TextInput, Button, AsyncStorage } from 'react-native';
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

  _storeData = async () => {
    const user = this.state.user._user.uid
    try {
      await AsyncStorage.setItem('user', user);
    } catch (error) {
      // Error saving data
    }
  };

  _retrieveData = async () => {
    console.log(this.state.user)
    try {
      const value = await AsyncStorage.getItem('user');
      if (value !== null) {
        // We have data!!
        console.log(value);
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  componentWillUnmount() {
    // if (this.unsubscriber) {
      this.unsubscriber();
    // }
  }

  render() {
    if (this.state.user) {
      this._storeData()

    } else {
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
          <Button
            large
            title="Get Data"
            onPress={() => this._retrieveData()}
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
