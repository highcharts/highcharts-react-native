import * as React from 'react';
import {
  StyleSheet
} from 'react-native';
import {
  WebView
} from 'react-native-webview';

export default class App extends React.Component {

  render() {

    const runFirst = `
      alert("aaa123");
    `;

    return <WebView
        source={{ html: `<br><br><br><h1>Hello world!</h1>` }}
        style={ styles.container }
        onMessage = {this.props.onMessage ? (event) => this.props.onMessage(event.nativeEvent.data) : () => {}}
        injectedJavaScript={runFirst}
        ref={ref => {this.webviewRef = ref}}
        originWhitelist={["*"]}
        automaticallyAdjustContentInsets={true}
        allowFileAccess={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        useWebKit={true}
        scrollEnabled={false}
        mixedContentMode='always'
        allowFileAccessFromFileURLs={true}
        //startInLoadingState = {this.props.loader}
        javaScriptEnabledAndroid={true}
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