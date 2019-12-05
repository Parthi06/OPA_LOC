import React from "react";
import { createDrawerNavigator } from "react-navigation";
import About from "../Components/About";
import Asset from "../Components/AssetList";
import Dashboard from "../Components/Dashboard";
import DrawBar from "../Components/DrawBar";
import Home from "../Components/Home";
import People from "../Components/People";
import Settings from "../Components/Settings";

const DrawNav = createDrawerNavigator(
  {
    DASHBOARD: { screen: Dashboard },
    FEEDS: { screen: Home },
    ASSETS: { screen: Asset },
    PEOPLE: { screen: People },
    'HELP & SUPPORT': { screen: About },
    SETTINGS: { screen: Settings }
  },
  {
    drawerWidth: 200,
    initialRouteName: 'DASHBOARD',
    contentComponent: props => <DrawBar {...props} />
  }
);
const DrawerNav = null;
DrawNav.navigationOptions = ({ navigation }) => {
  DrawerNav = navigation;
  return {
    header: null
  };
};
export default DrawNav;
