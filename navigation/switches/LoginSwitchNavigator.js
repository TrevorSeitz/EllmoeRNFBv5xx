import React from "react";
import { createSwitchNavigator } from "react-navigation";

import WelcomeScreen from "../../Screens/WelcomeScreen";
import HomeScreen from "../../Screens/HomeScreen";
import LoginScreen from "../../Screens/auth/LoginScreen";
import SignupScreen from "../../Screens/auth/SignupScreen";
import ForgotPasswordScreen from "../../Screens/auth/ForgotPasswordScreen";
import LoadingScreen from "../../Screens/auth/LoadingScreen";

const LoginSwitchNavigator = createSwitchNavigator({
  Welcome: WelcomeScreen,
  Map: HomeScreen,
  Login: LoginScreen,
  Signup: SignupScreen,
  ForgotPassword: ForgotPasswordScreen,
  Loading: LoadingScreen
});

export default LoginSwitchNavigator;
