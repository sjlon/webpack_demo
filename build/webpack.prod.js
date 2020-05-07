const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const webpack = require('webpack')
const { CleanWebpackPlugin  } = require('clean-webpack-plugin')

module.exports = merge(baseConfig, {
    mode: 'production',
     // 配置sourceMap
    devtool: 'none',
    plugins: [
        // 清除的目录，默认打包目录
        new CleanWebpackPlugin(),
        // 设置环境变量
        new webpack.DefinePlugin({
            IS_ENV: false
        })
    ]
})
