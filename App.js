import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform
} from 'react-native';
import {
  WebView
} from 'react-native-webview';
export default class App extends React.Component {
  render() {
    return <WebView source = {
      {
        uri: 'https://www.wp.pl'
      }
    }
    style = {
      styles.container
    }
    />;
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});