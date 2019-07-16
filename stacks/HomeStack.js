import React from "react";
import { createStackNavigator } from "react-navigation";
import Icon from 'react-native-vector-icons/Ionicons'
// Screens;
import HomeScreen from "../Screens/HomeScreen";

const HomeStack = createStackNavigator(
  {
    Map: {
      screen: HomeScreen,
      navigationOptions: ({ navigation }) => {
        return {
          headerTitle: "Map",
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
    }
  },
  {
    defaultNavigationOptions: {
      gesturesEnabled: false
    }
  }
);

export default HomeStack;
