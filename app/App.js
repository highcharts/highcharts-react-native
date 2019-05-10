import React from 'react';
import {
    StyleSheet,
    WebView,
    Text,
    View,
    Button
} from 'react-native';
import HighchartsReactNative from './src/HighchartsReactNative';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chartOptions: {
                title: {
                    text: 'My chart'
                },
                tooltip: {
                    formatter: function () {
                        return 'Point Y: ' + this.y;
                    }
                },
                series: [{
                    data: [1, 3, 2]
                }]
            }
        };
    }

    chartUpdate() {
        this.setState({
            chartOptions: {
                title: {
                    text: 'Updated chart'
                },
                tooltip: {
                    formatter: function () {
                        return 'Point value: ' + this.y;
                    }
                }
            }
        });
    }

    render() {
        return (
            <View>
                <HighchartsReactNative
                    styles={styles.container}
                    options={this.state.chartOptions}
                />
                <Button
                    onPress={this.chartUpdate.bind(this)}
                    style={styles.button}
                    title='Chart update'
                    color='#000'
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 200,
        backgroundColor: '#fff',
        justifyContent: 'center'
    }
});
