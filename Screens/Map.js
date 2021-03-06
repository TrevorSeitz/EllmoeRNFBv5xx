import React from "react";
import * as firebase from 'react-native-firebase';
// import * as firestore from '@react-native-firebase/firestore';
// //import firestore from "firebase/firestore";
import {
  Platform,
  Text,
  View,
  StyleSheet,
  AsyncStorage,
  Image,
  TouchableOpacity,
  Permissions,
  Location,
  Constants
} from "react-native";
// import { Marker } from "expo";
// import * as Permissions from 'expo-permissions'
// import * as Location from 'expo-location'
// import Constants from 'expo-constants'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import Icon from 'react-native-vector-icons/Ionicons'
// import { AsyncStorage } from '@react-native-community/async-storage'

// import GetCurrentLocation from '../components/GetCurrentLocation'

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    // this.unsubscribe = null;
    this.state = {
      uid: "",
      user: {},
      location: "",
      locations: [],
      checkLocation: {},
      latitude: 0,
      longitude: 0,
      errorMessage: null
    };
  }

  ref = firebase.firestore().collection("locations");
    // ref = firestore.collection("locations");

  componentWillMount() {
    if (Platform.OS === "android" && !Constants.isDevice) {
      this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      });
    }
    this._retrieveData()
    this.onCollectionUpdate()
    this._isMounted = true;
  }

  _retrieveData = async () => {
    // try {
      // const value = await AsyncStorage.getItem("uid");
      const newLocation = this.props.navigation.state.params
      const value = await AsyncStorage.multiGet(["uid", "currentLatitude", "currentLongitude"])
      this.setState({ uid: value[0][1],
                      latitude: parseFloat(value[1][1]),
                      longitude: parseFloat(value[2][1])
      })
      this.onCollectionUpdate()
      console.log("newLocation = ", newLocation)
      if(typeof newLocation == undefined){
        this.setState({latitude: parseFloat(newLocation.locationLatitude, 5),
                      longitude: parseFloat(newLocation.locationLongitude, 5)})
      }
  }

  _storeData = async () => {
    try {
      await AsyncStorage.setItem("locations", this.state.locations);
    } catch (error) {}
  };

  onCollectionUpdate = querySnapshot => {
    const uid = this.state.uid;
    let locations = [];
    this.ref
      .where("uid", "==", uid)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(doc => {
          const id = doc.id;
          const uid = doc.data().uid;
          const name = doc.data().name;
          const project = doc.data().project;
          const latitude = doc.data().latitude;
          const longitude = doc.data().longitude;
          const contactName = doc.data().contactName;
          const contactPhone = doc.data().contactPhone;
          const email = doc.data().email;
          const description = doc.data().description;
          const photosLocations = doc.data().photosLocations;
          const image = doc.data().image;
          const imageFileName = doc.data().imageFileName;
          const imageFileLocation = doc.data().imageFileLocation;
          locations.push({
            // id: doc.id,
            // uid: doc.data().uid,
            // name: doc.data().name,
            // project: doc.data().project,
            // latitude: doc.data().latitude,
            // longitude: doc.data().longitude,
            // contactName: doc.data().contactName,
            // contactPhone: doc.data().contactPhone,
            // email: doc.data().email,
            // description: doc.data().description,
            // photosLocations: doc.data().photosLocations,
            // image: doc.data().image,
            // imageFileName: doc.data().imageFileName,
            // imageFileLocation: doc.data().imageFileLocation
            id: id,
            uid: uid,
            name: name,
            project: project,
            latitude: latitude,
            longitude: longitude,
            contactName: contactName,
            contactPhone: contactPhone,
            email: email,
            description: description,
            photosLocations: photosLocations,
            image: image,
            imageFileName: imageFileName,
            imageFileLocation: imageFileLocation
          });
        });
      })
      .then(() => {
        this.setState({ locations });
      });

      console.log("Map State locations", this.state.locations)
  };

// for use with manually added "current position" button
  // getCurrentPosition = async () => {
  //   const location = await GetCurrentLocation()
  //   this.setState({ latitude: location.coords.latitude,
  //                   longitude: location.coords.longitude})
  // };

  goToLoc = location => {
    console.log("go to location: ", location)
    this.props.navigation.push("Details", {
      key: `${JSON.stringify(location.id)}`
    });
  };

  componentWillUnmount = () => {
    // this.unsubscriber();
    this._isMounted = false;
  }

  render() {
    let lat = parseFloat(this.state.latitude, 5);
    let long = parseFloat(this.state.longitude, 5);
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    }

    const locations = this.state.locations;

    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          showsScale={true}
          style={styles.map}
          region={{
            latitude: lat,
            longitude: long,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        >
          {this.state.locations.map((location, i) => {
            const latitude = Number(location.latitude);
            const longitude = Number(location.longitude);
            return (
              <MapView.Marker
                key={i}
                title={location.name}
                description={location.description + "**Click to View**"}
                coordinate={{ latitude, longitude }}
                onCalloutPress={() => this.goToLoc(location)}
              >
                <View>
                  <View style={styles.radius}>
                    <View style={styles.marker} />
                  </View>
                </View>
              </MapView.Marker>
            );
          })}
        </MapView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  radius: {
    height: 15,
    width: 15,
    borderRadius: 15 / 2,
    overflow: "hidden",
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(0, 122, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center"
  },
  marker: {
    height: 20,
    width: 20,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 20 / 2,
    overflow: "hidden",
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center"
  },
  currentMarker: {
    height: 20,
    width: 20,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 20 / 2,
    overflow: "hidden",
    backgroundColor: "#FF0000",
    alignItems: "center",
    justifyContent: "center"
  },
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center"
  },
  touchableArea: {
    opacity: 0.8,
    fontSize: 40,
    width: 80,
    height: 80,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    right: 0,
    bottom: 0
  },
  button: {
    opacity: 0.8,
    fontSize: 40,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  map: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
    flexDirection: "row"
  },
  text: {
    fontSize: 15,
    color: "black",
    alignSelf: "center"
  }
});

// "current position" button
// <TouchableOpacity
//   style={styles.touchableArea}
//   onPress={this.getCurrentPosition}
// >
//   <Icon name="md-locate" style={styles.button} />
// </TouchableOpacity>
