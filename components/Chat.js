import React from "react";
import { StyleSheet, View, Text, Button, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

// const firebase = require("firebase");
// require("firebase/firestore");


export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
             uid: 0,
            user: {
              _id: "",
              name: "",
              avatar: "",
            },
            loggedInText: "",
        }

    //web app firebase configuration
    if(!firebase.apps.length) {
        firebase.initializeApp({
            apiKey: "AIzaSyByU_GbYkXbNVvR1T9wk5w4lTB4CxiXcCU",
            authDomain: "test-b07e2.firebaseapp.com",
            projectId: "test-b07e2",
            storageBucket: "test-b07e2.appspot.com",
            messagingSenderId: "235481165335",
            appId: "1:235481165335:web:a803dcd73ad9c7450af652",
        })
    }

    this.referenceMessagesUser = null;
    this.addMessage = this.addMessage.bind(this);
     }

   onCollectionUpdate = (querySnapshot) => {
    const messages = [];

    //go through each document
    querySnapshot.forEach((doc) => {
        //get the querydocument snapshot data
        let data = doc.data();
        messages.push({
            _id: data._id,
            text: data.text,
            createdAt: data.createdAt.toDate(),
            user: data.user,
        //      user: {
        //       _id: data.user._id,
        //       name: data.user.name,
        //       avatar: data.user.avatar || '',
        // },
        })

        this.setState({
            messages
        })
    })
   }

   addMessage = () => {
    const message = this.state.messages[0];
    this.referenceMessages.add({
       // uid: this.state.uid,
        _id: message._id,
        text: message.text || "",
        createdAt: message.createdAt,
        user: message.user,
    });
   }

    componentDidMount(){
         // to set firestone reference messages
         this.referenceMessages = firebase
         .firestore()
         .collection("messages")

         // lets the name be included in the navigation bar
         let name = this.props.route.params.name;
         this.props.navigation.setOptions({ title: name });

        

        //  this.unsubscribe = this.referenceMessages.onSnapshot(
        //     this.onCollectionUpdate
        //   );

         //to listen to authentication events
         this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if(!user) {
                firebase.auth().signInAnonymously();
            }
            this.setState({
                uid: user?.uid,
                messages: [
                    {
                        _id: 2,
                     //   loggedInText: `${name} has entered the chat`,
                        createdAt: new Date(),
                        system: true,
                    }
                ],
                // user: {
                //     _id: user.uid,
                //     name: name,
                // }
            })
            this.unsubscribe = this.referenceMessages
              .orderBy("createdAt", "desc")
              .onSnapshot(this.onCollectionUpdate);
         })

        // this.setState({
        //     messages: [
        //         {
        //           _id: 1,
        //           text: 'Hello developer',
        //           createdAt: new Date(),
        //           user: {
        //             _id: 2,
        //             name: 'React Native',
        //             avatar: 'https://placeimg.com/140/140/any',
        //           },
        //         },
        //         // system messages to display the last time a use was active on the app
        //         {
        //             _id: 2,
        //             text: 'You have entered the Chat',
        //             createdAt: new Date(),
        //             system: true,
        //         },
        //       ],
        // })
       
    }

    //to send messages

    onSend(messages = []) {
    
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
      }
    );
  }

    componentWillUnmount() {
        // to stop listening to authentication
       // this.unsubscribe();
        this.authUnsubscribe();

        //to stop listening for changes
        //this.unsubscribeListUser();
    }
    
    // to change the speech bubble color
    renderBubble(props) {
        return (
            <Bubble
            // ...props to inherit props
              {...props}
              wrapperStyle={{
                // to target the right speech bubbles (the sender)
                right: {
                    backgroundColor: '#4B0082'
                }
              }}
            />
        )
    }
    

    render() {
        // to change background color
        let color = this.props.route.params.color;
        return (
            <View style={[styles.container, { backgroundColor: color}]}>
                <GiftedChat
                  renderBubble={this.renderBubble.bind(this)} 
                  messages={this.state.messages}
                  onSend={messages => this.onSend(messages)}
                  user={{
                   _id: this.state.uid,
                   avatar: 'https://placeimg.com/140/140/any',
                  }}
                />
                
                {/* fixes the keyboard entering the input box */}
                { Platform.OS === 'android' ? (
                <KeyboardAvoidingView behavior="height"/>
                ) : null
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
     flex: 1,
    },
    });
    