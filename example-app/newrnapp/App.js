/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import { WebView } from 'react-native-webview';
import HighchartsReactNative from '@highcharts/highcharts-react-native';

const chartOptions = {
  series: [{
      name: 'Speed',
      data: [1, 10, 3]
  }],
  chart: {
      type: 'line'
  }
};

const App: () => React$Node = () => {

  return (
    <View>
      <HighchartsReactNative
          useCDN={true}
          styles={styles.container}
          options={chartOptions}
          useSSL={true}
          //modules={modules}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        top: 100,
        width: 300,
        height: 300
    },
    button: {
        justifyContent: 'center'
    }
});
