'use strict';
import path from 'path'
import fs from 'fs'

import webpack from 'webpack'
import _ from 'lodash'
import glob from 'glob'

// webpack plugins
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import QiniuPlugin from 'qiniu-webpack-plugin'

const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin

const rootPath = path.join(process.cwd(), '..')

const srcDir = path.resolve(rootPath, path.join(rootPath, '/src/client'))
const nodeModPath = path.resolve(rootPath, path.join(rootPath, '/node_modules'))
const assets = path.join(rootPath, '/assets/')
const view = path.join(rootPath, '/assets/views/pages/index.html')

// 插件列表
let plugins = []
module.exports = (options) => {
    options = options || {}

    // 声明变量
    let debug = options.debug !== undefined ? options.debug : true,
        publicPath = '/',
        cssLoader,
        lessLoader

    if (debug) {
        // 开发阶段，css直接内嵌
        cssLoader = 'style!css'
        lessLoader = 'style!css!less'
        plugins.push(new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
        }))
        // 热加载
        plugins.push(new webpack.optimize.OccurenceOrderPlugin())
        plugins.push(new webpack.HotModuleReplacementPlugin())
        plugins.push(new webpack.NoErrorsPlugin())
        // html
        plugins.push(new HtmlWebpackPlugin({
            filename: 'index.html',
            template: srcDir + '/index.html',
            inject: 'body'
        }))
    } else {
        publicPath = "http://o8uy2o1i5.bkt.clouddn.com/static/"
        // 编译阶段，css分离出来单独引入
        cssLoader = ExtractTextPlugin.extract('style', 'css?minimize') // enable minimize
        lessLoader = ExtractTextPlugin.extract('style', 'css?minimize','less')

        // css plugins
        plugins.push(
            new ExtractTextPlugin('css/[contenthash:8].[name].min.css', {
                // 当allChunks指定为false时，css loader必须指定怎么处理
                // additional chunk所依赖的css，即指定`ExtractTextPlugin.extract()`
                // 第一个参数`notExtractLoader`，一般是使用style-loader
                // @see https://github.com/webpack/extract-text-webpack-plugin
                allChunks: false
            })
        )

        // js plugins
        plugins.push(
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"production"'
                }
            })
        )

        // js plugins
        plugins.push(
            new UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            })
        )

        plugins.push(new webpack.optimize.OccurenceOrderPlugin())

        // html plugings
        plugins.push(
            new HtmlWebpackPlugin({
                filename: '../views/pages/index.html',
                template: srcDir + '/index.html',
                inject: 'body',
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true
                    // more options:
                    // https://github.com/kangax/html-minifier#options-quick-reference
                }
            })
        )
        var CompressionWebpackPlugin = require('compression-webpack-plugin')

        plugins.push(
            new CompressionWebpackPlugin({
                asset: '[path].gz[query]',
                algorithm: 'gzip',
                test: /\.js$|\.html$|\.css$/,
                threshold: 10240,
                minRatio: 0.8
            })
        )
        // 七牛
        plugins.push(
            new QiniuPlugin({
                ACCESS_KEY: 'ZdTWWI6pGAuZmEi_7stJrAFSL64YGFOjhpZPezIb',
                SECRET_KEY: 'LWubCkQLzScOW_IrAQN2nks-on_7aQm8E7CkKtG7',
                bucket: 'cmsstatic',
                path: 'static'
            })
        )
    }
    let config = {
        entry: debug ? { app: ['./dev_client.js', srcDir + '/main.js']} : srcDir + '/main.js',
        devtool: debug ? '#eval-source-map' : false,
        output: {
            path: path.resolve(assets + 'public'),
            filename: debug ? 'js/[name].js' : 'js/[name].[hash].min.js',
            chunkFilename: debug ? 'js/chunk.js' : 'js/chunk.[hash.]min.js',
            hotUpdateChunkFilename: debug ? 'js/[id].js' : 'js/[id].[hash].min.js',
            publicPath: publicPath
        },
        resolve: {
            root: [srcDir, './node_modules'],
            extensions: ['', '.vue', '.js', '.css', '.less', '.tpl',
                '.png', '.jpg'
            ]
        },
        resolveLoader: {
            root: path.join(__dirname, 'node_modules')
        },
        module: {
            preLoaders: [{
                test: /\.vue$/,
                loader: 'eslint',
                include: srcDir,
                exclude: /node_modules/
            }, {
                test: /\.js$/,
                include: srcDir,
                exclude: /node_modules/,
                loader: 'eslint'
            }],
            loaders: [{
                test: /\.(jpe?g|png|gif)$/i,
                loaders: [
                    'image?{bypassOnDebug: true, progressive:true, \
    optimizationLevel: 3, pngquant:{quality: "65-80", speed: 4}}',
                    // url-loader更好用，小于10KB的图片会自动转成dataUrl，
                    // 否则则调用file-loader，参数直接传入
                    'url?limit=10000&name=img/[hash:8].[name].[ext]',
                ],
                query: {
                    limit: 10000,
                    name: 'images/[hash:7].[name].[ext]'
                }
            }, {
                test: /\.(svg|woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: 'fonts/[hash:7].[name].[ext]'
                }
            }, {
                test: /\.html$/,
                loader: 'vue-html'
            }, {
                test: /\.css$/,
                loader: cssLoader
            }, {
                test: /\.less$/,
                loader: lessLoader
            }, {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel?presets[]=es2015,presets[]=stage-3'
            }, {
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: 'vue'
            }]
        },
        vue: {
            extract: debug ? true : false,
            loaders: ['vue-style-loader', 'less-loader',
                'css-loader',
                'babel?presets[]=es2015,presets[]=stage-3'
            ],
            autoprefixer: {
                browsers: ['Firefox >= 2', 'Safari >= 3', 'Explorer >= 8', 'Chrome >= 4', "ChromeAndroid >= 2.0"]
            }
        },
        eslint: {
            formatter: require('eslint-friendly-formatter')
        },
        plugins: [
            new CommonsChunkPlugin({
                name: 'vender'
            })
        ].concat(plugins)
    }

    return config

}
