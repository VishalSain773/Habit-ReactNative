import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  AlertAndroid
} from "react-native";
import Modal from "react-native-modal";
import fire, {db} from "../../../config/fire";
import {
  GoogleSignin,
} from "react-native-google-signin";


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
    height: 200,
    width: 300,
    borderRadius: 10
  },
  goalHeadingContainer: {
    fontSize: 25,
    fontFamily: "iceland_regular",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 20
  },
  goalHeading: {
    // backgroundColor:"red",
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
  modalInputArea: {
    justifyContent: "center",
    alignItems: "center"
  }
});



class NewGoalModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goal : "",
    }
    // console.log(this.props.currentUser)
  }

  handleChange = e => {
    this.setState({
      goal: e.nativeEvent.text
    });
  };
  
  updateDatabase = () => {
    var currentDate = new Date().toLocaleString();
    fire.database().ref('/goals/'+ this.props.currentUser.user.id).push({
        goal: this.state.goal,
        status : "Uncompleted",
        startDate: currentDate,
        active : "false"
    });
    this.props.setModalVisible(false)
  }

  render() {
    const props = this.props;
    return (
      <Modal
        isVisible={props.modalVisible}
        onBackdropPress={() => props.setModalVisible(false)}
        onSwipeComplete={() => props.setModalVisible(false)}
        swipeDirection="left"
      >
        <View style={styles.modalContainer}>
          <View style={styles.dailogContainer}>
            <View style={styles.goalHeadingContainer}>
              <Text style={styles.goalHeading}>Enter you goal</Text>
            </View>
            <View style={styles.modalInputArea}>
              <TextInput
                style={styles.goalInputText}
                placeholder="Please enter your goal here"
                returnKeyType="go"
                autoCorrect={false}
                onChange = {this.handleChange}
              />
            </View>
            <View style={styles.goalFooterContainer}>
              <TouchableOpacity onPress={() => props.setModalVisible(false)}>
                <Text style={styles.modalButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.updateDatabase}>
                <Text style={styles.modalButton}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default NewGoalModal;
