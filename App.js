import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button
} from 'react-native';
import { WebView } from 'react-native-webview';
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
                    data: [1110, 10, 3]
                }],
                chart: {
                    type: 'line'
                }
            }
        };
    }

    chartUpdate() {
        this.setState({
            chartOptions: {
                title: {
                    text: 'Updated chart'
                }
            }
        });
    }

    render() {
        return (
            <View style={ styles.container }>
                <HighchartsReactNative
                    useCDN={true}
                    styles={styles.container}
                    options={this.state.chartOptions}
                    //devPath={'192.168.0.77:19000'}
                    useSSL={true}
                    //modules={modules}
                />
            </View>
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