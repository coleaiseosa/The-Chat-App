import React from "react";
import { StyleSheet, View, Text, Button, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
        }
    }
    componentDidMount(){
        this.setState({
            messages: [
                {
                  _id: 1,
                  text: 'Hello developer',
                  createdAt: new Date(),
                  user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                  },
                },
                // system messages to display the last time a use was active on the app
                {
                    _id: 2,
                    text: 'You have entered the Chat',
                    createdAt: new Date(),
                    system: true,
                },
              ],
        })
        // lets the name be included in the navigation bar
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });
    }

    //to send messages
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
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
                  _id: 1,
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
    