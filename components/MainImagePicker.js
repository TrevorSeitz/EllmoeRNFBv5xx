import React from 'react';
import { StyleSheet, Text, View, Button, Image, AsyncStorage } from 'react-native';
import MultiImagePicker from "../components/MultiImagePicker"
import ImagePicker from 'react-native-image-picker'

export default class MainImagePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filePath: {},
    };
  }

removeItems = () =>{
  console.log("BEFORE removeItem")
  if (this.state.filePath){ this.removeFromAsyncStorage("filePath") }
  if (this.state.latitude){ this.removeFromAsyncStorage("latitude") }
  if (this.state.longitude){ this.removeFromAsyncStorage("longitude") }
  if (this.state.imageFileName){ this.removeFromAsyncStorage("imageFileName") }
  // this.removeFromAsyncStorage("filePath")
  // this.removeFromAsyncStorage("latitude")
  // this.removeFromAsyncStorage("longitude")
  // this.removeFromAsyncStorage("imageFileName")
  console.log("AFTER removeItem")
}

  removeFromAsyncStorage = (key) => {
     return new Promise((resolve, reject) => {
       AsyncStorage.removeItem(key, (err, response) => {
        if(response) {
          resolve(response);
        } else {
          reject(err);
        }
      });
     })
   }

  chooseFile = async () => {
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

    ImagePicker.showImagePicker(response => {
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
      this.clearAndReload(response)
    });
  };

  clearAndReload = async (response) => {
    const {navigate} = this.props.navigation
    const filePath = response.uri
    const latitude = response.latitude
    const longitude = response.longitude
    const fileName = response.fileName
    console.log("filePath should be set ", filePath)
    const result = AsyncStorage.multiSet([ [ "filePath", filePath ], [ "latitude", latitude ], [ "longitude",  longitude ], ["fileName", fileName] ]);
    // navigate("AddLocationScreen")
    this.checkForFilePath()
  }

  checkForFilePath = () => {
    if (!this.state.filePath) {
      timer = () => {
          return setTimeout(function () {
              checkForFilepath
          }, 2000);
      }
    } else {
      // this.props.navigation.navigate("test")
      this.props.navigation.navigate("MultiImagePicker")
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
