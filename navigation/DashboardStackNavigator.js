import React from "react";
import { createStackNavigator } from "react-navigation";
// import Icon from 'react-native-vector-icons/Ionicons'
import Icon from 'react-native-vector-icons/Ionicons'

import DashboardTabNavigator from "./DashboardTabNavigator";

const DashboardStackNavigator = createStackNavigator(
  {
    DashboardTabNavigator: DashboardTabNavigator
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      return {
        headerLeft: (
          // <Icon.Ionicons
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
);

export default DashboardStackNavigator;
