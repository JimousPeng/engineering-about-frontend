const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
/**
 * 1. 当用CleanWebpackPlugin清空输出目录时，需要配置output.path路径，否则无法删除输出目录。
 * 2. 不使用CleanWebpackPlugin插件时，配置output.clean = true, 也可以清空目录
 */
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TemplateWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, './src/index.js'),
    output: {
        filename: '[name]_[chunkhash].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    devServer: {
        static: path.resolve(__dirname, 'dist'),
    },
    module: {
        /**
         * loader的处理从右往左执行,结合exclude缩小打包域
         * 如果loader要使用参数，那么不能使用use方式引入
         */
        rules: [
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: 'vue-loader',
            },
            {
                /**
                 * sass-loader: 将 Sass 编译成 CSS；需要额外安装sass,node-sass包
                 * css-loader：css -> js资源，处理了CSS的各种加载语法，import,url()函数等(内部使用了postcss插件)
                 * style-loader: css的js对象 -> 插入js文件中，js执行后生成style标签并插入html
                 * MiniCssExtractPlugin.loader：将css文件分离，不能与style-loader共用
                 */
                test: /\.(s[ac]|c)ss$/i,
                exclude: /node_modules/,
                // use: ['style-loader', 'css-loader'],
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                /**
                 * file-loader：resolves import/require() on a file into a url and emits the file into the output directory
                 * 处理图片资源，处理文件引用，通过loader-API的emitFile执行写文件操作；
                 *
                 * url-loader：works like file-loader, but can return a DataURL if the file is smaller than a byte limit.
                 * 文件处理跟file-loader类似，不过增加了limit配置，支持将小于配置资源的file转成dataURL的形式,base64编码格式，单位byte
                 */
                test: /\.(gif|png|jpg)$/,
                exclude: /node_modules/,
                // loader: 'file-loader',
                loader: 'url-loader',
                options: {
                    name: '[name]_[hash].[ext]?[path]',
                    outputPath: 'images',
                    limit: 450 * 1024,
                },
            },
        ],
    },
    plugins: [
        // new CleanWebpackPlugin(),
        new VueLoaderPlugin(),
        new TemplateWebpackPlugin({
            template: path.resolve(__dirname, './static/index.html'),
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name]_[chunkhash].css',
        }),
    ],
    devtool: 'source-map',
    mode: 'development',
};