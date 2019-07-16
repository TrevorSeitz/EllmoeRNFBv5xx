import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  ScreenOrientation
} from "react-native";
// import { ScreenOrientation } from "expo";
import Icon from 'react-native-vector-icons/Ionicons'
import * as firebase from 'react-native-firebase';

export default class AdditionalPhotoGallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: this.props.navigation.state.params.index,
      photos: this.props.navigation.state.params.photos
    };

    this.index = this.state.index;
  }

  componentWillMount() {
    this.changeScreenOrientation();
  }

  changeScreenOrientation = () => {
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.ALL);
  };

  leftArrow = () => {
    // console.log("left");
    if (this.index > 0) {
      this.index--;
      // console.log("AdditionalPhotosGallery - this.index:", this.index);
      this.setState({
        index: this.index
      });
    }
  };

  rightArrow = () => {
    if (this.index < this.state.photos.length - 1) {
      this.index++;
      this.setState({
        index: this.index
      });
    }
  };

  render() {
    const photos = this.state.photos;
    let uri = photos[this.index];
    let index = this.index;
    let dimensions = Dimensions.get("window");
    let imageHeight = dimensions.height * 0.85;
    let imageWidth = dimensions.width;
    console.log("AdditionalPhotosGallery")
    this.imageURL = this.state.photos[index];
    return (
      <View style={styles.imageBox}>
        <View>
          <Image style={styles.image} source={{ uri: this.imageURL }} />
        </View>
        <TouchableOpacity
          style={styles.touchableAreaLeft}
          onPress={this.leftArrow}
        >
          <Icon name="ios-arrow-dropleft" style={styles.leftButton} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchableAreaRight}
          onPress={this.rightArrow}
        >
          <Icon
            name="ios-arrow-dropright"
            style={styles.rightButton}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  touchableAreaLeft: {
    opacity: 1,
    fontSize: 40,
    width: 80,
    height: 80,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    left: 10,
    top: 0
  },
  leftButton: {
    opacity: 1,
    fontSize: 40,
    width: 40,
    height: 40,
    position: "absolute",
    color: "#000000",
    top: -25
  },
  rightButton: {
    opacity: 1,
    fontSize: 40,
    width: 40,
    height: 40,
    position: "absolute",
    color: "#000000",
    top: -25
  },
  touchableAreaRight: {
    opacity: 1,
    fontSize: 40,
    width: 80,
    height: 80,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    right: 10,
    top: 0
  },
  image: {
    flex: 1,
    resizeMode: "contain",
    alignItems: "stretch",
    marginTop: 5,
    padding: 5,
    width: 375,
    height: "100%"
  },
  imageBox: {
    flex: 1,
    resizeMode: "contain",
    marginTop: 40,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  }
});
