import React from "react";
import { StyleSheet, View, Text, Button, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";




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

   //gets message from async storage
   async getMessages() {
    let messages = '';
    try {
        messages = await AsyncStorage.getItem('messages') || [];
        this.setState({
            messages: JSON.parse(messages)
        });
    } catch (error) {
        console.log(error.message);
    }
   }

    componentDidMount(){
        // checks if user is online
        NetInfo.fetch().then(connection => {
            if (connection.isConnected) {
                console.log('online');
            } else {
                console.log('offline');
            }
        });

        // retrieves messages from async storage
        this.getMessages();


         // to set firestone reference messages
         this.referenceMessages = firebase
         .firestore()
         .collection("messages")

         // lets the name be included in the navigation bar
         let name = this.props.route.params.name;
         this.props.navigation.setOptions({ title: name });

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
                        createdAt: new Date(),
                        system: true,
                    }
                ],
            })
            this.unsubscribe = this.referenceMessages
              .orderBy("createdAt", "desc")
              .onSnapshot(this.onCollectionUpdate);
         })

       
       
    }

    async saveMessages() {
        try{
            await AsyncStorage.setItem('messages', 
            JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
            this.setState({
                messages: []
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    //to send messages

    onSend(messages = []) {
    
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
       this.saveMessages();
       this.addMessage();
      }
    );
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

    // to change how the input bar is rendered 
    renderInputToolbar(props) {
        if (this.state.isConnected === false) {
        } else {
            return(
                <InputToolbar
                {...props}
                />
            );
        }
    }

    componentWillUnmount() {
        // to stop listening to authentication
       // this.unsubscribe();
        this.authUnsubscribe();

        //to stop listening for changes
        //this.unsubscribeListUser();
    }
    

    render() {
        // to change background color
        let color = this.props.route.params.color;
        return (
            <View style={[styles.container, { backgroundColor: color}]}>
                <GiftedChat
                  renderBubble={this.renderBubble.bind(this)}
                  renderInputToolbar={this.renderInputToolbar.bind(this)}
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
    