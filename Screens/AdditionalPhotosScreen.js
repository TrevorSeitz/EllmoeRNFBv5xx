import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  Image
} from "react-native";
import { Button } from "react-native-elements";
import ImageTile from "./ImageTile";
import ShowAdditionalPhotosTile from "./ShowAdditionalPhotosTile";
import * as firebase from 'react-native-firebase';
// import * as firestore from '@react-native-firebase/firestore';
import AdditionalImageBrowser from "./AdditionalImageBrowser";
import SaveMainPhoto from "../components/SaveMainPhoto";

const { width } = Dimensions.get("window");

export default class AdditionalPhotosScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      maxPhotos: 4,
      photos: [],
      selected: {},
      toDelete: [],
      key: "",
      name: "",
      project: "",
      photosLocations: [],
      cachedPhotosLocations: [],
      after: null,
      has_next_page: true
    };
  }

  componentDidMount() {
    this.getPhotos();
  }

  selectImage = index => {
    let newSelected = { ...this.state.selected };
    if (newSelected[index]) {
      delete newSelected[index];
    } else {
      newSelected[index] = true;
    }
    if (Object.keys(newSelected).length > this.props.max) return;
    if (!newSelected) newSelected = {};
    this.setState({ selected: newSelected });
    // create array of indexes to be deleted
    let toDelete = Object.keys(newSelected);
    this.setState({ toDelete });
  };

  getPhotos = () => {
    const { navigation } = this.props;
    firebase
      .firestore()
    // firestore
      .collection("locations")
      .doc(JSON.parse(navigation.getParam("key")))
      .get()
      .then(doc => {
        if (doc.exists) {
          const location = doc.data();
          this.setState({
            key: doc.id,
            name: location.name,
            project: location.project,
            photosLocations: location.photosLocations,
            isLoading: false
          });
        } else {
          console.log("No such document!");
        }
      });
  };

  getItemLayout = (data, index) => {
    let length = width / 2;
    return { length, offset: length * index, index };
  };

  renderImageTile = ({ item, index }) => {
    let selectedPhoto = this.state.photosLocations[index];
    let photos = this.state.photosLocations;
    const { navigate } = this.props.navigation;
    return (
      <ShowAdditionalPhotosTile
        item={item}
        index={index}
        selectedPhoto={selectedPhoto}
        photos={photos}
        navigate={navigate}
      />
    );
  };

  additionalImageBrowserCallback = callback => {
    callback
      .then(photos => {
        this.setState({
          AdditionalImageBrowserOpen: false,
          photos: photos
        });
      })
      .catch(e => console.log("Error: ", e));
  };

  renderImages() {
    return (
      <View>
        <Text style={styles.name}>{this.state.name}</Text>
        <FlatList
          data={this.state.photosLocations}
          numColumns={2}
          renderItem={this.renderImageTile}
          keyExtractor={(_, index) => index}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={<Text>Loading...</Text>}
          initialNumToRender={24}
          getItemLayout={this.getItemLayout}
        />
      </View>
    );
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    if (this.state.AdditionalImageBrowserOpen) {
      return (
        <AdditionalImageBrowser
          max={this.state.maxPhotos - this.state.photosLocations.length}
          callback={this.additionalImageBrowserCallback}
        />
      );
    }
    return (
      <View style={styles.container}>
        {this.renderImages()}
        <View style={styles.detailButton} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    height: 50,
    width: width,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginTop: 20
  },
  detailButton: {
    marginTop: 10
  },
  name: {
    fontSize: 36,
    textAlign: "center"
  }
});
