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
            <View>              
                <Button
                    onPress={this.chartUpdate.bind(this)}
                    style={styles.button}
                    title='Chart update button'
                    color='red'
                />
                <HighchartsReactNative
                    //useCDN={true}
                    styles={styles.container}
                    options={this.state.chartOptions}
                    useSSL={true}
                    //modules={modules}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center'
    },
    button: {
        justifyContent: 'center'
    }
});