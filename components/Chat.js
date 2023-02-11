import React from "react";
import { View, Text, Button } from "react-native";

export default class Chat extends React.Component {
    componentDidMount(){
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });
    }

    render() {
        return (
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Hello Screen2!</Text>
            </View>
        )
    }
}