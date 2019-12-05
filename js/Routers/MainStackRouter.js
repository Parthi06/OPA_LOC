
import { createAppContainer, createStackNavigator } from "react-navigation";
import Home from "../Components/Home/";
import AssetDetailsPage from "../Components/AssetDetailsPage/";
import TicketDetailsPage from "../Components/TicketDetailsPage/";
import Asset from "../Components/AssetList";
import ChangePassword from "../Components/Settings/changePassword";
import NetworkError from "../Components/Util/NetworkError";
import FeedbackComponent from '../Components/AssetDetailsPage/FeedbackComponent'
import Login from "../Components/Login";

import DrawerRouter from "./DrawerRouter";
DrawerRouter.navigationOptions = ({ navigation }) => ({
  header: null
});

const AppNavigator = createStackNavigator(
  {
    DrawerRouter: { screen: DrawerRouter },
    AssetDetailsPage: { screen: AssetDetailsPage },
    TicketDetailsPage: { screen: TicketDetailsPage },
    FeedWithoutDrawNav: { screen: Home },
    AssetWithoutDrawNav: { screen: Asset },
    ChangePasswordPage: { screen: ChangePassword },
    FeedWithDrawNav: { screen: Home },
    NetworkErrorPage: { screen: NetworkError },
    FeedBacks:{screen:FeedbackComponent}
  }
);

const StackNav = createAppContainer(AppNavigator);

export default StackNav;
