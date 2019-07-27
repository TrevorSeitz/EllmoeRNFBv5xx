import React from "react";
import { createDrawerNavigator } from "react-navigation";
// Screens
import LogoutScreen from "../Screens/auth/LogoutScreen";
// Navigation Pages
import DashboardStackNavigator from "./DashboardStackNavigator";

const AppDrawerNavigator = createDrawerNavigator({
  // this creates the menu for the drawer
  Dashboard: DashboardStackNavigator,
  Logout: LogoutScreen
});

export default AppDrawerNavigator;
