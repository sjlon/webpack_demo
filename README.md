#### webpack作用

* 代码转译
* 模块合并
* 混淆压缩
* 代码分隔
* 自动刷新
* 代码校验
* 自动部署
#### webpack安装

webpack是基于项目的打包工具，建议在项目中安装webpack
`npm i webpack webpack-cli -D`

#### 项目中使用webpack

##### webpack-cli

npm 5.2以上版本提供了一个`npx`命令

npx主要解决的问题，就是调用项目内部安装的模块，原理就是在`node_modules`下的`.bin`目录中找到对应的命令执行

使用webpack；`npx webpack`

webpack4.0之后可以实现零配置打包构建，零配置特点就是限制多，无法自定义很多配置

##### webpack配置

webpack四大核心概念
* 入口（entry):程序的入口
* 输出（output):打包后存放的位置
* loader:用于对模块源代码进行转换
* 插件（plugins)：解决loader无法实现的其他功能

1. webpack.config.js
2. 运行`npx webpack`

``````javascript
// webpack配置，遵循commonJs规范
const path = require('path')

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'), // output.path必须为绝对路径
        filename: 'main.[hash:6].js'
    },
     // 开发模式development 生产模式： production,开发模式不压缩打包后的代码，生产模式默认压缩打包后的代码
    mode: 'development'     // mode默认production,区别就是代码是否混淆压缩
}
``````

##### 开发时自动编译工具

每次编译代码时，手动执行`npm run build`会很麻烦

webpack中有几个不同的选项，可以帮助我们自动编译代码：

1. webpack's Watch Mode
2. webpack-dev-server
3. webpack-dev-middleware

大多数场景中，需要使用`webpack-dev-server`

###### watch

在`webpack`指令后面加上`--watch`参数即可

主要的作用就是监视本地项目文件的变化，发现有修改的代码会自动编译打包，生成输出文件

1. 配置`package.json`的scripts`"watch":webpack --watch`
2. 运行`npm run watch`
还可以通过配置文件对watch的参数进行修改

`````javascript
// webpack配置，遵循commonJs规范
const path = require('path')

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'), // output.path必须为绝对路径
        filename: 'bundle.js'
    },
    mode: 'development',     // mode默认production,区别就是代码是否混淆压缩
    watch: true
}
``````

###### webpack-dev-server

1. 安装`devServer`,`devServer`依赖`webpack`，必须在项目中安装webpack，`npm i webpack-dev-server webpack -D`
2. index.html中修改`<script src="/bundle.js"></script>`
3. 运行`npx webpack-dev-server `
4. 运行`npx webpack-dev-server --hot --open --port 8090`
5. 配置`package.json`中的scripts，`"dev": "webpack-dev-server --hot --open --port 8090"`
6. 运行`npm run dev`

cli配置： `"dev": "webpack-dev-server --hot --compress --contentBase src --open --port 8090"`
>  --contentBase src 指定项目根目录为src
>
> --open 自动打开
>
> --port 8090 指定端口号
>
> --hot 热更新-不需要重新打包bundle.js，以补丁的形式，修改哪里，改哪里
>
> --compress 开启gzip压缩
devServer会在内存中生成已经打包好的bundle.js,用于开发使用，打包效率高，修改代码后自动重新打包以及刷新浏览器。

还可以通过配置文件对DevServer的参数进行修改：
1. 修改`webpack.config.js`
``````javascript
    // 开启监视模式，监视文件的变化自动打包
    // watch: true,
    devServer: {
        open: true, //自动打开
        port: 3000, //端口
        hot: true,  //热更新
        compress: true, //gzip压缩
        contentBase: './src'    //根目录
    }
``````
2. 修改package.json中的scripts: `"dev": "webpack-dev-server"`

**注意：** webpack4.3版本以前配置使用hot，需要安装插件`webpack.HotModuleReplacementPlugin`才能使用热更新。如果使用`--hot`启用，则不需要。4.3版本以后不再需要插件

###### html插件

使用webpack-dev-server会默认打开配置的根目录，bundle.js生成在根目录下的内存中，我们需要`index.html`也在内存中生成一份，这就需要`htm-webpack-plugin`
1. 安装html-webpack-plugin插件`npm i html-webpack-plugin -D`
2. 在webpack.config.js中的`plugins`节点下配置

``````javascript
// 引入
let HtmlWebpackPlugin = require('html-webpack-plugin')

plugins: [
    // 将src下面的html生成一个新目录
    new HtmlWebpackPlugin({
        filename: 'index.html',  //打包后的名字
        template:  './public/index.html',  // 模板文件
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
    })
]
``````
1. 根据模板自动在内存中生成html(类似于devServer在内存中生成main.js)
2. 自动引入main.js
3. 打包时自动生成html文件，并引入main.js


###### webpack-dev-middleware

`webpack-dev-middleware`是一个容器，它可以吧webpack处理后的文件传递给服务器（server），`webpack-dev-server`在内部使用了它，同时它也可以作为一个单独的包使用，进行更多自定义设置

1. 安装`experss`和`webpack-dev-middleware`, `npm i express webpack-dev-middleware -D`
2. 新建service.js
``````javascript
// service.js
const express = require('express')
const webpack = require('webpack')
// 引入中间件
const webpackDevMiddleware = require('webpack-dev-middleware')
const config = require('./webpack.config')
const app = express()
const compiler = webpack(config)
// 注册中间件
app.use(webpackDevMiddleware(compiler, {
    publicPath: '/'
}))

app.listen(3000, function() {
    console.log('http://localhost:3000')
})
``````
3. 配置package.json中的scripts：`"server": "node service.js" `
4. 运行`npm run server`

注意：如果使用middleware,必须使用`html-webpack-plugin`插件，否则html文件无法正确的输出到express服务器的根目录

**注意**：在开发时才需要使用自动编译工具，eg:`webpack-dev-server`

项目上线直接使用webpack打包，不需要使用自动编译工具。

#### loader

###### 处理css

1. 安装`npm i css-loader style-loader -D`

``````javascript
module: {
        rules: [
            {
                test: /\.css$/, //匹配的文件后缀
                // webpack读取loader，从右向左读取，会将css交给最右侧的laoder,loader从右向左链式调用
                // css-loader解析css, style-loader将解析的结果放入HTML中
                use: ['style-loader', 'css-loader']
            }
        ]
    },

``````
###### 处理less

1. `npm i less less-loader -D`

``````javascript
{
    test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader']
}
``````

###### 处理scss
1. `npm i node-sass sass-loader -D`

``````javascript
{
    test: /\.s(a|c)ss$/, use: ['style-loader', 'css-loader', 'sass-loader']
}
``````

###### 处理图片和处理字体

1. `npm i file-loader url-loader -D`

url-loader依赖于file-loader

url-loader封装了file-loader
``````javascript
<!--使用url-loader-->
{
    test: /\.(jpg|jpeg|gif|svg|bmp)$/, use: {loader: 'url-loader', options: {
        limit: 5 * 1024     // 图片小于5kb转换W为base64
    }}
}

<!--使用file-loader-->

{
    test: /\.(jpg|jpeg|gif|svg|bmp)$/, use: ['file-loader']
},
{
    test: /\.(woff|woff2|eot|svg|ttf)$/, use: ['file-loader']
}
``````
###### 自定义图片打包目录

``````javascript
{
    test: /\.(jpg|jpeg|gif|svg|bmp)$/, use: {loader: 'url-loader', options: {
        limit: 5 * 1024,     // 图片小于5kb转换W为base64
        outputPath: 'images',    //指定图片的输出目录
        name: '[name]-[hash:4].[ext]'    //图片文件重命名
    }}
},
``````
###### babel的使用
webpack中配置bable
1. `npm install --save-dev babel-loader @babel/core`
``````javascript
module: {
  rules: [
    { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
  ]
}

``````
2. 在项目根目录中创建.babelrc配置并启用一些插件。首先，您可以使用env预置，它支持ES2015+的转换
`npm install @babel/preset-env --save-dev`

``````javascript
<!--在根目录下创建.babelrc-->
{
  "presets": ["@babel/preset-env"]
}
``````

3. 如果需要使用`generator`，无法直接使用babel转换，因为会将`generator`转换为`regeneratorRuntime`然后使用`mark`和`wrap`来实现`generator`。

但由于babel并没有内置`regeneratorRuntime`，所以无法直接使用，安装插件

`npm i @babel/plugin-transform-runtime -D`同时需要安装
`npm i @babel/runtime -D`

在`.babelrc`中添加插件

``````
{
    "presets": ["@babel/preset-env"],
    "plugins": ["@babel/plugin-proposal-class-properties", "@babel/plugin-transform-runtime"]
}

``````

4. 高版本js原型方法

 安装`npm install --save @babel/polyfill`

``````javascript
    entry: ['@babel/polyfill', './src/main.js'],
``````

###### source map的使用

1. devtool

此选项控制是否生成，以及如何生成source map

使用`sourceMapDevToolPlugin`进行更细粒度的配置，查看`source-map-loader`来处理已有source map。选择一种[source map](https://webpack.docschina.org/configuration/devtool/) 格式来增强调试过程。不同的值会明显影响到构建和重新构建的速度

> 可以直接使用`sourceMapDevToolPlugin/EvalSourceMapDevToolPlugin`,来替代使用`devtool`选项，它有更多的选项，但是切勿同时使用`devtool`选项和 `sourceMapDevToolPlugin/EvalSourceMapDevToolPlugin`插件。因为`devtool`选项在内部添加过这些插件，所以会应用两次插件


开发模式推荐： `cheap-module-eval-source-map`

生产环境推荐： `none`


#### 插件

###### clean-webpack-plugin

该插件可以用于自动清除dist目录后重新生成， 在`npm run build`时非常方便

1. 安装

    `npm i clean-webpack-plugin -D`

2. 使用插件，在plugins创建对象

``````javascript
const { CleanWebpackPlugin } = require('clean-webpck-plugin')

plugin : [
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html'
    }),
    new CleacWebpackPlugin()
]
``````
###### copy-webpack-plugin

1. 安装`npm i copy-webpack-plugin -D`

2. 引入插件

``````javascript
const CopyWebpackPlugin = require('copy-webpack-plugin')

plugins: [
    // 将src下面的html生成一个新目录
    new HtmlWebpackPlugin({
        filename: 'index.html',  //打包后的名字
        template:  './src/index.html'   // 模板文件
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([{
        from: path.resolve(__dirname, '../public'),
        to: ''
    }])
],
``````
###### BannerPlugin

这是一个webpack内置的插件，用来给打包的js文件添加版权注释信息

1. 引入webpack

``````javascript
const webpack = require('webpack')


``````

2. 创建插件对象

``````javascript
new webpack.BannerPlugin('webpack BanenrPlugin添加注释信息')

``````

#### html中img标签的图片资源处里

1. 安装

` npm i html-loader -S`

2. 在webpack.config.js中添加配置

``````javascript
{
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
}
``````


#### 多页应用打包

1. 在`webpack.config.js`中配置

``````javascript
module.expoers =  {
    // 1. 修改为多入口
    entry: {
        index: './src/index.js',
        other: './src/other.js'
	},
	output: {
	    // 2. 多入口无法对应一个固定的出口，修改filename为[name]变量
		filename: '[name].js',
		publicPath: '/',
		path: path.resolve(__dirname ,'./dist')
	},
	plugins: [
		// 使用html插件，需要手动配置多入口对应的HTML文件，将指定其对应的输出文件
		new HtmlWebpackPlugin({
			filename: 'index.html', //打包后的名字
            template: './src/index.html', // 模板文件
            chunks: ['index', 'other']   //指定 需要引入的入口
		}),
		new HtmlWebpackPlugin({
			filename: 'other.html', //打包后的名字
            template: './src/other.html', // 模板文件
            chunks: ['other']
	    })
    ]
}
``````

#### 第三方库的两种引入方式
可以通过`expose-loader`进行全局变量注入，同时可以使用内置插件`webpack.ProvidePlugin`对每个模块的闭包空间，注入一个变量，自动加载模块，而不必到处`import`和`require`
1. 安装`npm i expose-loader -D`
``````javascript
// 模块内部引入的对象，是单独一个闭包，不是挂载到window全局下
{
    test: require.resolve('jquery'),    // 解析jQuery模块的绝对路径
    use: {
        loader: 'expose-loader',
        options: '$'    // 暴露出一个$挂载到全局
    }
}
``````

`webpack.ProvidePlugin`将库自动加载到每一个模块

1. 引入webpack
``````javascript
const webpack = require('webpack')
``````
2. 创建插件对象

要自动加载`jquery`， 我们将两个变量都指向对应的node模块
``````javascript
new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery'
})
``````

#### Development、Production不同配置文件打包

项目开发时一般需要使用两套配置文件，用于开发阶段打包（不压缩代码，不优化代码，增加效率）和线上打包（压缩代码、优化代码、打包后直接线上使用）

抽离三个配置文件：

* webpack.base.js
* webpack.prod.js
* webpack.dev.js


步骤如下：
1. 将开发、生产环境共有的配置放到webpack.base.js中，不同的配置各自放入prod、dev文件中
2. 然后在dev和prod中使用`webpack-merge`把自己的配置和base的配置合并后导出`npm i webpack-merge -D`
``````javascript
// webpack.dev.js
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
const webpack = require('webpack')
module.exports = merge(baseConfig, {
	mode: 'production',     // mode默认production,区别就是代码是否混淆压缩
	devtool: 'cheap-module-eval-source-map'
})

// webpack.prod.js
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
const webpack = require('webpack')
module.exports = merge(baseConfig, {
	mode: 'production',     // mode默认production,区别就是代码是否混淆压缩
	devtool: 'none'
})
``````
3. 将package.json中的脚本参数修改，通过`--config`手动指定配置文件
``````javascript
    "dev": "webpack-dev-server --config ./build/webpack.dev.js",
    "build": "webpack --config ./build/webpack.prod.js"
``````

#### 区分环境变量配置全局环境常量

使用webpack内置插件配置环境变量

`````javascript
const webpack = require('webpack')
plugins: [
    new webpack.DefinePlugin({
        IS_DEV: 'true'
    })
]
``````
