const webpack = require('webpack')

module.exports = {
    runtimeCompiler: true,
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery',
                'window.$': 'jquery'
            })
        ]
    }
}
