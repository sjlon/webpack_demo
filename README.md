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

#### 1. production模块打包自带优化

* tree shaking

tree shaking 是一个术语，通常用于打包移除javascript中未引用的代码，它依赖于es6模块系统中的import 和 export的`静态结构`的特性

开发时引入一个模块后，如果只使用其中一个功能，上线打包时只会把用到的功能打包进bundle，其他没用到的功能不会打包进来，可以实现最基础的优化

* scope hoisting

scope hoisting的作用是将模块之间的关系进行推测，可以让webpack打包出来的代码文件更小、运行更快

scope hoisting的实现原理：分析出来模块之间的依赖关系，尽可能的吧打散的模块合并到一个函数中去，但前提不能造成代码冗余。因此只有被引用一次的模块才会被合并

由于scope hoisting需要分析模块的依赖关系，因此远吗必须使用es6模块化语句，不然它将无法生效

* 代码压缩

所有代码使用`UglifyjsPlugin`插件进行压缩、混淆


#### 2. css优化

###### 2.1将css提取到独立的文件

`mini-css-extract-plugin`用于将css提取为独立的文件的插件，对每个包含css的js文件都会创建一个css文件，支持按需加载css和sourceMap

只能在webpack4中使用，有如下优势：
* 异步加载
* 不重复复编译, 性能更好
* 更容易使用
* 只针对css

1. 安装 `npm i mini-css-extract-plugin -D`
2.  在webpack中引入插件

`const MiniCssExtractPlugin = require('mini-css-extract-plugin')`

3. 创建插件对象，配置抽离的css文件名，支持placeholder语法

``````javascript
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css'
		})
	]

``````

4. 将原来配置文件中的所有`style-loader`替换为`MiniCssExtractPlugin.loader`
``````javascript
rules: [
	{
		test: /\.css$/, //匹配的文件后缀
		// webpack读取loader，从右向左读取，会将css交给最右侧的laoder,loader从右向左链式调用
		// css-loader解析css, style-loader将解析的结果放入HTML中
		use: [MiniCssExtractPlugin.loader, 'css-loader']
	},
	{
		test: /\.less$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
	},
	{
		test: /\.s(a|c)ss$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
	}
]

``````

###### 2.2 css自动添加前缀

1. 安装插件

`npm i postcss-loader autoprefixer -D`

2. 修改webpack配置文件中的loader，将`postcss-loader`放置在`css-loader`的右边

``````javascript
{
	test: /\.css$/, //匹配的文件后缀
	// webpack读取loader，从右向左读取，会将css交给最右侧的laoder,loader从右向左链式调用
	// css-loader解析css, style-loader将解析的结果放入HTML中
	use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
},
{
	test: /\.less$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader']
},
{
	test: /\.s(a|c)ss$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
}

``````

3.在根目录下添加postcss的配置文件`postcss.config.js`

4.在postcss的配置文件中使用插件

``````javascript
module.export = {
    plugins: [require('autoprefixer')]
}

``````

###### 2.3开启css代码压缩

需要使用`optimize-css-assets-webpack-plugin -D`

但是由于配置css压缩会覆盖掉webpack默认的优化配置，导致js代码无法压缩，所以还需要手动把js代码压缩插件导入`tarser-webpack-plugin`

1. 安装 `cnpm i optimize-css-assets-webpack-plugin tarser-webpack-plugin`

2.导入插件

``````javascript
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
``````

3.在webpack配置文件中添加配置节点

``````javascript

optimization: {
	minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
},
``````

tips：webpack4默认采用的js压缩插件是：`uglifyjs-webpack-plugin`，在`mini-css-extarct-plugin`上一个版本中还推荐使用该插件，但是最新的v0.6建议使用`terser-webpack-plugin`来完成js代码压缩，具体原因官网未说明。


#### 3.js优化

Code Splitting是webpack打包最终的优化特性之一。此特性能将代码分离到不同的bundle中，然后可以按需加载或并行加载这些文件，代码分离可以用于获取更小的bundle，以及控制资源加载优先级，如果使用合理，会极大影响加载时间

有三种常用代码分离方法：
* 入口起点： 使用`entry`配置手动地分离代码
* 防止重复：使用`SplitChunksPlugin`去重和分离chunk
* 动态导入：通过模块的内联函数调用来分离代码

###### 3.1手动配置多入口

1. 在webpack配置文件中添加多入口
``````javascript
enry: {
    main: './src/main.js',
    other: './src/other.js'
},
output: {
    path: path.join(__dirname, '..', './dist'),
    file: '[name].bundle.js',
    publicPath: '/'
}
``````

2.在main.js和Other.js中都引入一个模块，并使用功能
``````javascript
import $ from 'jquery'

$(function() {
    $('<div></div>').html('main').appendTo('body')
})
``````

``````javascript
import $ from 'jquery'

$('<div></div>').html('other').appendTo('body')
``````

3.修改package.json的脚本，添加一个使用dev配置文件进行打包的脚本，（目的是不压缩代码检查bundle时更方便）

``````javascript
"dev-build": "webpack --config ./build/webpack.dev.js"
``````

这种方法存在的一些问题：

* 如果入口chunks之间存在重复的模块，哪些重复的模块会被引入到各个bundle中
* 这种方法不够灵活，并且不能将核心应用程序逻辑进行动态拆分

###### 3.2 抽离公共代码

tips：Webpack v4以上使用的插件`SplitChunksPlugin`，以前使用的`CommonChunkPlugin`已经被移除，最新版的webpack中只需要在配置文件中的`optimization`节点下添加`splitChunks`属性即可进行相关配置

1. 修改webpack配置文件

``````javascript

optimization: {

    splitChunks: {
        chunks: 'all'
    }
}

``````

2. 运行`npm run dev-build`

3. 查看dist目录，已经把公共jQuery模块抽离到一个单独的文件中


###### 3.3 动态导入（懒加载）

webpack默认是允许import语法动态导入的，但是需要babel插件的支持，最新版babel的插件包为：`@/babel/plugin-syntax-dynamic-import`，需要注意动态导入最大的好处是实现了`懒加载`，用到哪个模块加载哪一个模块，可以提高SPA应用程序的`首屏加载速度`，Vue, React, angular 框架的路由懒加载原理一样

1. 安装babel插件

`npm i @babel/plugin-syntax-dynamix-import -D`

2. 修改.babel配置文件，添加`@babel/plugin-syntax-dynamix-import`插件

``````javascript
{
    "presets": ["@babel/env"],
    "plugins": [
        "@babel/plugin-proposal-class-properties"，
        "@babel/plugin-transform-runtime",
        "@babel/plugin-syntax-dynamic-import"
    ]
}

``````
3. 将jQuery模块进行动态导入
``````javascript
<!--import('jquery')返回的就是一个promise对象-->

function getComponent() {

    return import('jquery').then(({default: $}) => {
        return $('<div></div>').html('main')
    })
}


``````

4. 给页面某个元素添加事件，动态调用getComponent方法创建元素

``````javascript

window.onload = function() {
    document.getElementById('bth').onclick = function() {
        getComponent().then(item => {
            item.appendTo('body')
        })
    }
}

``````

###### 3.4 splitChunksPlugin配置
Webpack4之后，使用`SplitChunsPlugin`插件代替了以前的`CommonsChunkPlugin`，而`SplitChunsPlugin`的配置只需要在webpack配置文件中的`optimization`节点下的`splitChunks`进行修改即可，如果没有任何的修改，则会使用默认配置

默认的`SplitChunksPlugin`配置适用于绝大多数用户

webpack会基于默认配置自动分隔代码：

* 公共代码块来自node_modules文件夹的组件模块
* 打包的代码块大小超过30K（最小化压缩之前）
* 按需加载代码块时，同时发送的请求数量不应该超过5
* 页面初始化，同时发送的请求最大数量不应该超过3


以下是SplitChunksPlugin的默认配置
``````javascript
module.exports = {
    optimization: {
        splitChunks: {
              chunks: 'async', // async 只对异步加载的模块进行分割， all 对所有的模块分割   initial-
              minSize: 30000, // 模块最小大于30kb才进行分割
              maxSize: 0, // 模块大小无限制，只要大于30Kb都拆分
              minChunks: 1,  //模块至少引用一次才拆分
              maxAsyncRequests: 5, // 异步加载时同时发送的请求数量最大不能超过5，超过5的部分就不会再拆分
              maxInitialRequests: 3, // 页面初始化同时发送的请求数量最大不能超过3，超过3的的部分不会再拆分
              automaticNameDelimiter: '~', //默认的连接符
              automaticNameMaxLength: 30,
              name: true, // 拆分的chunk名，true则表示根据模块名和cacheGroup的key来自动生成chunk名
              cacheGroups: { // 缓存组配置，上面配置读取完成后进行拆分，如果需要把多个模块拆分到一个文件，就需要缓存，所以命名为缓存组
                vendors: {  //自定义缓存组名
                  test: /[\\/]node_modules[\\/]/, // 检查node_modules目录，只要模块在该目录下就是用上面配置拆分这个组
                  priority: -10 // 权重-10，决定哪个组优先配置，
                },
                default: { // 默认缓存组名
                  minChunks: 2, // 至少引用两次才会被拆分
                  priority: -20, // 权重-20
                  reuseExistingChunk: true //如果主入口引入了两个模块，其中一个正好引用了后一个，就会直接复用，无需引用两次
                }
          }
    }
  }
}
``````


#### 4.noParse

在引入一些第三方模块的时候，例如jQuery，bootstrap，我们知道其内部肯定不会依赖其他模块，因为我们最终用到的只是一个单独的js文件或css文件

所以此时如果webpack再去解析她们的内部依赖关系，其实是非常浪费时间的，我们需要组织webpack浪费精力去解析这些明知道没有依赖的库


可以在webpack配置文件module节点下加上`noParse`，并配置正则来确定不需要解析依赖关系的模块

``````javascript

module: {
    noParse: /jquery|bootstrap/
}

``````
#### IgnorePlugin

在引入一些第三方模块的时候，例如moment，内部会做i8n国际化处理，里面会包含很多的语言包，而语言包打包时候会很占用空间，如果我们项目只需要中文，或者少数语言，可以忽略掉所有的语言包，然后按需引入语言包，从而提高构建性能

需要忽略第三方模块内部依赖的其他模块，只需要三步：
1. 首先找到moment以来的语言包是什么
2. 使用ignorePlugin插件忽略掉依赖
3. 需要某些依赖的时候自动手动引入


1. 安装moment
```js
npm i moment
```
2. webpack.config.js 的plugins处添加配置

```js
let webpack = require('webpack');
plugins: [
  // 忽略解析三方包里插件
  new webpack.IgnorePlugin(/\.\/locale/, /moment/)
]
```

3. index.js代码片段

```js
//
import moment from 'moment'
// 引入中文
import 'moment/locale/zh-cn'
// 设置中文
moment.locale('zh-cn');
let momentStr = moment().subtract(10, 'days').calendar();
console.log('现在时间：', momentStr);
```
