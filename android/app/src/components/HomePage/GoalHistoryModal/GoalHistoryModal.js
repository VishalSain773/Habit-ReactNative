import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions
  // CheckBox
} from "react-native";
import Modal from "react-native-modal";
import { CheckBox } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import fire, { db } from "../../../config/fire";
import { GoogleSignin } from "react-native-google-signin";

var width = Dimensions.get("window").width;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  dailogContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    height: 500,
    width: width
  },
  goalHeadingContainer: {
    fontSize: 25,
    flexDirection: "row",
    fontFamily: "iceland_regular",
    position: "absolute",
    top: 0,
    padding: 20,
    justifyContent: "flex-end",
    alignItems: "center",
    height: 120,
    // backgroundColor:"red",
    width: width
  },
  goalHeading: {
    fontSize: 20,
    fontWeight: "bold"
  },
  goalFooterContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    right: 20,
    height: 40
  },
  goalInput: {
    backgroundColor: "#000",
    width: 200
  },
  modalButton: {
    backgroundColor: "#d4d4d6",
    color: "gray",
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 8,
    borderRadius: 5
  },
  goalInputText: {
    height: 40,
    color: "#000",
    backgroundColor: "#e5e5e5",
    borderRadius: 5,
    paddingHorizontal: 20
  },
  modalBody: {
    justifyContent: "center",
    alignItems: "center",
    height: 300,
    width: width,
    overflow: "scroll"
  },
  flatList: {
    flexDirection: "row"
    // justifyContent: "center",
  },
  itemDone: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    padding: 10,
    fontSize: 18,
    height: 44
  },
  itemUndone: {
    textDecorationStyle: "solid",
    padding: 10,
    fontSize: 18,
    height: 44
  },
  filterCheckBox: {
    backgroundColor: "transparent",
    padding: 2,
    borderWidth: 0
  },
  goalHistoryOptionContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    height: 125,
    width: 250,
    fontSize: 16,
    fontSize: 20,
    borderRadius: 10
  },
  goalHistoryOptionFooter:{
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    height: 40
  },
  modalMainText:{
    // justifyContent: "center",
    // alignItems: "center",
    fontSize: 16,
    fontWeight: "700",
    left: 10,
    top: 0
  },
  activateButton: {
    backgroundColor: "#25e000",
    color: "white",
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 8,
    borderRadius: 5
  },
  deleteButton: {
    backgroundColor: "#ff2638",
    color: "white",
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 8,
    borderRadius: 5
  },
  cancelButton: {
    backgroundColor: "#d4d4d6",
    color: "gray",
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 8,
    borderRadius: 5
  },
goalHistoryOptionModalContainer : {
  flex: 1,
  justifyContent: "center",
  alignItems: "center"
}
});

class GoalHistoryModal extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      previousGoals: [],
      filteredData: [],
      checkedCompleted: false,
      checkedUncompleted: false,
      isHistoryData: false,
      selectedGoalKey : ""
    };
  }

  componentDidMount() {
    console.log(this.props.previousGoals);
   
  }

  handleCheckboxPress = completeString => {
    if (completeString == "Completed") {
      this.setState({ checkedCompleted: !this.state.checkedCompleted });
    } else if (completeString == "Uncompleted") {
      this.setState({ checkedUncompleted: !this.state.checkedUncompleted });
    }
  };

  updateDataBase = (selectedData,index) => {
    this.setState({ isHistoryData: true, selectedGoalKey :  this.props.previousGoalsKeys[index]});
    // console.log(selectedData,this.props.previousGoalsKeys[index]);
  };  

  activateSelectedGoal = () => {
      console.log("Activating the current goal")
      console.log(this.props.previousGoalsKeys)
      for(let i = 0 ; i < this.props.previousGoalsKeys.length ; i++ ) {
        fire.database().ref("/goals/"+this.props.currentUser.user.id + "/" + this.props.previousGoalsKeys[i]).update({active : "false"})  
      }
      fire.database().ref("/goals/"+this.props.currentUser.user.id + "/" + this.state.selectedGoalKey).update({active : "true"})
      this.setState({ isHistoryData: false })
  }

  render() {
    const props = this.props;
    const state = this.state;
    var filteredData = props.previousGoals;
    // console.log(this.props.currentUser);

    if (state.checkedCompleted == true && state.checkedUncompleted == false) {
      filteredData = props.previousGoals.filter(function(item) {
        return item.status == "Completed";
      });
    } else if (
      props.checkedUncompleted == true &&
      state.checkedCompleted == false
    ) {
      filteredData = props.previousGoals.filter(function(item) {
        return item.status == "Uncompleted";
      });
    } else {
      filteredData = props.previousGoals;
    }

    return (
      <Modal
        isVisible={props.modalVisible}
        onBackdropPress={() => props.setModalVisible(false)}
        onSwipeComplete={() => props.setModalVisible(false)}
        swipeDirection="left"
      >
        <Modal
          isVisible={state.isHistoryData}
          onBackdropPress={() => this.setState({ isHistoryData: false })}
          onSwipeComplete={() => this.setState({ isHistoryData: false })}
          swipeDirection="left"
        >
          <View style={styles.goalHistoryOptionModalContainer}>
            <View style={styles.goalHistoryOptionContainer}>
                <View style={styles.modalMainText} >
                  <Text style={{fontWeight:"bold",fontSize:14}}>What would you like to do with the selected option?</Text>
                </View>
              <View style={styles.goalHistoryOptionFooter}>
              <TouchableOpacity onPress={() => this.activateSelectedGoal()}>
                <Text style={styles.activateButton}>Activate</Text>
              </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setState({ isHistoryData: false })}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.updateDatabase}>
                  <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
              </View>
              </View>
            </View>
        </Modal>
        <View style={styles.modalContainer}>
          <View style={styles.dailogContainer}>
            <View style={styles.goalHeadingContainer}>
              <View style={{ marginHorizontal: 5 }}>
                <Text style={styles.goalHeading}>History</Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  marginTop: 5,
                  justifyContent: "flex-end"
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <CheckBox
                    containerStyle={styles.filterCheckBox}
                    checked={this.state.checkedCompleted}
                    onPress={() => this.handleCheckboxPress("Completed")}
                    title="Completed"
                  />
                </View>
                <View style={{ flexDirection: "row" }}>
                  <CheckBox
                    containerStyle={styles.filterCheckBox}
                    checked={this.state.checkedUncompleted}
                    onPress={() => this.handleCheckboxPress("Uncompleted")}
                    title="Left in between"
                  />
                </View>
              </View>
            </View>
            <View style={styles.modalBody}>
              <FlatList
                data={filteredData}
                keyExtractor={(item, index) => "" + index}
                renderItem={({ item, index }) => (
                  <View style={styles.flatList}>
                    <Text style={styles.itemUndone}>{index + 1}.)</Text>
                    <TouchableOpacity
                      onPress={() => this.updateDataBase(item,index)}
                    >
                      <Text
                        style={
                          item.status === "Completed"
                            ? styles.itemDone
                            : styles.itemUndone
                        }
                      >
                        {item.goal}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                // keyExtractor={item => item}
              />
            </View>
            <View style={styles.goalFooterContainer}>
              <TouchableOpacity onPress={() => props.setModalVisible(false)}>
                <Text style={styles.modalButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => props.setModalVisible(false)}>
                <Text style={styles.modalButton}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default GoalHistoryModal;
