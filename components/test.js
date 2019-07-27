
import React from "react";
import MainImagePicker from "../components/MainImagePicker"

export default class test extends React.Component {

  getAdditionalPhotos = () => {
    const options = {
      maxImagesCount: 4,      // Max number of images user can select; if maxImagesCount == 1, Single mode (i.e. Tap to Select & Finish) will be activated.
      selectedPaths: []
      // Currently selected paths, must be from result of previous calls. Empty array allowed.
    };
    MultipleImagePicker.launchImageGallery(options)
    .then((newSelectedPaths) => {
        // newSelectedPaths will be an Array of String, like [ '/path/1', '/path/2' ], and may be used for `selectedPaths` on the next invocation
    });
    this.props.navigation.navigate("AddLocationScreen")
  }
  render() {
    // this.getAdditionalPhotos()

    return(this.getAdditionalPhotos())
  }
}
