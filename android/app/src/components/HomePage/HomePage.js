import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Icon } from "react-native-elements";
import NewGoalModal from "./NewGoalModal/NewGoalModal";
import GoalHistoryModal from "./GoalHistoryModal/GoalHistoryModal";
import fire from "../../config/fire";
import { GoogleSignin } from "react-native-google-signin";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#dbdbdb"
  },
  timeLeft: {
    fontFamily: "digital_7",
    fontSize: 150
  },
  buttonContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    padding: 20,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  addGoalButton: {
    display: "flex",
    height: 50,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2AC062",
    margin: 5,
    padding: 20,
    shadowOpacity: 0.4,
    shadowOffset: { height: 10, width: 0 },
    shadowRadius: 20
  },
  addGoalText: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  goalHistory: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  quitGoal: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  goalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    padding: 20,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  currentGoal: {
    fontFamily: "cursive",
    fontSize: 30
  }
});

export default class HomePage extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      timer: 21,
      goal: "",
      newGoalModal: false,
      goalHistoryModal: false,
      currentUser: {},
      previousGoalsData: {},
      previousGoalsKeys: {}
    };
  }

  componentDidMount() {
    _isMounted = true;
    console.log('Entered did mount')
    GoogleSignin.configure({
      //It is mandatory to call this method before attempting to call signIn()
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
      // Repleace with your webClientId generated from Firebase console
      webClientId:
        "949967617820-ad03db95vcv7d6qiigak2tjse122hbc8.apps.googleusercontent.com"
    });
    if (_isMounted) {
      this.getCurrentUser();   
    }
  }

  componentWillUnmount() {
    _isMounted = false;
  }

  getCurrentUser = async () => {
    const currentUser = await GoogleSignin.getCurrentUser();
    console.log(currentUser);
    var itemList = [];
    var query = fire.database().ref('/goals/'+ currentUser.user.id).orderByChild('active').equalTo('true');
      var data = query.on('value', function(snapshot) {
        snapshot.forEach(function(user) {
          itemList.push(user.val().goal);
          return false
        });
        this.setState({goal : itemList[0]});
      }.bind(this));
      this.setState({ currentUser });
  };

  setNewGoalModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

  setGoalHistoryModalVisible = visible => {
    fire
      .database()
      .ref("/goals/" + this.state.currentUser.user.id)
      .on("value", snapshot => {
        let data = snapshot.val();
        console.log(data);
        if (data != undefined || data != null) {
          let previousGoals = Object.values(data);
          let previousGoalsKeys = Object.keys(data);
          console.log(previousGoals);
          this.setState({
            goalHistoryModal: visible,
            previousGoalsData: previousGoals,
            previousGoalsKeys
          });
        } else {
          alert(
            "There is no data available for you " +
              this.state.currentUser.user.name +
              ". Please use add new goal option on the home page"
          );
        }
      });
      var query = fire.database().ref('/goals/'+ this.state.currentUser.user.id).orderByChild('active').equalTo('true');
      var itemList = [];
      query.on('value', function(snapshot) {
        snapshot.forEach(function(user) {
          itemList.push(user.val().goal);
          return false
        });
        this.setState({goal : itemList[0]});
      }.bind(this));
  };

  changeGoal = (goal) => {
    this.setState({goal})
  }

  logout = () => {
    fire.auth().signOut();
    this._signOut();
  };

  _signOut = async () => {
    //Remove user session from the device.
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <NewGoalModal
            modalVisible={this.state.modalVisible}
            setModalVisible={this.setNewGoalModalVisible}
            currentUser={this.state.currentUser}
          />
          <GoalHistoryModal
            modalVisible={this.state.goalHistoryModal}
            setModalVisible={this.setGoalHistoryModalVisible}
            currentUser={this.state.currentUser}
            previousGoals={this.state.previousGoalsData}
            previousGoalsKeys={this.state.previousGoalsKeys}
          />
          <View style={styles.addGoalText}>
            <Icon
              raised
              name="plus"
              type="font-awesome"
              color="#f50"
              onPress={() =>
                this.setNewGoalModalVisible(!this.state.modalVisible)
              }
            />
          </View>
          <View style={styles.goalHistory}>
            <Icon
              raised
              name="history"
              type="font-awesome"
              color="#f50"
              onPress={() =>
                this.setGoalHistoryModalVisible(!this.state.goalHistoryModal)
              }
            />
          </View>
          <View style={styles.quitGoal}>
            <Icon
              raised
              name="stop"
              type="font-awesome"
              color="#f50"
              onPress={this._signOut}
            />
          </View>
        </View>
        <View style={styles.headerButtons}>
          <Text style={styles.timeLeft}>{this.state.timer}</Text>
        </View>
        <View style={styles.goalContainer}>
          <Text style={styles.currentGoal}>Goal:{this.state.goal}</Text>
        </View>
      </View>
    );
  }
}
