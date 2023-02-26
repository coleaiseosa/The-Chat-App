import React from "react";
import { StyleSheet, View, Text, Button, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble, InputToolbar, SystemMessage } from "react-native-gifted-chat";
//import firebase from "firebase";
// import "firebase/firestore";
// import "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import MapView from "react-native-maps";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import CustomActions from "./CustomActions";


const firebase = require("firebase");
require("firebase/firestore");

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
           loggedInText: "Please wait, You are getting logged in",
           image: null,
           location: null,
           isConnected: false,
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

    // this.referenceMessagesUser = null;
    // this.addMessage = this.addMessage.bind(this);

    this.referenceChatMessages = firebase.firestore().collection("messages");
     }

   onCollectionUpdate = (querySnapshot) => {
    if(!this.state.isConnected) 
     return;
    const messages = [];

    //go through each document
    querySnapshot.forEach((doc) => {
        //get the querydocument snapshot data
        let data = doc.data();
        messages.push({
            _id: data._id,
            text: data.text,
            createdAt: data.createdAt.toDate(),
            user: {
                _id: data.user._id,
                name: data.user.name,
                avatar: data.user.avatar || '',
            },
            image: data.image || null,
            location: data.location || null,
        })

        this.setState({
            messages,
        })
    })
   }

   addMessage = () => {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
        uid: this.state.uid,
        _id: message._id,
        text: message.text || "",
        createdAt: message.createdAt,
        user: message.user,
        image: message.image || null,
        location: message.location || null,
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
        // lets the name be included in the navigation bar
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });

         // retrieves messages from async storage
         this.getMessages();


        // checks if user is online
        NetInfo.fetch().then(connection => {
            if (connection.isConnected) {
                this.setState({ isConnected: true});
                console.log('online');

                 // to set firestone reference messages
         this.referenceChatMessages = firebase
         .firestore()
         .collection("messages")

          //to listen to authentication events
          this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if(!user) {
                firebase.auth().signInAnonymously();
            }
            this.setState({
                uid: user.uid,
                messages: [],
                user: {
                    _id: user.uid,
                    name: name,
                },
                loggedInText: '',
            })
            this.unsubscribe = this.referenceChatMessages
              .orderBy("createdAt", "desc")
              .onSnapshot(this.onCollectionUpdate);
         });
            } else {
                this.setState({ isConnected: false });
                console.log('offline');

                this.getMessages();
            }
        });  
       
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
            return <InputToolbar {... props} />
        } else {
            return <InputToolbar {...props} />
    
        }
    }

    componentWillUnmount() {
       if (this.isConnected) {
        this.unsubscribe();
        this.authUnsubscribe();
       }
    }
    
    renderCustomActions = (props) => {
        return <CustomActions {...props} />;
    }

    renderCustomView(props) {
        const { currentMessage } = props;
        if(currentMessage.location) {
            return (
                <MapView
                style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
                region = {{
                    latitude: currentMessage.location.latitude,
                    longitude: currentMessage.location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                />
            )
        }
        return null
    }

    render() {
        // to change background color
        let color = this.props.route.params.color;
        return (
            <ActionSheetProvider>
                <View style={[styles.container, { backgroundColor: color}]}>
                    <Text>{this.state.loggedInText} </Text>
                <GiftedChat
                  renderBubble={this.renderBubble.bind(this)}
                  renderInputToolbar={this.renderInputToolbar.bind(this)}
                  messages={this.state.messages}
                  onSend={(messages) => this.onSend(messages)}
                  renderActions={this.renderCustomActions.bind(this)}
                  renderCustomView={this.renderCustomView.bind(this)}
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
            </ActionSheetProvider>
        )
    }
}

const styles = StyleSheet.create({
    container: {
     flex: 1,
    },
    });
    