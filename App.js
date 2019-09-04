import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button
} from 'react-native';
import HighchartsReactNative from './dist/src/HighchartsReactNative';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chartOptions: {
                series: [{
                    data: [1, 5, 2]
                }]
            }
        };
    }

    render() {
        return (
            <View>
                <HighchartsReactNative
                
                    styles={styles.container}
                    options={this.state.chartOptions}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        justifyContent: 'center'
    }
});