import React from 'react';
import {
    StyleSheet,
    WebView,
    Text,
    View,
    Button
} from 'react-native';
import HighchartsReactNative from '@highcharts/highcharts-react-native';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chartOptions: {
                series: [{
                    data: [1, 3, 2]
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