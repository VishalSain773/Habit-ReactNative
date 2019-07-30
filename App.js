/**
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import AppContainer from './android/app/src/components/router'
import fire from './android/app/src/config/fire';
import HomePage from './android/app/src/components/HomePage/HomePage';
import LoginPage from './android/app/src/components/LoginPage/LoginPage';
import {
  GoogleSignin,
} from "react-native-google-signin";
import { Provider } from 'react-redux';
import configureStore from './android/app/src/redux-root/store';

// import HomePage from './android/app/src/components/HomePage/HomePage'
export default class App extends Component {

  constructor(props) {
    super(props);
    this.navigator &&
      this.navigator.dispatch(
        NavigationActions.navigate({ routeName: someRouteName })
      );
    this.state = {
      user: {},
      googleLoggedIn : false
    }
  }

  
  componentDidMount = () => {
    this.authListner();
    this.isSignedIn();
  }

  componentDidUpdate = () => {
    this.isSignedIn();
  }

  authListner() {
    fire.auth().onAuthStateChanged( (user) => {
      console.log(user);
      if (user) {
        this.setState({ user });
        // localStorage.setItem("user", user.uid);
      } else {
        this.setState({ user: null });
        // localStorage.removeItem("user");
      }
    });
  }

  isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    this.setState({ googleLoggedIn: isSignedIn });
  };

  render() {
    const store = configureStore();
    return (
      <Provider store={store}>
      <View style={styles.container}>{(this.state.user || this.state.googleLoggedIn) ? <HomePage/> : <LoginPage/>}</View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
