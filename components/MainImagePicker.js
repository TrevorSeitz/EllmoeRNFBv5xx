import React from 'react';
import { StyleSheet, Text, View, Button, Image, AsyncStorage } from 'react-native';
import ImagePicker from 'react-native-image-picker'


export default class MainImagePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filePath: {},
    };
  }
  chooseFile = () => {
    console.log("inside Choose File")
    var options = {
      title: 'Select Image',
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    console.log("Choose File Options Set")
    ImagePicker.showImagePicker(response => {
      console.log("Image Picker Response ");

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let result = AsyncStorage.setItem("filePath", response);
        let source = response;
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          filePath: source.uri,
        });
      }
      let result = AsyncStorage.multiSet([["filePath", response.uri], ["latitude", response.latitude], ["longitude", response.longitude]]);
      console.log("last line in Image Picker", response.latitude)
      this.checkForFilepath()
    });
  };

  checkForFilepath = () => {
    if (!this.state.filePath) {
      timer = () => {
          return setTimeout(function () {
              checkForFilepath
          }, 2000);
      }
    } else {
      console.log("going back to Add Location", this.state.filePath)
      this.props.navigation.navigate("AddLocationScreen")
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          {/*<Image
          source={{ uri: this.state.filePath.path}}
          style={{width: 100, height: 100}} />*/}
          <Image
            source={{
              uri: 'data:image/jpeg;base64,' + this.state.filePath.data,
            }}
            style={{ width: 100, height: 100 }}
          />
          <Image
            source={{ uri: this.state.filePath.uri }}
            style={{ width: 250, height: 250 }}
          />
          <Text style={{ alignItems: 'center' }}>
            {this.state.filePath.uri}
          </Text>
          <Button title="Choose A Main Photo" onPress={this.chooseFile.bind(this)} />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
