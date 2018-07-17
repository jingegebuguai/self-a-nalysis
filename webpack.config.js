const resolve = require('path').resolve
const webpack = require('webpack')
const HappyPack = require('happypack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const url = require('url')


module.exports = (options = {}) => {

    let publicPath = ''
    if (options.prod) {
        publicPath = '/self-analysis/static/'
    } else if (options.test) {
        publicPath = '/self-analysis-test/static/'
    }

    console.info("==> publicPath", publicPath)

    return {
        entry: {
            vendor: './src/vendor',
            index: './src/main.js'
        },
        output: {
            path: resolve(__dirname, 'dist'),
            filename: options.dev ? '[name].js' : '[name].js?[chunkhash]',
            chunkFilename: '[id].js?[chunkhash]',
            publicPath
        },
        module: {
            rules: [{
                test: /\.vue$/,
                use: ['vue-loader']
            }, {
                test: /\.js$/,
                use: ['happypack/loader?id=babel'],
                include: [resolve('src'), resolve('node_modules/element-ui/src/mixins/emitter.js')]
            }, {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            }, {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            }, {
                test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000
                    }
                }]
            }]
        },
        plugins: [
            new webpack.DefinePlugin({
                __DEV__: false
            }),
            new webpack.optimize.CommonsChunkPlugin({
                names: ['vendor', 'manifest']
            }),
            new HtmlWebpackPlugin({
                template: 'src/index.html'
            }),
            new HappyPack({
                id: 'babel',
                threads: 6,
                loaders: ['babel-loader']
            })
        ],
        resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '~': resolve(__dirname, 'src')
            }
        },
        node: {
            net: 'empty',
        },
        devServer: {
            host: 'localhost',
            port: 8010,
            publicPath: '/self-analysis/static/',
            proxy: {
                '/self-analysis/static/api/': {
                    target: 'http://localhost:8081',
                    pathRewrite: {"^/self-analysis/static/api/": "/self-analysis/api/"},
                    changeOrigin: true
                }
            },
            historyApiFallback: {
                index: url.parse(options.dev ? '/assets/' : publicPath).pathname,
                disableDotRule: true,
                rewrites: [
                    {from: /^index.html$/, to: '/index.html'}
                ]
            }
        },
        devtool: options.dev ? '#eval-source-map' : '#eval'
    }
}
