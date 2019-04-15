const hcUtils = {
    // convert string to JSON, including functions.
    parseOptions: function (chartOptions) {
        const parseFunction = this.parseFunction;

        var options = JSON.parse(chartOptions, function (val, key) {
            if (typeof key === 'string' && key.indexOf('function') > -1) {
                return parseFunction(key);
            } else {
                return key;
            }
        });

        return options;
    },
    // convert funtion string to function
    parseFunction: function (fc) {

        var fcArgs = fc.match(/\((.*?)\)/)[1],
            fcbody = fc.split('{');

        return new Function(fcArgs, '{' + fcbody.slice(1).join('{'));
    }
};

// Communication between React app and webview. Receive chart options as string.
document.addEventListener('message', function (data) {
    Highcharts.charts[0].update(
        hcUtils.parseOptions(data.data)
    );
});
