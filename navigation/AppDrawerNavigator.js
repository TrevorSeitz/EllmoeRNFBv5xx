import React from "react";
import { createDrawerNavigator } from "react-navigation";

import LogoutScreen from "../Screens/auth/LogoutScreen";
import DashboardStackNavigator from "./DashboardStackNavigator";

const AppDrawerNavigator = createDrawerNavigator({
  // this creates the menu for the drawer
  Dashboard: DashboardStackNavigator,
  Logout: LogoutScreen
});

export default AppDrawerNavigator;
