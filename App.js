import React from 'react';
import {
    StyleSheet,
    View,
    Button
} from 'react-native';
import HighchartsReactNative from '@highcharts/highcharts-react-native';

const modules = [
    //'solid-gauge'
];

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chartOptions: {
                chart: {
                    events: {
                        load() {
                            alert(window.Highcharts.version)
                        }
                    }
                },
                title: {
                    text: 'Default title'
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
                chart: {
                    type: 'column'
                },
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
                    //useCDN={true}
                    styles={styles.container}
                    options={this.state.chartOptions}
                    devPath={'192.168.0.1:12345'}
                    //useSSL={true}
                    modules={modules}
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
        justifyContent: 'center',
        flex: 1
    },
    button: {
        justifyContent: 'center'
    }
});