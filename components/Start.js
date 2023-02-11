import React from 'react';
import { View, Text, Button, TextInput, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

const backgroundColors = {
    black: { backgroundColor: '#000000'},
    grey: { backgroundColor: '#8a95a5'},
    purple: { backgroundColor: '#474056'},
    orange: { backgroundColor: '#ffa500'}
}

export default class Start extends React.Component {
   
    constructor(props) {
        super(props);
        this.state = { name: '', color: ''};
    }
    render () {
        const { black, grey, purple, orange} = backgroundColors;
        return (
            <View style={styles.container}>
                <ImageBackground
                  source={require('../assets/Background-Image.png')}
                  style={[styles.container, styles.image]}
                >
                    
                  <Text style={styles.title} >App Title</Text>

                  <View style={styles.inputBox} >
                     <TextInput
                       style={styles.nameBox}
                       onChangeText={(name) => this.setState({ name })}
                       value={this.state.name}
                       placeholder='Enter your Name'
                      />

                      <View>
                        <Text style={styles.colorSelector} >Choose your Background:</Text>
                        <View style={styles.colorWrapper}>
                            <TouchableOpacity style={[styles.color, black]}
                              onPress={() =>
                              this.setState({ color: black.backgroundColor })
                              }
                            />

                            <TouchableOpacity style={[styles.color, grey]}
                              onPress={() =>
                              this.setState({ color: grey.backgroundColor })
                              }
                            />

                            <TouchableOpacity style={[styles.color, purple]}
                              onPress={() =>
                              this.setState({ color: purple.backgroundColor })
                              }
                            />

                            <TouchableOpacity style={[styles.color, orange]}
                              onPress={() =>
                              this.setState({ color: orange.backgroundColor })
                              }
                            />
                        </View>
                      </View>
                      <TouchableOpacity
                        style={[styles.nameBox, styles.chatBox]}
                       // title='Go to Chat'
                        onPress={() => 
                        this.props.navigation.navigate('Chat', 
                        {
                             name: this.state.name, 
                             color: this.state.color
                        })
                        }
                        >
                            <Text style={[styles.colorSelector, styles.chatBoxText]} >
                                Start Chatting
                            </Text>
                        </TouchableOpacity>
                  </View>
                </ImageBackground>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    image: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    title: {
        color: '#fff',
        fontSize: 50,
        fontWeight: '600',
        marginTop: 60
    },

    inputBox: {
        backgroundColor: '#fff',
        marginBottom: 15,
        height: '44%',
        width: '88%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20
    },

    nameBox: {
       height: 50,
       width: '88%',
       borderColor: 'grey',
       borderWidth: 1,
       borderRadius: 2,
       color: '#757083',
       opacity: 50,
       fontSize: 16,
       fontWeight: '300',
       paddingLeft: 10
    },

    colorSelector: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        opacity: 100
    },

   colorWrapper: {
    flexDirection: 'row'
   },

   color: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 10
   },

    chatBox: {
        backgroundColor: '#757083',
        justifyContent: 'center'
    },

    chatBoxText: {
        color: '#fff',
        fontWeight: '300'
    }
})