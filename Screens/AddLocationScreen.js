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
// import * as Permissions from 'expo-permissions'
// import * as Location from 'expo-location'
import ImageBrowser from "./ImageBrowser";
import SaveMainPhoto from "../components/SaveMainPhoto";

export default class AddLocationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: this._retrieveData(),
      name: "",
      project: "",
      latitude: "",
      longitude: "",
      contactName: "",
      contactPhone: "",
      email: "",
      description: "",
      image: "nil",
      imageFileName: "",
      imageFileLocation: "",
      photos: [],
      photosLocations: [],
      imageBrowserOpen: false,
      isLoading: false
    };
    this.ref = firebase.firestore().collection("locations");
    // this.ref = firestore.collection("locations");
    var storage = firebase.storage();
    var storageRef = storage.ref();
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("uid");
      if (value !== null) {
        this.setState({ uid: value });
      }
    } catch (error) {}
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };

  selectPicture = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: 1,
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
      aspect: 1,
      quality: 1,
      exif: true
    }).then(await this._getLocationAsync());
    const metadata = result.metadata;
    result.exif.GPSLatitude = JSON.stringify(
      this.state.location.coords.latitude
    );
    result.exif.GPSLongitude = JSON.stringify(
      this.state.location.coords.longitude
    );
    this.processImage(result, metadata);
  };

  processImage = async (result, metadata) => {
    if (!result.cancelled) {
      if (
        !result.exif.GPSLatitude ||
        result.exif.GPSLatitude == NaN ||
        result.exif.GPSLongitude == NaN
      ) {
        Alert.alert(
          "This Image Does Not Have Location Data! Please Chooes Another Image"
        );
      } else {
        this.setState({ image: result });
        console.log("AddLocationScreen - processImage result: ", result);
        const asset = await MediaLibrary.createAssetAsync(result.uri);
        let lat = parseFloat(result.exif.GPSLatitude, 5);
        let long = parseFloat(result.exif.GPSLongitude, 5);
        if (result.exif.GPSLatitudeRef == "S") {
          lat *= -1;
        }
        if (result.exif.GPSLongitudeRef == "W") {
          long *= -1;
        }

        this.setState({
          imageFileName: asset.filename,
          latitude: lat,
          longitude: long
        });
      }
    }
  };

  updateTextInput = (text, field) => {
    const state = this.state;
    state[field] = text;
    this.setState(state);
  };

  saveLocation() {
    this.ref
      .add({
        uid: this.state.uid,
        name: this.state.name,
        project: this.state.project,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        contactName: this.state.contactName,
        contactPhone: this.state.contactPhone,
        email: this.state.email,
        description: this.state.description,
        photosLocations: this.state.photosLocations,
        image: this.state.image,
        imageFileName: this.state.imageFileName,
        imageFileLocation: this.state.imageFileLocation
      })
      .then(docRef => {
        this.setState({
          uid: "",
          name: "",
          project: "",
          latitude: "",
          longitude: "",
          contactName: "",
          contactPhone: "",
          email: "",
          description: "",
          photos: [],
          photosLocations: [],
          image: "nil",
          imageFileName: "",
          imageFileLocation: "",
          isLoading: false
        });
      })
      .catch(error => {
        console.error("Error adding document: ", error);
      });

    this.setState({
      isLoading: false
    });
  }

  saveImages = async () => {
    this.setState({
      isLoading: true //Start activity animation
    });
    let allLocalPhotos = [...this.state.photos];
    console.log(
      "AddLocationScreen - SaveImages - allLocalPhotos before add",
      allLocalPhotos
    );
    // add the main photo to the array of extra photos
    allLocalPhotos.push(this.state.image.uri);
    console.log(
      "AddLocationScreen - SaveImages - allLocalPhotos after add",
      allLocalPhotos
    );

    // use for loop to send each photo to storage in order
    for (let i = 0; i < allLocalPhotos.length; i++) {
      if (allLocalPhotos[i].file) {
        console.log("in the loop for extra photos: ", i);
        await this.uploadExtraImage(allLocalPhotos[i]);
      } else {
        console.log("Saving MAIN photos: ", i);
        this.uploadMainImage(allLocalPhotos[i]);
      }
    }
  };

  uploadExtraImage = async photo => {
    let extraPhotosArray = [...this.state.photosLocations];
    const blob = await this.uriToBlob(photo.file);
    var ref = firebase
      .storage()
      .ref()
      .child(
        "images/" +
          photo.modificationTime
            .toString()
            .split(".", 1)
            .toString()
      );
    const snapshot = await ref.put(blob);
    const imageFileLocation = snapshot.ref
      .getDownloadURL()
      .then(result => {
        this.setState(prevState => ({
          photosLocations: [...prevState.photosLocations, result]
        }));
      })
      .catch(error => {
        Alert.alert(error);
      });
  };

  uploadMainImage = async uri => {
    const blob = await this.uriToBlob(uri);
    const fileName = this.state.imageFileName;
    const location = this.state.imageFileLocation;
    var ref = firebase
      .storage()
      .ref()
      .child("images/" + fileName);
    const snapshot = await ref.put(blob);
    const imageFileLocation = await snapshot.ref
      .getDownloadURL()
      .then(result => this.setState({ imageFileLocation: result }))
      .then(() => this.saveLocation())
      .then(() => {
        this.setState({
          isLoading: true
        });
      })
      .then(() => Alert.alert("Success!"))
      .catch(error => {
        Alert.alert(error);
      });
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

  imageBrowserCallback = callback => {
    callback
      .then(photos => {
        this.setState({
          imageBrowserOpen: false,
          photos: photos
        });
      })
      .catch(e => console.log(e));
  };

  renderImage = (item, i) => {
    console.log(item);
    return (
      <Image
        style={{ height: 75, width: 75 }}
        source={{ uri: item.file }}
        key={i}
      />
    );
  };

  renderAdditionalImages = () => {
    return (
      <View style={styles.container}>
        <View style={styles.photoList}>
          <Image style={styles.image} source={{ uri: this.state.image.uri }} />
          {this.state.photos.map((item, i) => this.renderImage(item, i))}
        </View>
        <View style={styles.buttonContainer}>
          <View style={{ flex: 1 }}>
            <Button3 onPress={this.selectPicture}>Change Main Image</Button3>
          </View>
          <View style={{ flex: 1 }}>
            <Button3 onPress={() => this.setState({ imageBrowserOpen: true })}>Add More Photos</Button3>
          </View>
        </View>

        <View style={styles.buttonSubContainer}>
          <Button large title="Save" onPress={() => this.saveImages()} />
        </View>
      </View>
    );
  };

  renderGetMainImage = () => {
    return (
      <View>
        <Text style={styles.buttonText}>Add Main Photo</Text>
        <View style={styles.buttonContainer}>
          <View style={{ flex: 1 }}>
            <Button3 onPress={this.selectPicture}>Gallery</Button3>
          </View>
          <View style={{ flex: 1 }}>
            <Button3 onPress={this.takePicture}>Take Picture</Button3>
          </View>
        </View>
      </View>
    );
  };

  render() {
    let bottomForm;
    if (this.state.isLoading) {
      return (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    if (this.state.image.uri && this.state.name) {
      bottomForm = this.renderAdditionalImages();
    } else {
      bottomForm = this.renderGetMainImage();
    }

    if (this.state.imageBrowserOpen) {
      return <ImageBrowser max={4} callback={this.imageBrowserCallback} />;
    }

    return (
      <ScrollView style={styles.container}>
        <View style={styles.subContainer}>
          <TextInput
            placeholder={"Name"}
            value={this.state.name}
            onChangeText={text => this.updateTextInput(text, "name")}
          />
        </View>
        <View style={styles.subContainer}>
          <TextInput
            placeholder={"Project"}
            value={this.state.project}
            onChangeText={text => this.updateTextInput(text, "project")}
          />
        </View>
        <View style={styles.subContainer}>
          <TextInput
            placeholder={"Contact Name"}
            value={this.state.contactName}
            onChangeText={text => this.updateTextInput(text, "contactName")}
          />
        </View>
        <View style={styles.subContainer}>
          <TextInput
            placeholder={"Contact Phone"}
            value={this.state.contactPhone}
            onChangeText={text => this.updateTextInput(text, "contactPhone")}
          />
        </View>
        <View style={styles.subContainer}>
          <TextInput
            placeholder={"email"}
            value={this.state.email}
            onChangeText={text => this.updateTextInput(text, "email")}
          />
        </View>
        <View style={styles.subContainer}>
          <TextInput
            multiline={true}
            numberOfLines={4}
            placeholder={"Description"}
            value={this.state.description}
            onChangeText={text => this.updateTextInput(text, "description")}
          />
        </View>
        {bottomForm}
      </ScrollView>
    );
  }
}

const Button2 = ({ onPress, children }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.button2Text}>{children}</Text>
  </TouchableOpacity>
);

const Button3 = ({ onPress, children }) => (
  <TouchableOpacity style={styles.buttonSideBySide} onPress={onPress}>
    <Text style={styles.button3Text}>{children}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  activity: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    height: 25,
    backgroundColor: "white",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 2,
    marginTop: 2,
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
  buttonSubContainer: {
    flex: 1,
    marginBottom: 2,
    padding: 2
  },
  buttonText: {
    fontSize: 15,
    color: "#111",
    alignSelf: "center"
  },
  button2Text: {
    fontSize: 15,
    color: "#111",
    alignSelf: "center"
  },
  button3Text: {
    fontSize: 15,
    color: "white",
    alignSelf: "center"
  },
  container: {
    flex: 1
  },
  image: {
    alignItems: "stretch",
    width: 95
  },
  photoList: {
    flexDirection: "row",
    padding: 5,
    height: 95,
    alignItems: "stretch",
    justifyContent: "center"
  },
  subContainer: {
    flex: 1,
    marginBottom: 5,
    padding: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC"
  }
});
