import React from "react";
import { createBottomTabNavigator, StackActions } from "react-navigation";
import { Platform } from "react-native";
import TabBarIcon from "../components/TabBarIcon";

import HomeStack from "../stacks/HomeStack";
import AddLocationStack from "../stacks/AddLocationStack";
import ListLocationsStack from "../stacks/ListLocationsStack";
import ProfileStack from "../stacks/ProfileStack";

const DashboardTabNavigator = createBottomTabNavigator(
  // this is where the tab navigator is built
  {
    Map: {
      screen: HomeStack,
      navigationOptions: {
        tabBarLabel: "Map",
        tabBarIcon: ({ focused }) => (
          <TabBarIcon
            focused={focused}
            name={
              Platform.OS === "ios"
                ? `ios-navigate${focused ? "" : ""}`
                : "md-navigate"
            }
          />
        )
      }
    },
    "Add Location": {
      screen: AddLocationStack,
      navigationOptions: {
        tabBarLabel: "Add Location",
        tabBarIcon: ({ focused }) => (
          <TabBarIcon
            focused={focused}
            name={
              Platform.OS === "ios" ? `ios-add${focused ? "" : ""}` : "md-add"
            }
          />
        )
      }
    },
    "List Locations": {
      screen: ListLocationsStack,
      navigationOptions: {
        tabBarLabel: "List Locations",
        tabBarOnPress: ({navigation, defaultHandler}: any) => {
          navigation.dispatch(StackActions.popToTop())
          defaultHandler()},
        resetOnBlur: true,
        tabBarIcon: ({ focused }) => (
          <TabBarIcon
            focused={focused}
            name={
              Platform.OS === "ios" ? `ios-list${focused ? "" : ""}` : "md-list"
            }
          />
        )
      }
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: {
        tabBarLabel: "Profile",
        tabBarIcon: ({ focused }) => (
          <TabBarIcon
            focused={focused}
            name={
              Platform.OS === "ios"
                ? `ios-person${focused ? "" : ""}`
                : "md-person"
            }
          />
        )
      }
    }
  },
  {
    navigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state.routes[navigation.state.index];
      return {
        header: null,
        headerTitle: routeName
      };
    }
  }
);

export default DashboardTabNavigator;
