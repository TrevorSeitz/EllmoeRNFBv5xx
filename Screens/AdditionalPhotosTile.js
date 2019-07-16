import React from "react";
import { Dimensions, Image, TouchableHighlight } from "react-native";
const { width } = Dimensions.get("window");

export default class AdditionalPhotosTile extends React.PureComponent {
  render() {
    let { item, index, selected, selectImage } = this.props;

    if (!item) return null;
    return (
      <TouchableHighlight
        style={{ opacity: selected ? 0.5 : 1 }}
        underlayColor="transparent"
        onPress={() => selectImage(index)}
      >
        <Image
          style={{ width: width / 2, height: width / 2 }}
          source={{ uri: item }}
        />
      </TouchableHighlight>
    );
  }
}
