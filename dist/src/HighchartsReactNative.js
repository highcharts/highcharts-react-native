import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { Asset, FileSystem } from "react-native-unimodules";
import HighchartsModules from "./HighchartsModules";

const win = Dimensions.get("window");
const path =
  FileSystem.documentDirectory + "dist/highcharts-files/highcharts.js";
const stringifiedScripts = {};

let cdnPath = "code.highcharts.com/";
let httpProto = "http://";

export default class HighchartsReactNative extends React.PureComponent {
  static getDerivedStateFromProps(props, state) {
    let width = Dimensions.get("window").width;
    let height = Dimensions.get("window").height;
    if (!!props.styles) {
      const userStyles = StyleSheet.flatten(props.styles);
      const { width: w, height: h } = userStyles;
      width = w;
      height = h;
    }
    return {
      width: width,
      height: height,
    };
  }

  setHcAssets = async (useCDN) => {
    try {
      await this.setLayout();
      await this.addScript("highcharts", null, useCDN);
      await this.addScript("highcharts-more", null, useCDN);
      await this.addScript("highcharts-3d", null, useCDN);
      for (const mod of this.state.modules) {
        await this.addScript(mod, true, useCDN);
      }
      this.setState({
        hcModulesReady: true,
      });
    } catch (error) {
      console.error("Failed to fetch scripts or layout. " + error.message);
    }
  };

  getAssetAsString = async (asset) => {
    const downloadedModules = await FileSystem.readDirectoryAsync(
      FileSystem.cacheDirectory
    );
    let fileName = "ExponentAsset-" + asset.hash + "." + asset.type;

    if (!downloadedModules.includes(fileName)) {
      await asset.downloadAsync();
    }

    return await FileSystem.readAsStringAsync(
      FileSystem.cacheDirectory + fileName
    );
  };

  addScript = async (name, isModule, useCDN) => {
    if (useCDN) {
      const response = await fetch(
        httpProto + cdnPath + (isModule ? "modules/" : "") + name + ".js"
      ).catch((error) => {
        throw error;
      });
      stringifiedScripts[name] = await response.text();
    } else {
      const script = Asset.fromModule(
        isModule && name !== "highcharts-more" && name !== "highcharts-3d"
          ? HighchartsModules.modules[name]
          : HighchartsModules[name]
      );
      stringifiedScripts[name] = await this.getAssetAsString(script);
    }
  };

  setLayout = async () => {
    const indexHtml = Asset.fromModule(
      require("../highcharts-layout/index.html")
    );

    this.setState({
      layoutHTML: await this.getAssetAsString(indexHtml),
    });
  };

  constructor(props) {
    super(props);

    if (props.useSSL) {
      httpProto = "https://";
    }

    if (typeof props.useCDN === "string") {
      cdnPath = props.useCDN;
    }

    // extract width and height from user styles
    const userStyles = StyleSheet.flatten(props.styles);

    this.state = {
      width: userStyles.width || win.width,
      height: userStyles.height || win.height,
      chartOptions: props.options,
      useCDN: props.useCDN || false,
      modules: props.modules || [],
      setOptions: props.setOptions || {},
      renderedOnce: false,
      hcModulesReady: false,
    };
    this.webviewRef = null;

    this.setHcAssets(this.state.useCDN);
  }
  componentDidUpdate() {
    this.webviewRef &&
      this.webviewRef.postMessage(this.serialize(this.props.options, true));
  }
  componentDidMount() {
    this.setState({ renderedOnce: true });
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
      var fcId = "###HighchartsFunction" + i + "###";

      // set reference to function for the later replacement
      if (typeof key === "function") {
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
  render() {
    if (this.state.hcModulesReady) {
      const scriptsPath = this.state.useCDN ? httpProto.concat(cdnPath) : path;
      const setOptions = this.state.setOptions;
      const runFirst = `
                window.data = \"${this.props.data ? this.props.data : null}\";
                var modulesList = ${JSON.stringify(this.state.modules)};
                var readable = ${JSON.stringify(stringifiedScripts)}

                function loadScripts(file, callback, redraw) {
                    var hcScript = document.createElement('script');
                    hcScript.innerHTML = readable[file]
                    document.body.appendChild(hcScript);

                    Highcharts.SVGRenderer.prototype.symbols.line = function (x, y, w, h) {
                        return ['M', x, y, 'L', x + w, y];
                      };

                      if (Highcharts.VMLRenderer) {
                        Highcharts.VMLRenderer.prototype.symbols.line = Highcharts.SVGRenderer.prototype.symbols.line;
                    }

                    if (callback) {
                        callback.call();
                    }

                    if (redraw) {
                        !function(t){"object"==typeof module&&module.exports?module.exports=t:t(Highcharts)}(function(t){"use strict";var i=Math.round,e=Math.min,s=Math.max,r=t.merge,a=t.pick,o=t.each,l=t.Axis.prototype,n=t.Tick.prototype,h=l.init,p=l.render,c=l.setCategories,d=n.getLabelSize,u=n.addLabel,g=n.destroy,f=n.render;function b(t){return JSON.parse(JSON.stringify(t))}function x(t,i){return this.userOptions=b(t),this.name=t.name||t,this.parent=i,this}function y(t){for(var i=t.length,e=0;i--;)e+=t[i];return e}function v(t,i,e){for(t.unshift(new x(i,e));e;)e.leaves=e.leaves?e.leaves+1:1,e=e.parent}function k(t,e,s){e[0]===e[2]&&(e[0]=e[2]=i(e[0])-s%2/2),e[1]===e[3]&&(e[1]=e[3]=i(e[1])+s%2/2),t.push("M",e[0],e[1],"L",e[2],e[3])}function G(t,i){return t.getPosition(t.axis.horiz,i,t.axis.tickmarkOffset)}function m(t,i,e){for(var s,r=t.length;r--;)(s=t[r][i])&&m(s,i,e),e(t[r])}x.prototype.toString=function(){for(var t=[],i=this;i;)t.push(i.name),i=i.parent;return t.join(", ")},l.init=function(t,i){h.call(this,t,i),"object"==typeof i&&i.categories&&this.setupGroups(i)},l.setupGroups=function(t){var i=b(t.categories),e=[],o={},l=this.options.labels,n=l.groupedOptions,h=l.style;!function t(i,e,r,a,o){var l,n=i.length;for(o=o||0,r.depth=r.depth?r.depth:0;n--;)(l=i[n]).categories?(a&&(l.parent=a),t(l.categories,e,r,l,o+1)):v(e,l,a);r.depth=s(r.depth,o)}(i,e,o),this.categoriesTree=i,this.categories=e,this.isGrouped=0!==o.depth,this.labelsDepth=o.depth,this.labelsSizes=[],this.labelsGridPath=[],this.tickLength=t.tickLength||this.tickLength||null,this.tickWidth=a(t.tickWidth,this.isXAxis?1:0),this.directionFactor=[-1,1,1,-1][this.side],this.options.lineWidth=a(t.lineWidth,1),this.groupFontHeights=[];for(var p=0;p<=o.depth;p++){var c=n&&n[p-1]&&n[p-1].style?r(h,n[p-1].style):h;this.groupFontHeights[p]=Math.round(.3*this.chart.renderer.fontMetrics(c?c.fontSize:0).b)}},l.render=function(){if(this.isGrouped&&(this.labelsGridPath=[]),void 0===this.originalTickLength&&(this.originalTickLength=this.options.tickLength),this.options.tickLength=this.isGrouped?.001:this.originalTickLength,p.call(this),!this.isGrouped)return this.labelsGrid&&this.labelsGrid.attr({visibility:"hidden"}),!1;var t=this,i=t.options,e=t.top,s=t.left,r=s+t.width,a=e+t.height,o=t.hasVisibleSeries||t.hasData,l=t.labelsDepth,n=t.labelsGrid,h=t.horiz,c=t.labelsGridPath,d=!1===i.drawHorizontalBorders?l+1:0,u=t.opposite?h?e:r:h?a:s,g=t.tickWidth;for(t.userTickLength&&(l-=1),n||(n=t.labelsGrid=t.chart.renderer.path().attr({strokeWidth:g,"stroke-width":g,stroke:i.tickColor||""}).add(t.axisGroup),i.tickColor||n.addClass("highcharts-tick"));d<=l;)u+=t.groupSize(d),k(c,h?[s,u,r,u]:[u,e,u,a],g),d++;return n.attr({d:c,visibility:o?"visible":"hidden"}),t.labelGroup.attr({visibility:o?"visible":"hidden"}),m(t.categoriesTree,"categories",function(i){var e=i.tick;return!!e&&(e.startAt+e.leaves-1<t.min||e.startAt>t.max?(e.label.hide(),e.destroyed=0):e.label.attr({visibility:o?"visible":"hidden"}),!0)}),!0},l.setCategories=function(t,i){this.categories&&this.cleanGroups(),this.setupGroups({categories:t}),this.categories=this.userOptions.categories=t,c.call(this,this.categories,i)},l.cleanGroups=function(){var t,i=this.ticks;for(t in i)i[t].parent&&delete i[t].parent;m(this.categoriesTree,"categories",function(t){var i=t.tick;return!!i&&(i.label.destroy(),o(i,function(t,e){delete i[e]}),delete t.tick,!0)}),this.labelsGrid=null},l.groupSize=function(t,i){var e=this.labelsSizes,r=this.directionFactor,a=!!this.options.labels.groupedOptions&&this.options.labels.groupedOptions[t-1],o=0;return a&&(o=-1===r?a.x?a.x:0:a.y?a.y:0),void 0!==i&&(e[t]=s(e[t]||0,i+10+Math.abs(o))),!0===t?y(e)*r:e[t]?e[t]*r:0},n.addLabel=function(){var t,i=this.axis;return u.call(this),!(!i.categories||!(t=i.categories[this.pos]))&&(this.label&&this.label.attr("text",this.axis.labelFormatter.call({axis:i,chart:i.chart,isFirst:this.isFirst,isLast:this.isLast,value:t.name,pos:this.pos})),i.isGrouped&&i.options.labels.enabled&&this.addGroupedLabels(t),!0)},n.addGroupedLabels=function(t){for(var i,e=this,s=this.axis,a=s.chart,o=s.options.labels,l=o.useHTML,n=o.style,h=o.groupedOptions,p={align:"center",rotation:o.rotation,x:0,y:0},c=s.horiz?"height":"width",d=0;e;){if(d>0&&!t.tick){this.value=t.name;var u=o.formatter?o.formatter.call(this,t):t.name,g=h&&h[d-1],f=g?r(p,h[d-1]):p,b=g&&h[d-1].style?r(n,h[d-1].style):n;delete f.style,i=a.renderer.text(u,0,0,l).attr(f).css(b).add(s.labelGroup),e.startAt=this.pos,e.childCount=t.categories.length,e.leaves=t.leaves,e.visible=this.childCount,e.label=i,e.labelOffsets={x:f.x,y:f.y},t.tick=e}e&&e.label&&s.groupSize(d,e.label.getBBox()[c]),e=(t=t.parent)?e.parent=t.tick||{}:null,d++}},n.render=function(t,i,r){f.call(this,t,i,r);var a=this.axis.categories[this.pos];if(this.axis.isGrouped&&a&&!(this.pos>this.axis.max)){var o,l,n,h,p,c,d,u=this,g=this.axis,b=this.pos,x=this.isFirst,y=g.max,v=g.min,m=g.horiz,z=g.labelsGridPath,S=g.groupSize(0),L=g.tickWidth,O=G(this,b),M=m?O.y:O.x,T=g.chart.renderer.fontMetrics(g.options.labels.style?g.options.labels.style.fontSize:0).b,A=1,F=m&&O.x===g.pos+g.len||!m&&O.y===g.pos?-1:0;for(x&&k(z,m?[g.left,O.y,g.left,O.y+g.groupSize(!0)]:g.isXAxis?[O.x,g.top,O.x+g.groupSize(!0),g.top]:[O.x,g.top+g.len,O.x+g.groupSize(!0),g.top+g.len],L),m&&g.left<O.x?k(z,[O.x-F,O.y,O.x-F,O.y+S],L):!m&&g.top<=O.y&&k(z,[O.x,O.y+F,O.x+S,O.y+F],L),S=M+S;u.parent;){u=u.parent;var C=(c=a,d=void 0,d=0,x?d=(d=c.parent.categories.indexOf(c.name))<0?0:d:d),W=u.labelOffsets.x,w=u.labelOffsets.y;l=G(this,s(u.startAt-1,v-1)),n=G(this,e(u.startAt+u.leaves-1-C,y)),p=u.label.getBBox(!0),o=g.groupSize(A),F=m&&n.x===g.pos+g.len||!m&&n.y===g.pos?-1:0,h=m?{x:(l.x+n.x)/2+W,y:S+g.groupFontHeights[A]+o/2+w/2}:{x:S+o/2+W,y:(l.y+n.y-p.height)/2+T+w},isNaN(h.x)||isNaN(h.y)||(u.label.attr(h),z&&(m&&g.left<n.x?k(z,[n.x-F,S,n.x-F,S+o],L):!m&&g.top<=n.y&&k(z,[S,n.y+F,S+o,n.y+F],L))),S+=o,A++}}},n.destroy=function(){for(var t=this.parent;t;)t.destroyed=t.destroyed?t.destroyed+1:1,t=t.parent;g.call(this)},n.getLabelSize=function(){if(!0===this.axis.isGrouped){var t=d.call(this)+10;return this.axis.labelsSizes[0]<t&&(this.axis.labelsSizes[0]=t),y(this.axis.labelsSizes)}return d.call(this)},t.wrap(t.Tick.prototype,"replaceMovedLabel",function(t){this.axis.isGrouped||t.apply(this,Array.prototype.slice.call(arguments,1))})});
                        Highcharts.setOptions('${this.serialize(setOptions)}');
                        Highcharts.chart("container", ${this.serialize(
                          this.props.options
                        )});
                    }
                }

                loadScripts('highcharts', function () {
                    var redraw = modulesList.length > 0 ? false : true;
                    loadScripts('highcharts-more', function () {
                        if (modulesList.length > 0) {
                            for (var i = 0; i < modulesList.length; i++) {
                                if (i === (modulesList.length - 1)) {
                                    redraw = true;
                                } else {
                                    redraw = false;
                                }
                                loadScripts(modulesList[i], undefined, redraw, true);
                            }
                        }
                    }, redraw);
                }, false);
            `;

      // Create container for the chart
      return (
        <View
          style={[
            this.props.styles,
            { width: this.state.width, height: this.state.height },
          ]}
        >
          <WebView
            ref={(ref) => {
              this.webviewRef = ref;
            }}
            onMessage={
              this.props.onMessage
                ? (event) => this.props.onMessage(event.nativeEvent.data)
                : () => {}
            }
            source={{
              html: this.state.layoutHTML,
            }}
            injectedJavaScript={runFirst}
            originWhitelist={["*"]}
            automaticallyAdjustContentInsets={true}
            allowFileAccess={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            useWebKit={true}
            scrollEnabled={false}
            mixedContentMode="always"
            allowFileAccessFromFileURLs={true}
            startInLoadingState={this.props.loader}
            style={this.props.webviewStyles}
          />
        </View>
      );
    } else {
      return <View></View>;
    }
  }
}
