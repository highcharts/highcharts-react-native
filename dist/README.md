# Deprecation disclaimer

*This project is no longer actively maintained*

As of 01.01.2021, The React Native wrapper is no longer maintained by Highsoft. The repository will remain available, but we can not guarantee that it will work as intended with future releases of both React Native itself, or Highcharts.

# Highcharts React Native
Official minimal [Highcharts](https://www.highcharts.com/) wrapper for React Native.

## Table of Contents
1. [Getting started](#getting-started)
    1. [General prerequisites](#general-prerequisites)
    2. [Installing](#installing)
    3. [Updating Highcharts package](#updating-highcharts=package)
    4. [Usage](#usage)
        1. [Basic usage example](#basic-usage-example)
        2. [Highcharts chart](#highchart-chart)
        3. [Highcharts live data update](#highcharts-live-data-update)
        4. [Highcharts advanced series](#highcharts-advanced-series)
        5. [Optimal way to update](#optimal-way-to-update)
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
    12. [devPort](#devPort)
3. [Get repository](#get-repository)
4. [FAQ](#faq)
    1. [Where to look for help?](#where-to-look-for-help)
    2. [Files are not loaded](#files-are-not-loaded)
    3. [Error loading page](#error-loading-page)
5. [Changelog](#changelog)

## Getting Started

### General prerequisites

Make sure you have **Node.JS**, **NPM** and **React** up to date.
Tested and required versions:

* node 11.2+
* npm 6.7.0+ or similar package manager

Packages which should be installed within your project:
* React `>=16.4+`
* React Native `>=0.63.2`
* React Native Webview `>=10.6.0`

***If you're using this package with Expo Tools, please make sure your  `Expo SDK`  version is higher than or equal to  `v38.0.0`, otherwise use the  `v2.2.3`  version of this package, which should work from  `v33.0.0`.***

***In bare React Native application you need to also install the `react-native-unimodules` package, and configure the content of `ios` and `android` build directiories like it's described [here](https://docs.expo.io/bare/installing-unimodules/#installation).***

### Installing

Get package from NPM in your React app:

```bash
npm install @highcharts/highcharts-react-native
```

You can either install this wrapper within app based on [Expo tools](https://expo.io/learn), or bare [React Native](https://facebook.github.io/react-native/docs/getting-started) app.

It is required to add the `.hcscript` into the asset extensions section of `metro.config.js` file, or create that file within your project, and configure it like below:
```js
const {getDefaultConfig} = require('metro-config');

module.exports = (async () => {
  const {
      resolver: { sourceExts, assetExts }
  } = await getDefaultConfig()
  return {
      transformer: {
          getTransformOptions: async () => ({
              transform: {
                  experimentalImportSupport: false,
                  inlineRequires: false
              }
          })
      },
      resolver: {
        sourceExts,
        assetExts: [...assetExts, 'hcscript']
      }
    }
})()
```
### Updating Highcharts package

Since this package has been deprecated, we decided to meet our users' needs and created the `update-highcharts` script, which will get the latest Highcharts release and replace source files used by this wrapper, and let the community keep developing the `highcharts-react-native` package.

In order to run the update process, please run the following commands in this package directory:
```bash
npm i
```
and then
```bash
npm run update-highcharts
```
### Usage

#### Basic usage example

Import this package into your React Native project and render the chart:

#### Highcharts chart

```jsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
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
            <View style={styles.container}>
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
        justifyContent: 'center',
        flex: 1
    }
});
```

### Highcharts live data update

```jsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
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
            <View style={styles.container}>
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
        justifyContent: 'center',
        flex: 1
    }
});
```

### Using Highcharts modules e.g solid-gauge, drilldown, or exporting

```jsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import HighchartsReactNative from '@highcharts/highcharts-react-native'

const modules = [
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
            <View style={styles.container}>
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
        justifyContent: 'center',
        flex: 1
    }
});
```

### Optimal way to update

A good practice is to keep all chart options in the state. When `setState` is called, the options are overwritten and only the new ones are passed to the `chart.update` method.

```jsx
import React from 'react';
import {
    StyleSheet,
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
            <View style={styles.container}>
                <HighchartsReactNative
                    styles={styles.container}
                    options={this.state.chartOptions}
                />
                <Button
                    onPress={this.chartUpdate.bind(this)}
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
        justifyContent: 'center',
        flex: 1
    }
});
```
## Options details

Available properties:

```jsx
  <HighchartsReact
    styles={styles}
    webviewStyles={webviewStyles}
    options={this.state.chartOptions}
    modules={modules}
    callback={chartCallback}
    useSSL={true}
    useCDN={true} // or string 'mydomain.com/highchartsfiles/'
    data={'Data to be stored as global variable in Webview'}
    onMessage={message => this.onMessage(message)}
    loader={ true }
    devPort={'xxx.xxx.xxx.xxx:xxxxx'} // i.e 192.168.0.1:12345
    setOptions={highchartsGlobalOptions}
  />
```

| Parameter | Type | Required | Description |
| --------- | :----: | :--------: | ----------- |
| `styles` | Object | no | You can style your container using JavaScript like in the regular react and react native. |
| `options` | Object | yes | Highcharts chart configuration object. Please refer to the Highcharts [API documentation](https://api.highcharts.com/highcharts/). This option is required. |
| `modules` | Array | no | List of modules which should be added to Highcharts. I.e when you would like to setup `solidgauge` series which requires `highcharts-more` and `solid-gauge` files, you should declare array: `const modules = ['solid-gauge']` |
| `callback` | Function | no | A callback function for the created chart. First argument for the function will hold the created `chart`. Default `this` in the function points to the `chart`. This option is optional. |
| `useCDN` | Boolean | no | Set the flag as true, if you would like to load files (i.e highcharts.js) from CDN instead of local file system. You can declare an url to your domain (i.e `mydomain.com/highchartsfiles/`) |
| `useSSL` | Boolean | no | Set the flag as true, if you would like to load files (i.e highcharts.js) by SSL. (The useCDN flag is mandatory). |
| `data` | any | no | Data to be stored as global variable in Webview. |
| `onMessage` | Function | no | Global communication between Webview and App. The function takes the message as the first argument. |
| `loader` | Boolean | no | Set the flag to `true`, if you would like to show loader while chart is loading. |
| `webviewStyles` | Object | no | You can style your webview using JavaScript object structured like in the regular React and React Native apps. |
| `webviewProps` | Object | no | You can pass webview props. |
| `setOptions` | Object | no | Options which are set for Highcharts through `Highcharts.setOptions()` method. Usually it is used to set the `global` and `lang` options. For more details please visit [Highcharts documentation](https://api.highcharts.com/class-reference/Highcharts#.setOptions), and [API](https://api.highcharts.com/highcharts/global). |
| `devPort` | String | no | When using EXPO in DEV mode, you may declare address and port to actually load the html file in Android. You cannot use built-in `file:///` when using Expo,because the Android and iOS folders don’t exist yet. When it’s in STAGING or PROD skip this option and use default the `file:///android_asset` path. |

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

## Changelog

### 3.0
- The way of getting Highcharts javascript files has changed.

Bugfixes: 
- [#39](https://github.com/highcharts/highcharts-react-native/issues/39) - Chart not redering in iOS,
- [#51](https://github.com/highcharts/highcharts-react-native/issues/51) - Chart not rendering on Android Simulator using EXPO cli,
- [#61](https://github.com/highcharts/highcharts-react-native/issues/61) - [Error] Element ref was specified as a string but no owner was set.,
- [#67](https://github.com/highcharts/highcharts-react-native/issues/67) - load event not executing,
- [#70](https://github.com/highcharts/highcharts-react-native/issues/70) - HighchartsReactNative Not working if expo published,
- [#73](https://github.com/highcharts/highcharts-react-native/issues/73) - Highchart disappears in landscape mode,
- [#82](https://github.com/highcharts/highcharts-react-native/issues/82) - Unable to set `backgroundColor` due to old version of `react-native-webview`,
- [#85](https://github.com/highcharts/highcharts-react-native/issues/85) - Error: Failed to compile,
- [#86](https://github.com/highcharts/highcharts-react-native/issues/86) - Can't render the chart on Android

### 3.0.1
- Moved the `react`, `react-native-unimodules`, `react-native-webview` packages into `peerDependencies`.
- Docs improved

### 3.1.0
- The `package.json` cleaned-up, unused dependencies removed.
- Unhandled promise rejections resolved
- Docs improved

Bugfixes:
- [#91](https://github.com/highcharts/highcharts-react-native/issues/91) - Error expo without expo and no charts

### 3.1.1:
- Restored the `react-native-webview` back into the `peerDependencies`.
- Docs improved

### 3.1.2
- Docs improved
Bugfixes:
- [#92] - Charts sometimes fail to render
