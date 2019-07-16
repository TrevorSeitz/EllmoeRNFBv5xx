import React from "react";import {
  Platform,
  Text,
  TextInput,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Permissions,
  Location,
  Button,
  Constants
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import Icon from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-community/async-storage'
import firebase from 'react-native-firebase';


export default class Map extends React.Component {
  static navigationOptions = {
    title: "Map"
  };

  constructor(props) {
    super(props);
    this.state = {
      user: {},
      uid: this._retrieveData
    };
  }

  componentWillMount() {
    // this._retrieveData()

    if (Platform.OS === "android" && !Constants.isDevice) {
      this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      });
    }
  }

  _retrieveData = async () => {
    try {
      AsyncStorage.getItem('uid')
      // const value = await AsyncStorage.getItem('uid')

      // this.setState(previousState => (
      //   {
      //     uid: AsyncStorage.getItem('uid')
      //   }
      // ))

      this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate)

    } catch (error) {}

  // const value = await AsyncStorage.getItem("uid");
  // value = [["hello"], ["goodbye"], ["what?"]]
  // console.log("??????????????Value ###1: ", value )
  // value = await AsyncStorage.multiGet(["uid", "latitude", "longitude"])
  // console.log("??????????????Value ###2!!!: ", value )
  // if (value !== null) {
  //   this.setState({ uid: value[0][1],
  //                   latitude: parseFloat(value[1][1]),
  //                   longitude: parseFloat(value[2][1])
  //   })
  //   if(this.props.navigation.state.params) {
  //     const newlocation = this.props.navigation.state.params
  //     this.setState({latitude: parseFloat(this.props.navigation.state.params.locationLatitude, 5),
  //                   longitude: parseFloat(this.props.navigation.state.params.locationLongitude, 5)})
  //     console.log("this.state.locationLatitude", this.state.locationLatitude)
  //   }
  };


  render() {
      console.log("MAP Rendered !!!")
      if (this.state.uid) {
        console.log("retreived uid: ", this.state.uid)
      }
      const uid = this.state.uid[0]
    return (
      <View style={styles.container}>
        <Text>TEST SCREEN</Text>
            {uid}
          <Button
            title="LogOut"
            onPress={() => firebase.auth().signOut()}
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
