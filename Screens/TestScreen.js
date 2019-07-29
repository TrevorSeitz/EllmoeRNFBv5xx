import React from "react";
import { StyleSheet, Text, View, AsyncStorage } from "react-native";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
// import { AsyncStorage } from '@react-native-community/async-storage'

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

  render() {
    console.log("This.state in TestScreen: ", this.state)
    const currentLatitude = this.state.currentLatitude
    const currentLongitude = this.state.currentLongitude
    return (
      <View style={styles.container}>
        <Text>TEST SCREEN</Text>
        <MapView
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          showsScale={true}
          style={styles.map}
          region={{
            // latitude: 42.882004,
            // longitude: 74.582748,
            latitude: currentLatitude,
            longitude: currentLongitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
          showsUserLocation={true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
});
