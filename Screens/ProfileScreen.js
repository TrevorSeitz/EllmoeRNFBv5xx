import React from "react";
import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  View,
  TouchableOpacity,
  Alert,
  Text,
  Font,
  MediaLibrary,
  ImagePicker,
  ImageManipulator,
  Permissions,
  Location
} from "react-native";
import { TextInput } from "react-native-paper";
import { Button } from "react-native-elements";
import * as firebase from 'react-native-firebase';
// import * as firestore from '@react-native-firebase/firestore';
import { AsyncStorage } from '@react-native-community/async-storage'
//import firestore from "firebase/firestore";
// import { Font } from "expo";
// import * as MediaLibrary from 'expo-media-library'
// import * as ImagePicker from 'expo-image-picker'
// import * as ImageManipulator from 'expo-image-manipulator'
// import * as Permissions from 'expo-permissions'
// import * as Location from 'expo-location'

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: "Profile"
  };

  constructor(props) {
    super(props);
    this.state = {
      uid: "",
      name: "",
      phone: "",
      email: "",
      avatar: {},
      avatarFileName: "",
      avatarLocalUri: "",
      avatarFileLocation: "",
      isLoading: false
    };
    this._retrieveData();
    this.ref = firebase.firestore().collection("users");
    // this.ref = firestore.collection("users");
  }

  _retrieveData = async () => {
    const value = await AsyncStorage.getItem("uid")
      .then(value => {
        if (value !== null) {
          this.setState({ uid: value });
          this.onCollectionUpdate(value);
        }
        return value;
      })
      .catch(error => {
        Alert.alert(error);
      });
  };

  onCollectionUpdate = uid => {
    this.ref
      .doc(uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          this.setState({
            name: doc.data().name || "",
            phone: doc.data().phone || "",
            email: doc.data().email || "",
            avatar: doc.data().avatar || {},
            avatarFileName: doc.data().avatarFileName || "",
            avatarLocalUri: doc.data().avatarLocalUri || "",
            avatarFileLocation: doc.data().avatarFileLocation || ""
          });
        }
      });
  };

  updateTextInput = (text, field) => {
    const state = this.state;
    state[field] = text;
    this.setState(state);
  };

  selectPicture = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      // aspect: 1,
      quality: 1,
      exif: true
    });
    this.processImage(result);
  };

  takePicture = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      // aspect: 1,
      quality: 1,
      exif: true
    }).then(await this.processImage(result, metadata));
  };

  processImage = async (result, metadata) => {
    if (!result.cancelled) {
      this.setState({ avatar: result });
      const asset = await MediaLibrary.createAssetAsync(result.uri);
      this.setState({
        avatar: result,
        avatarLocalUri: "",
        avatarFileName: asset.filename
      });
    }
  };

  uriToBlob = uri => {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onerror = reject;
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          resolve(xhr.response);
        }
      };
      xhr.open("GET", uri);
      xhr.responseType = "blob"; // convert type
      xhr.send();
    });
  };

  uploadImage = async () => {
    const uri = this.state.avatar.uri;
    const blob = await this.uriToBlob(uri);

    var ref = firebase
      .storage()
      .ref()
      .child("avatars/" + this.state.avatarFileName);
    const snapshot = await ref.put(blob);
    const avatarFileLocation = await snapshot.ref
      .getDownloadURL()
      .then(result => this.setState({ avatarFileLocation: result }))
      .then(() => {
        Alert.alert("Success!");
      })
      .catch(error => {
        Alert.alert("upload image error:", error);
      });
  };

  saveUser(id) {
    this.setState({
      isLoading: true
    });
    this.cacheImage()
    this.uploadImage()
      .then(() =>
        this.ref.doc(id).set({
          name: this.state.name,
          phone: this.state.phone,
          email: this.state.email,
          avatar: this.state.avatar,
          avatarFileName: this.state.avatarFileName,
          avatarLocalUri: this.state.avatarLocalUri,
          avatarFileLocation: this.state.avatarFileLocation
        })
      )
      .then(docRef => {
        this.setState({
          isLoading: false
        });
        this.props.navigation.navigate("Map");
      })
      .catch(error => {
        console.error("Error adding document: ", error);
        this.setState({
          isLoading: false
        });
      });
  }

  cacheImage = () => {
    const uri = this.state.avatar.uri;
    ImageManipulator.manipulateAsync(uri, [{resize: {height: 225}}], {compress: 0.6})
    .then((response) => {this.setState({
      avatarLocalUri: response.uri
      })
    })
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    return (
      <ScrollView style={styles.container}>
        <View>
          {this.state.avatar.uri ? (
            <Image
              style={styles.avatar}
              source={{ uri: this.state.avatarLocalUri || this.state.avatar.uri }}
            />
          ) : (
            <Text />
          )}
        </View>
        <View style={styles.subContainer}>
          <TextInput
            placeholder={"Name"}
            value={this.state.name}
            onChangeText={text => this.updateTextInput(text, "name")}
          />
        </View>
        <View style={styles.subContainer}>
          <TextInput
            placeholder={"Phone"}
            value={this.state.phone}
            onChangeText={text => this.updateTextInput(text, "phone")}
          />
        </View>
        <View style={styles.subContainer}>
          <TextInput
            placeholder={"email"}
            value={this.state.email}
            onChangeText={text => this.updateTextInput(text, "email")}
          />
        </View>
        <View>
          <View style={styles.buttonContainer}>
            <View style={{ flex: 1 }}>
              <Button3 onPress={this.selectPicture}>Add/Change Avatar</Button3>
            </View>
            <View style={{ flex: 1 }}>
              <Button3 onPress={this.takePicture}>Take Picture</Button3>
            </View>
          </View>
        </View>
        <View style={styles.container}>
          <Button
            large
            title="Save"
            onPress={() => this.saveUser(this.state.uid)}
          />
        </View>
      </ScrollView>
    );
  }
}

const Button3 = ({ onPress, children }) => (
  <TouchableOpacity style={styles.buttonSideBySide} onPress={onPress}>
    <Text style={styles.button3Text}>{children}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
avatar: {
  flex: 1,
  alignSelf: "center",
  marginTop: 7.5,
  marginBottom: 15,
  padding: 5,
  width: 225,
  height: 225
},
  activity: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  buttonText: {
    fontSize: 18,
    color: "#111",
    alignSelf: "center"
  },
  button: {
    height: 45,
    flexDirection: "row",
    backgroundColor: "white",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 2,
    alignSelf: "stretch",
    justifyContent: "center"
  },
  buttonContainer: {
    flexDirection: "row",
    flex: 2,
    padding: 5,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonSideBySide: {
    height: 25,
    backgroundColor: "blue",
    borderColor: "blue",
    borderWidth: 2,
    borderRadius: 5,
    margin: 2,
    justifyContent: "center"
  },
  button3Text: {
    fontSize: 15,
    color: "white",
    alignSelf: "center"
  },
  container: {
    flex: 1,
    padding: 10
  },
  subContainer: {
    flex: 1,
    marginBottom: 15,
    // padding: 5,
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: "#CCCCCC"
  },
  title: {
    flex: 1,
    marginBottom: 2,
    padding: 2,
    justifyContent: "center",
    alignSelf: "center"
  },
});
