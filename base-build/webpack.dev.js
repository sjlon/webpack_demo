const merge = require('webpack-merge')
const path = require('path')
const baseConfig = require('./webpack.base')
const webpack = require('webpack')
module.exports = merge(baseConfig, {
    mode: 'production',
    // 配置sourceMap
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        // 启动后访问目录
        contentBase: path.join(__dirname, '../'),
        // 开启压缩
        compress: true,
        // 端口
        port: 9000,
        // 默认打开浏览器
        open: false,
        // 热更新
        hot: true,
        // 进度条
        progress: true,
        // 代理
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:9001',
            }

        }
    },
    plugins: [
        // 设置环境变量
        new webpack.DefinePlugin({
            IS_ENV: true
        })
    ]
})
