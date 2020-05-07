const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 压缩css
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// 使用OptimizeCSSAssetsPlugin压缩css会导致webpack默认的js压缩无效，需要使用TerserJSPlugin压缩js代码
const TerserJSPlugin = require('terser-webpack-plugin')

module.exports = {
    // 开发模式development 生产模式： production,开发模式不压缩打包后的代码，生产模式默认压缩打包后的代码
    // mode: 'production',
    entry: './src/index.js',
    output: {
        filename: 'main.[hash:6].js',
        publicPath: '/',
        path: path.resolve(__dirname, '../dist'),
        chunkFilename: '[name].bundle.js'
    },
    // 配置模块解析
    resolve:{
        // 别名
        alias: {
            '@': path.resolve(__dirname, '../src')
        },
        // 匹配文件拓展名
        extensions: ['.js', '.css', '.json', '.vue']
    },
    // 性能优化
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],

    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new HtmlWebpackPlugin({
            // 文件名
            filename: 'index.html',
            // 模板路径
            template: './public/index.html',
            // hash 引入的css html添加hash
            hash: true,
            // 生产环境压缩代码
            minify: {
                // 压缩一行
                    collapseWhitespace: true,
                    removeComments: true, // 删掉注释
                    // 双引号
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true
            }

        }),
        // 复制插件
        new CopyPlugin([
                { from: path.resolve(__dirname, '../public'), to: '' }
        ]),
        // 署名插件
        // new webpack.BannerPlugin('webpack BanenrPlugin添加注释信息'),
        // 给每一个模块提供一个全局变量， 每个模块都可以访问$ _
        new webpack.ProvidePlugin({
            // $: 'jquery',
            // _: 'lodash'
        }),

    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: process.env.NODE_ENV === 'development',
                        reloadAll: true
                    }
                }, 'css-loader', 'postcss-loader']
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: process.env.NODE_ENV === 'development',
                        reloadAll: true
                    }
                }, 'css-loader', 'postcss-loader', 'less-loader', ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|ico)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        outputPath: 'images',
                        name: '[name].[hash].[ext]'
                    }
                }]
            },{
                // 解析html中的图片
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        attributes: {
                            list: [
                                {
                                    tag: 'img',
                                    attribute: 'src',
                                    type: 'src'
                                }
                            ]
                        },
                        // minimize: true
                    }
                }]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/, loader: "babel-loader"
            }
            // 注入全局变量 然后 在文件中导入jquery，就可以通过window.$访问
            // {
            //     test: require.resolve('jquery'),
            //     use: [{
            //         loader: 'expose-loader',
            //         options: '$'
            //     }]
            // }
        ]
    },
    // devtool: 'source-map'
    // watch: true
}
