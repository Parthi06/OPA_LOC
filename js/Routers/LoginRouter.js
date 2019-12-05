import {createAppContainer, createStackNavigator } from "react-navigation";
import Login from "../Components/Login/";
//import Splash from "../Components/Splash";

const AppNavigator = createStackNavigator({ Login: { screen: Login } });

const StackNav = createAppContainer(AppNavigator);

export default StackNav;
