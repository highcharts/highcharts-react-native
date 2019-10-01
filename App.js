import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button
} from 'react-native';
import HighchartsReactNative from './dist/src/HighchartsReactNative';

const modules = [
    //'solid-gauge'
];

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chartOptions: {
                series: [{
                    name: 'Speed',
                    data: [1, 2, 3]
                }],
                chart: {
                    type: 'line'
                }
            }
        };
    }

    render() {
        return (
            <View>
                <HighchartsReactNative
                    //useCDN={true}
                    styles={styles.container}
                    options={this.state.chartOptions}
                    //modules={modules}
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