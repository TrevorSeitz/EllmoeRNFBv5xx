// use thes for future set querySnapshot
// import * as firestore from '@react-native-firebase/firestore';
// import { AsyncStorage } from '@react-native-community/async-storage'
//import firestore from "firebase/firestore";
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
  // ImagePicker,
  Permissions,
  AsyncStorage,
  Location
} from "react-native";
import { TextInput } from "react-native-paper";
import { Button } from "react-native-elements";
import firebase from 'react-native-firebase';
import MultipleImagePicker from 'react-native-multiple-image-picker'
import ImageBrowser from "./ImageBrowser";
import SaveMainPhoto from "../components/SaveMainPhoto";
import MainImagePicker from "../components/MainImagePicker"

export default class AddLocationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: "",
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
      filePath: "",
      currentLatitude: 0,
      currentLongitude: 0,
      imageBrowserOpen: false,
      isLoading: false
    };
    this._retrieveData()
    this.ref = firebase.firestore().collection("locations");
    const storage = firebase.storage();
    const storageRef = storage.ref();
    const { navigate } = this.props.navigation;
  }

  getAdditionalPhotos = () => {
    const options = {
      maxImagesCount: 4,      // Max number of images user can select; if maxImagesCount == 1, Single mode (i.e. Tap to Select & Finish) will be activated.
      selectedPaths: []
      // Currently selected paths, must be from result of previous calls. Empty array allowed.
    };
    MultipleImagePicker.launchImageGallery(options)
    .then(newSelectedPaths => this.setState({photos: newSelectedPaths}))
    .then((newSelectedPaths) => {
      console.log("Just got pictures - this.state.photos - AddLocationScreen", this.state.photos)
    });
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.multiGet(["uid", "filePath", "latitude", "longitude", "fileName", "currentLatitude", "currentLongitude" ]);
      if (value !== null) {
        this.setState({ uid: value[0][1],
                        filePath: value[1][1],   // Image file path
                        latitude: value[2][1],   // Image latitude
                        longitude: value[3][1],  // Image longitude
                        imageFileName: value[4][1],
                        currentLatitude: value[5][1],
                        currentLongitude: value[6][1],
                        });
      }
    } catch (error) {}
  };

  // selectPicture = () => {
  //   this.props.navigation.navigate('MainImagePicker')
  //   // console.log("AddLocationScreen result: ", this.state.filePath)
  //   // this.processImage(this.state.filePath);
  // };

  takePicture = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: 1,
      quality: 1,
      exif: true
    })
    // .then(await this._getLocationAsync());
    // const metadata = result.metadata;
    // result.exif.GPSLatitude = JSON.stringify(
    //   this.state.location.coords.latitude
    // );
    // result.exif.GPSLongitude = JSON.stringify(
    //   this.state.location.coords.longitude
    // );
    // this.processImage(result, metadata);
    this.processImage(result);
  };

  processImage = async (result, metadata) => {
    // console.log("inside processImage - metadata", metadata)
    // console.log("inside process image", result)
    if (!result.cancelled) {
      if (
        !this.state.Latitude ||
        this.state.Latitude == NaN ||
        this.state.Longitude == NaN
        // !result.exif.GPSLatitude ||
        // result.exif.GPSLatitude == NaN ||
        // result.exif.GPSLongitude == NaN
      ) {
        Alert.alert(
          "This Image Does Not Have Location Data! Please Chooes Another Image"
        );
      } else {
        this.setState({ image: result });
        // console.log("AddLocationScreen - processImage result: ", result);
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

  loading = () => {
    return (
      <View style={styles.activity}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  returnAdditionalImages = () => {
    var photoArray = this.state.photos
    console.log("returnAdditionalImages - photoArray - ", photoArray)
    return
      photoArray.map((photo, i ) => {
        <Image
                source={{ uri: photo}}
                key={i}
                style={{height: 200, width: 200}}
                resizeMode='contain' />
    })
  };

  returnBottomForm = () =>   {
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <View style={{ flex: 1 }}>
            <Button3 onPress={() => this.getAdditionalPhotos()}>Add/Change Photos</Button3>
          </View>
        </View>
        <View style={styles.buttonSubContainer}>
          <Button large title="Save" onPress={() => this.saveImages()} />
        </View>
      </View>
    );
  }

  render() {
    const photos = this.returnAdditionalImages()
    const bottomForm = this.returnBottomForm();
    if (this.state.isLoading) {
      this.loading()
    }

    return(
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
        <View style={styles.photoList}>
          {this.state.photos.map((img, index) => {
            return <Image source={{uri: img}} key={index} style={styles.image}/>;
          })}
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
  // image: {
  //   alignItems: "stretch",
  //   width: 95
  // },
  photoList: {
    flex: 1,
    flexDirection: "row",
    padding: 5,
    // width: 100%,
    // height:110,
    // height: 95,
    // alignItems: "stretch",
    // resizeMode: 'cover',
    justifyContent: "center"
  },
  image: {
    flex: 0.25,
    // flexDirection: "row",
    padding: 5,
    margin: 5,
    resizeMode: 'cover',
    width: 125,
    height: 125,
  },
  subContainer: {
    flex: 1,
    marginBottom: 5,
    padding: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC"
  }
});
