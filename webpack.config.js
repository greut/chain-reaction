const path = require('path')
const webpack = require('webpack')
const BundleTracker = require('webpack-bundle-tracker')
const ExtractTextPlugin = require('mini-css-extract-plugin')

module.exports = {
    context: __dirname,
    entry: {
        'game': './games/assets/js/game',
        'stats': './games/assets/js/stats',
        'main': './chain_reaction/assets/js/main',
    },
    output: {
        path: path.resolve('./chain_reaction/assets/gen/'),
        filename: '[name]-[hash].js'
    },
    plugins: [
        new BundleTracker({
            path: __dirname,
            filename: './webpack-stats.json'
        }),
        new ExtractTextPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [['@babel/preset-env']]
                        }
                    }
                ]
            }, {
                test: /\.s?css$/,
                use: [
                    {
                        loader: ExtractTextPlugin.loader
                    },
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    externals: {
        jquery: "jQuery",
        tether: "Tether",
        fabric: "fabric",
        d3: "d3",
        nvd3: "nv"
    }
}
