import React from "react";
import { createStackNavigator } from "react-navigation";
import Icon from 'react-native-vector-icons/Ionicons'
// Screens
import AddLocationScreen from "../Screens/AddLocationScreen";
// Components
import MainImagePicker from "../components/MainImagePicker"
import MultiImagePicker from "../components/MultiImagePicker"

const AddLocationStack = createStackNavigator(
  {
    AddLocation: {
      screen: MainImagePicker,
      navigationOptions: ({ navigation }) => {
        return {
          headerTitle: "Add New Location",
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
    AddLocationScreen: AddLocationScreen,
    MainImagePicker: MainImagePicker,
    MultiImagePicker: MultiImagePicker,
  },
  {
    defaultNavigationOptions: {
      gesturesEnabled: false
    }
  }
);

export default AddLocationStack;
