const path = require('path')
const webpack = require('webpack')
const BundleTracker = require('webpack-bundle-tracker')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    context: __dirname,
    entry: {
        'game': './chain_reaction/apps/games/assets/js/game',
        'main': './chain_reaction/assets/js/main',
    },
    output: {
        path: path.resolve('./chain_reaction/assets/gen/'),
        filename: '[name]-[hash].js'
    },
    plugins: [
        new BundleTracker({filename: './webpack-stats.json'}),
        new ExtractTextPlugin('[name]-[contenthash].css'),
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
            },{
                test: /\.s?css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    loader: "css-loader!sass-loader"
                })
            }
        ]
    },
    externals: {
        jquery: "jQuery",
        tether: "Tether",
        fabric: "fabric"
    }
}
