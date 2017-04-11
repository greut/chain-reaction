const path = require('path')
const webpack = require('webpack')
const BundleTracker = require('webpack-bundle-tracker')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

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
        new BundleTracker({filename: './webpack-stats.json'}),
        new ExtractTextPlugin('[name]-[contenthash].css'),
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [['latest']]
                        }
                    }
                ]
            }, {
                test: /\.s?css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    loader: ['css-loader', 'sass-loader']
                })
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
