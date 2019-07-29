import React from "react";
import { Dimensions, Image, TouchableHighlight } from "react-native";
const { width } = Dimensions.get("window");

export default class ShowAdditionalPhotosTile extends React.PureComponent {
  showImage = (index, photos) => {
    console.log(index);
    return (
      <Image
        style={{ width: "100%", resizeMode: "stretch" }}
        source={{ uri: photos[index] }}
      />
    );
  };

  render() {
    let { item, index, photos, navigation, navigate } = this.props;
    if (!item) return null;
    return (
      <TouchableHighlight
        onPress={() =>
          navigate("AdditionalPhotosGallery", {
            index: index,
            photos: photos
          })
        }
      >
        <Image
          style={{ width: width / 2, height: width / 2 }}
          source={{ uri: photos[index] }}
        />
      </TouchableHighlight>
    );
  }
}
