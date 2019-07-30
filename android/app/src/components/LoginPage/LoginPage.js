import React, { Component } from "react";
// import { AppStackNavigator } from "../router";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TextInput,
  SafeAreaView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  Dimensions
} from "react-native";
import fire from "../../config/fire";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes
} from "react-native-google-signin";
import HomePage from "../HomePage/HomePage";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  },
  logo: {
    color: "white",
    fontSize: 48,
    fontFamily: "cursive",
    textAlign: "center",
    fontWeight: "bold",
    textShadowColor: "#252525",
    textShadowOffset: { width: 2, height: 1 }
    // opacity: 1
  },
  title: {
    fontFamily: "roboto",
    color: "#FFF",
    textAlign: "center",
    fontSize: 16,
    marginTop: 5,
    opacity: 0.8
  },
  logoContainer: {
    // backgroundColor:"red"
  },
  infoContainer: {
    // backgroundColor:"blue",
    // padding: 20
  },
  input: {
    height: 40,
    color: "#000",
    backgroundColor: "rgba(255,255,255,0.5)",
    marginBottom: 20,
    paddingHorizontal: 20
  },
  buttonContainer: {
    backgroundColor: "black",
    paddingVertical: 10
  },
  buttonText: {
    textAlign: "center",
    color: "#fff"
  },
  backgroundImage: {
    flex: 1
    // resizeMode: "cover" // or 'stretch',
    // blur:1
  }
});

export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      isLoggedIn: true,
      userInfo: {},
      user: "",
      googleSignedin : false,
    };
  }

  componentDidMount() {
    GoogleSignin.configure({
      //It is mandatory to call this method before attempting to call signIn()
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
      // Repleace with your webClientId generated from Firebase console
      webClientId:
        "949967617820-ad03db95vcv7d6qiigak2tjse122hbc8.apps.googleusercontent.com"
    });
  }

  _signIn = async () => {
    //Prompts a modal to let the user sign in into your application.
    try {
      await GoogleSignin.hasPlayServices({
        //Check if device has Google Play Services installed.
        //Always resolves to true on iOS.
        showPlayServicesUpdateDialog: true
      });
      const userInfo = await GoogleSignin.signIn();
      this.setState({ userInfo: userInfo.user, googleSignedin : true });
      console.log("User Info --> ", userInfo.user);
    } catch (error) {
      console.log("Message", error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User Cancelled the Login Flow");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Signing In");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Play Services Not Available or Outdated");
      } else {
        console.log("Some Other Error Happened");
      }
    }
  };

 

  _revokeAccess = async () => {
    //Remove your application from the user authorized applications.
    try {
      await GoogleSignin.revokeAccess();
      console.log("deleted");
    } catch (error) {
      console.error(error);
    }
  };

  login = e => {
    e.preventDefault();
    this.setState({ isLoggedIn: false });
    fire
      .auth()
      .signInWithEmailAndPassword(this.state.username, this.state.password)
      .then(u => {
        this.setState({ isLoggedIn: true });
        console.log(u);
      })
      .catch(error => {
        console.log(error);
      });
  };

  signup = e => {
    e.preventDefault();
    fire
      .auth()
      .createInWithEmailAndPassword(this.state.username, this.state.password)
      .then(u => {
        console.log(u);
      })
      .catch(error => {
        console.log(error);
      });
  };

  _signOut = async () => {
    //Remove user session from the device.
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      // this.setState({ user: null }); // Remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };
  // homePageNavigation = e => {
  //   if (this.state.username == this.state.password) {
  //     this.props.navigation.dispatch(
  //       StackActions.reset({
  //         index: 0,
  //         actions: [NavigationActions.navigate({ routeName: "HomePage" })]
  //       })
  //     );
  //   }
  // };

  render() {
    // const { navigate } = this.props.navigation;
    return (
      <ImageBackground
        source={require("../../assets/images/backgroundOption5.jpg")}
        resizeMode="cover"
        style={styles.backgroundImage}
      >{this.state.googleSignedin ? <HomePage/> : 
        <KeyboardAvoidingView
          style={styles.container}
          enabled
          // behavior={""}
          keyboardVerticalOffset={Platform.select({ ios: 60, android: 78 })}
        >
          <View
            style={{
              flexDirection: "column",
              width: Dimensions.get("window").width
            }}
          >
            <View>
              <Text style={styles.logo}>HABIT</Text>
              <Text style={styles.title}>Make it or break it</Text>
            </View>
            {this.state.isLoggedIn ? (
              <View style={{ padding: 20 }}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter username/email"
                  keyboardType="email-address"
                  returnKeyType="next"
                  autoCorrect={false}
                  onChangeText={text => this.setState({ username: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter password"
                  returnKeyType="go"
                  secureTextEntry
                  onChangeText={text => this.setState({ password: text })}
                />
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={this._signOut}
                >
                  <Text style={styles.buttonText}>SIGN IN</Text>
                </TouchableOpacity>
                <View>
                  <Text style={styles.title}>OR</Text>
                </View>
                <GoogleSigninButton
                  style={{ height: 48 }}
                  size={GoogleSigninButton.Size.Wide}
                  color={GoogleSigninButton.Color.Light}
                  onPress={this._signIn}
                />
              </View>
            ) : (
              <ActivityIndicator style={{ padding: 30 }} size="large" />
            )}
          </View>
        </KeyboardAvoidingView>
            }
      </ImageBackground>
    );
  }
}
