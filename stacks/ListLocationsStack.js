import React from "react";
import { createStackNavigator } from "react-navigation";
import Icon from 'react-native-vector-icons/Ionicons'

import ListLocationsScreen from "../Screens/ListLocationsScreen";
import LocationDetailsScreen from "../Screens/LocationDetailsScreen";
import AdditionalPhotosGallery from "../Screens/AdditionalPhotosGallery";
import AdditionalPhotosScreen from "../Screens/AdditionalPhotosScreen";
import EditLocationStack from "../stacks/EditLocationStack";

const ListLocationsStack = createStackNavigator(
  {
    ListLocations: {
      screen: ListLocationsScreen,
      navigationOptions: ({ navigation }) => {
        return {
          headerTitle: "List Locations",
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
    Details: LocationDetailsScreen,
    Edit: EditLocationStack,
    AdditionalPhotos: AdditionalPhotosScreen,
    AdditionalPhotosGallery: AdditionalPhotosGallery
  },
  {
    defaultNavigationOptions: {
      gesturesEnabled: false
    }
  }
);
export default ListLocationsStack;
