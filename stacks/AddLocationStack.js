import React from "react";
import {Button} from 'react-native'
import { createStackNavigator } from "react-navigation";
import Icon from 'react-native-vector-icons/Ionicons'

import AddLocationScreen from "../Screens/AddLocationScreen";
import MainImagePicker from "../components/MainImagePicker"

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
        // ),
        // headerRight: <Button onPress={() => navigation.navigate('AddLocationScreen')} title="Clear" />
        };
      }
    },
    AddLocationScreen: AddLocationScreen,
  },
  {
    defaultNavigationOptions: {
      gesturesEnabled: false
    }
  }
);

export default AddLocationStack;
