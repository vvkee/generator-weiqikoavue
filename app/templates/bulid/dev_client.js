require('eventsource-polyfill')
var hotClient = require('webpack-hot-middleware/client?reload=true&timeout=3000')
if(module.hot) {
    module.hot.accept();
}
