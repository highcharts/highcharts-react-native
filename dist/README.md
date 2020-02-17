# Highcharts React Native
Official minimal [Highcharts](https://www.highcharts.com/) wrapper for React Native.

## Table of Contents
1. [Getting started](#getting-started)
    1. [General prerequisites](#general-prerequisites)
    2. [Installing](#installing)
    3. [Using](#using)
        1. [Basic usage example](#basic-usage-example)
        2. [Highcharts chart](#highchart-chart)
        3. [Highcharts live data update](#highcharts-live-data-update)
        4. [Highcharts advanced series](#highcharts-advanced-series)
        5. [Optimal way to update](#optimal-way-to-update)
    4. [How to run](#how-to-run)
2. [Options details](#options-details)
    1. [options](#options)
    2. [styles](#styles)
    3. [modules](#modules)
    4. [callback](#callback)
    5. [useSSL](#useSSL)
    6. [useCDN](#useCDN)
    7. [data](#data)
    8. [onMessage](#onMessage)
    9. [loader](#loader)
    10. [webviewStyles](#webviewStyles)
    11. [setOptions](#setOptions)
3. [Get repository](#get-repository)
4. [FAQ](#faq)
    1. [Where to look for help?](#where-to-look-for-help)
    2. [Files are not loaded](#files-are-not-loaded)
    3. [Error loading page](#error-loading-page)

## Getting Started

### General prerequisites

Make sure you have **node**, **NPM** and **React** up to date.
Tested and required versions:

* node 11.2+
* npm 6.7.0+ or similar package manager
* React 16.4+
* React native 0.59.3+

### Installing

Get package from NPM in your React app:

```bash
npm install @highcharts/highcharts-react-native
```

### Using

#### Basic usage example

Import into your React Native project and render a chart:

#### Highcharts chart

```jsx
import React from 'react';
import {
    StyleSheet,
    WebView,
    Text,
    View,
    Button
} from 'react-native';
import HighchartsReactNative from '@highcharts/highcharts-react-native'

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chartOptions: {
                series: [{
                    data: [1, 2, 3]
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
```

### Highcharts live data update

```jsx
import React from 'react';
import {
    StyleSheet,
    WebView,
    Text,
    View,
    Button
} from 'react-native';
import HighchartsReactNative from '@highcharts/highcharts-react-native'

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chartOptions: {
                chart: {
                    events: {
                        load: function () {

                            // set up the updating of the chart each second
                            var series = this.series[0];
                            setInterval(function () {
                                var y = Math.random();
                                series.addPoint(y, true, true);
                            }, 1000);
                        }
                    }
                },
                series: [{
                    data: [1, 2, 3]
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
```

### Highcharts advanced series

```jsx
import React from 'react';
import {
    StyleSheet,
    WebView,
    Text,
    View,
    Button
} from 'react-native';
import HighchartsReactNative from '@highcharts/highcharts-react-native'

const modules = [
    'highcharts-more',
    'solid-gauge'
];

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chartOptions: {
                chart: {
                    type: 'solidgauge'
                },
                series: [{
                    data: [1]
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
                    modules={modules}
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
```

### Optimal way to update

A good practice is to keep all chart options in the state. When `setState` is called, the options are overwritten and only the new ones are passed to the `chart.update` method.

```jsx
import React from 'react';
import {
    StyleSheet,
    WebView,
    Text,
    View,
    Button
} from 'react-native';
import HighchartsReactNative from '@highcharts/highcharts-react-native'

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chartOptions: {
                title: {
                    text: 'Default title'
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
```
### How to run
Expo tools allows you to build, deploy, and quickly iterate on native iOS and Android apps from the same JavaScript codebase.

* Official website: [expo.io](https://expo.io/learn)
* React native getting started: [facebook.github.io/react-native/](https://facebook.github.io/react-native/docs/getting-started)

## Options details

Available options:

```jsx
  <HighchartsReact
    styles={styles}
    webviewStyles={webviewStyles}
    options={this.state.chartOptions}
    modules={modules}
    callback={chartCallback}
    useSSL={true}
    useCDN={true}
    data = {'Data to be stored as global variable in Webview'}
    onMessage = {message => this.onMessage(message)}
    loader = { true }
  />
```

### styles
You can style your container using JavaScript like in the regular react and react native.

### options

Highcharts chart configuration object. Please refer to the Highcharts [API documentation](https://api.highcharts.com/highcharts/). This option is required.

### modules
List of modules which should be added to Highcharts. I.e when you would like to setup `solidgauge` series which requires `highcharts-more` and `solid-gauge` files, you should declare array:

```jsx
const modules = [
    'highcharts-more',
    'solid-gauge'
];
```

and set the parameter.

### callback

A callback function for the created chart. First argument for the function will hold the created `chart`. Default `this` in the function points to the `chart`. This option is optional.

### useCDN

Set the flag as true, if you would like to load files (i.e highcharts.js) from CDN instead of local file system.

### useSSL

Set the flag as true, if you would like to load files (i.e highcharts.js) by SSL. (The useCDN flag is mandatory).

### data
Data to be stored as global variable in Webview.

### onMessage
Global communication between Webview and App.

### loader

Set the flag as true, if you would like to show loader while chart is loading.

### webviewStyles

You can style your webview using JavaScript like in the regular react and react native.

### setOptions

Highcharts chart configuration object. Please refer to the Highcharts [API documentation](https://api.highcharts.com/highcharts/). This option is optional.

```js
const setOptions={
    // Language object. The language object is global and it can't be set on each chart initialization. Instead, use Highcharts.setOptions to set it before any chart is initialized.
    lang: {
        months: [
            'Janvier', 'Février', 'Mars', 'Avril',
            'Mai', 'Juin', 'Juillet', 'Août',
            'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ],
        weekdays: [
            'Dimanche', 'Lundi', 'Mardi', 'Mercredi',
            'Jeudi', 'Vendredi', 'Samedi'
        ]
    }
}
```
### devPort
When you use EXPO in DEV mode, you may to declare address and port to actually load the html file in Android. You cannot use build-in `file:///` when using expo because the android and ios folders don’t exist yet. When it’s in STAGING or PROD skip this option and use default the `file:///android_asset` path.

## Get repository

Clone github repository and install dependencies:

```bash
git clone https://github.com/highcharts/highcharts-react-native
cd highcharts-react-native
npm install
```

## FAQ

### Where to look for help?

[Technical support](https://www.highcharts.com/support) will help you with Highcharts and with the wrapper.

If you have a bug to report or an enhancement suggestion please submit [Issues](https://github.com/highcharts/highcharts-react-native/issues) in this repository.

### Files are not loaded
1. Put the files (i.e. Folder: highcharts-layout and highcharts-files) to `android/app/src/main/assets` and `/ios`

2. Use release mode instead of debug mode
run `react-native run-android --variant=release`

### Error loading page
In the `package.json` remove the `"main": "node_modules/expo/AppEntry.js"` line.
