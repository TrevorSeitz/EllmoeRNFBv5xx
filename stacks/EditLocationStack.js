import React from "react";
import { createStackNavigator } from "react-navigation";
import Icon from 'react-native-vector-icons/Ionicons'

import EditLocationScreen from "../Screens/EditLocationScreen";
import EditAdditionalPhotosScreen from "../Screens/EditAdditionalPhotosScreen";
import AdditionalImageBrowser from "../Screens/AdditionalImageBrowser";

const EditLocationStack = createStackNavigator(
  {
    Edit: {
      screen: EditLocationScreen,
      navigationOptions: ({ navigation }) => {
        return {
          headerTitle: "Edit Location",
          headerLeft: (
            <Icon
              style={{ paddingLeft: 10 }}
              onPress={() => navigation.openDrawer()}
              name="md-menu"
              size={30}
            />
          )
        };
      }
    },
    EditAdditionalPhotos: EditAdditionalPhotosScreen,
    AdditionalImageBrowser: AdditionalImageBrowser
  },
  {
    defaultNavigationOptions: {
      gesturesEnabled: false,
      header: null
    }
  }
);
export default EditLocationStack;
