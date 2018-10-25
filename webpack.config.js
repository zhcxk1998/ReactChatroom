const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
// const CompressionPlugin = require("compression-webpack-plugin");
// const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        bundle: './src/App.js',
        vendor: ['antd'],
    }, //相对路径
    output: {
        path: path.resolve(__dirname, 'build'), //打包文件的输出路径
        filename: 'bundle.[hash:8].js' //打包文件名
    },
    plugins: [
        new CleanWebpackPlugin(['build']),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.[hash:8].js'
        }),
        new UglifyJsPlugin({
            parallel: 4,
            uglifyOptions: {
                output: {
                    comments: false,
                    beautify: false,
                },
                compress: {
                    warnings: false,
                    // drop_console: true,
                    collapse_vars: true,
                    reduce_vars: true,

                },

            },
            cache: true,
        }),
        // new CompressionPlugin({
        //     asset: '[path].gz[query]', //目标资源名称。[file] 会被替换成原资源。[path] 会被替换成原资源路径，[query] 替换成原查询字符串
        //     algorithm: 'gzip',//算法
        //     test: new RegExp(
        //         '\\.(js|css)$'    //压缩 js 与 css
        //     ),
        //     threshold: 10240,//只处理比这个值大的资源。按字节计算
        //     minRatio: 0.8//只有压缩率比这个值小的资源才会被处理
        // }),

        // new ExtractTextPlugin("style.css"),
        new HtmlWebpackPlugin({
            template: './public/index.html', //指定模板路径
            filename: 'index.html', //指定文件名
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
            chunksSortMode: 'dependency'
        }),
    ],
    module: {
        loaders: [ //配置加载器
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',

                // use: ExtractTextPlugin.extract({
                //     fallback: "style-loader",
                //     use: [
                //         {
                //             loader: 'css-loader',
                //             options: {
                //                 minimize: true //css压缩
                //             }
                //         }
                //     ]
                // }),


            },
            {
                test: [/\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/, /\.ico$/],
                loader: 'url-loader',
                options: {
                    limit: 100, //xxx字节以下大小的图片会自动转成base64
                },
            },
            {
                test: /\.js$/, //配置要处理的文件格式，一般使用正则表达式匹配
                loader: 'babel-loader', //使用的加载器名称
                query: { //babel的配置参数，可以写在.babelrc文件里也可以写在这里
                    presets: ['env', 'react', 'stage-1'],
                }
            },
        ]
    },

    devServer: {
        contentBase: './build', //默认webpack-dev-server会为根文件夹提供本地服务器，如果想为另外一个目录下的文件提供本地服务器，应该在这里设置其所在目录（本例设置到"build"目录）
        historyApiFallback: true, //在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
        inline: true, //设置为true，当源文件改变时会自动刷新页面
        port: 8080, //设置默认监听端口，如果省略，默认为"8080"
    },
};