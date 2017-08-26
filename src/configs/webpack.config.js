/**
 * Модули
 */
const
    webpack = require('webpack'),
    path = require('path'),
    flowtypePlugin = require('flowtype-loader/plugin');

module.exports = {

    output: {
        publicPath: path.join(path.resolve(__dirname, '../..'), 'dest/scripts/'),
        filename: '[name].js',
        chunkFilename: '[hash].js',
    },

    module: {

        rules: [

            // Связка прелоадеров, сначала flow, потом eslint
            {
                test: /\.js$/,
                exclude: /node_modules/,
                enforce: 'pre',
                use: [
                    'flowtype-loader',
                    'eslint-loader'
                ]
            },

            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader'
                }
            },

            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },

            {
                test: /\.sass$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },

            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader'
                }
            }

        ]

    },

    plugins: [

        // Пладин для компиляции flow
        new flowtypePlugin(),

        // Устанавливаем переменную окружения
        // Будет доступна и в js файлах
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })

    ],

    // Включаю вотчер файлов watch: true
    watch: true,

    // Настройки вотчера файлов
    watchOptions: {

        // Задержка перед тем, как пересобрать файлы
        // По-умолчанию 300ms
        aggregateTimeout: 100
    },

    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    }

};