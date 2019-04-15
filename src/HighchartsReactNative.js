import React from 'react';
import {
    WebView,
    Text,
    View,
    Dimensions,
    StyleSheet
} from 'react-native';

const win = Dimensions.get('window');
const path = '../highcharts-files/';
const highchartsLayout = require('../highcharts-layout/index.html');

export default class HighchartsReactNative extends React.PureComponent {
    constructor(props) {
        super(props);

        // extract width and height from user styles
        const userStyles = StyleSheet.flatten(this.props.styles);

        this.state = {
            width: userStyles.width || win.width,
            height: userStyles.height || win.height,
            chartOptions: this.props.options
        };

        // create script tag and apply all references
        this.addHighchartsScripts = this.addHighchartsScripts.bind(this);

        // catch rotation event
        Dimensions.addEventListener('change', () => {
            this.setState({
                width: userStyles.width || Dimensions.get('window').width,
                height: userStyles.height || Dimensions.get('window').height
            });
        });
    }
    componentDidUpdate() {
        // send options for chart.update() as string to webview
        this.webView.postMessage(
            this.serialize(this.props.options, true)
        );
    }
    /**
     * Convert JSON to string. When is updated, functions (like events.load) 
     * is not wrapped in quotes.
     */
    serialize(chartOptions, isUpdate) {
        var hcFunctions = {},
            serializedOptions,
            i = 0;

        serializedOptions = JSON.stringify(chartOptions, function (val, key) {
            var fcId = '###HighchartsFunction' + i + '###';

            // set reference to function for the later replacement
            if (typeof key === 'function') {
                hcFunctions[fcId] = key.toString();
                i++;
                return isUpdate ? key.toString() : fcId;
            }

            return key;
        });

        // replace ids with functions.
        if (!isUpdate) {
            Object.keys(hcFunctions).forEach(function (key) {
                serializedOptions = serializedOptions.replace(
                    '"' + key + '"',
                    hcFunctions[key]
                );
            });
        }

        return serializedOptions;
    }
    // Create <scripts> with references to highcharts files
    addHighchartsScripts() {
        const highchartsInit = `
                Highcharts.chart(
                'container',
                ${this.serialize(this.props.options)},
                ${this.serialize(this.props.callback)}
                )
            `;

        return `
            var modules = ${this.serialize(this.props.modules) || '[]'},
                moduleCounter = modules.length,
                hcScript;

            hcScript = document.createElement('script');

            hcScript.setAttribute('src', '${path}highcharts.js');
            hcScript.onload = function() {

                if (moduleCounter === 0) {
                    ${highchartsInit}
                } else {
                    modules.forEach(function(scr) {

                        var moduleScript = document.createElement('script');

                        moduleScript.setAttribute('src', '${path}' + scr + '.js');
                        moduleScript.onload = function() {

                            moduleCounter--;

                            if (moduleCounter === 0) {
                              ${highchartsInit}
                            }
                        };
                        document.body.appendChild(moduleScript);
                    });
                };
            };
            document.body.appendChild(hcScript);
        `;
    }
    render() {
        // Create container for the chart
        return <View style={[
            this.props.styles,
            { width: this.state.width, height: this.state.height }
        ]}
        >
            <WebView
                ref={(webView) => this.webView = webView}
                source={highchartsLayout}
                injectedJavaScript={this.addHighchartsScripts()}
                originWhitelist={'["*"]'}
                automaticallyAdjustContentInsets={true}
                allowFileAccess={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                scalesPageToFit={true}
                scrollEnabled={false}
                mixedContentMode='always'
            />
        </View>;
    }
}
