var path = require('path')
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

module.exports = {
    context: __dirname,
    entry: './chain_reaction/apps/games/assets/js/game',
    output: {
        path: path.resolve('./chain_reaction/assets/gen/'),
        filename: '[name]-[hash].js'
    },
    plugins: [
        new BundleTracker({filename: './webpack-stats.json'}),
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['latest']
                }
            }
        ]
    },
    externals: {
        jquery: "jQuery",
        fabric: "fabric"
    }
}
