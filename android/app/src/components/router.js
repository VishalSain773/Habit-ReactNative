import { createAppContainer, createStackNavigator } from "react-navigation";
import HomePage from "./HomePage/HomePage";
import LoginPage from "./LoginPage/LoginPage";

const AppStackNavigator = createStackNavigator({
  Home: {
    screen: LoginPage,
    navigationOptions: {
      header: null,
    }
  }, 
  HomePage: {
    screen:HomePage,
    navigationOptions: {
      header: null,
    }
  }
});

const AppContainer = createAppContainer(AppStackNavigator);

export default AppContainer;
