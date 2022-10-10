import React from 'react';
import {
    StyleSheet,
    View,
    Button
} from 'react-native';
//import HighchartsReactNative from '@highcharts/highcharts-react-native';

const modules = [
    //'solid-gauge'
];

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={ styles.container }/>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flex: 1
    },
    button: {
        justifyContent: 'center'
    }
});
