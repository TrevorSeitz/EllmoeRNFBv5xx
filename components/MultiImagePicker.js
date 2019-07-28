
import React from "react";
import { AsyncStorage } from "react-native"
import MainImagePicker from "./MainImagePicker"
import MultipleImagePicker from 'react-native-multiple-image-picker'


export default class MultiImagePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      additionalPhotos: [],
    };
    this.getAdditionalPhotos()
    // this.removeFromAsyncStorage("photos")
  }

  getAdditionalPhotos = () => {
    // if (this.state.additionalphotos){ this.removeFromAsyncStorage("photos") }
    console.log("inside MultiImagePicker - getAdditionalPhotos")
    const options = {
      maxImagesCount: 4,      // Max number of images user can select; if maxImagesCount == 1, Single mode (i.e. Tap to Select & Finish) will be activated.
      selectedPaths: []
      // Currently selected paths, must be from result of previous calls. Empty array allowed.
    };
    console.log("MultiImagePicker - just before launchImageGallery")
    var newSelectedPaths = MultipleImagePicker.launchImageGallery(options)
    .then(newSelectedPaths => this.setState({additionalPhotos: newSelectedPaths}))
    .then(newSelectedPaths => {console.log("testing multi image picker - ", newSelectedPaths)})
    .then(() => AsyncStorage.setItem("photos", JSON.stringify(this.state.additionalPhotos)))
    // .then(
    //   checkForAdditionalPhotos = () => {
    //     if (!this.state.additionalPhotos) {
    //       timer = () => {
    //           return setTimeout(function () {
    //               checkForAdditionalPhotos
    //           }, 2000);
    //       }
    //     } else {
    //     // this.props.navigation.navigate({routeName: "AddLocationScreen"})
    //     }
    //   }
    // )
  }
  render() {
    return(null)
  }

}
