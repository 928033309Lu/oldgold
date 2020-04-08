const path = require('path');
const os = require('os');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HappyPack = require('happypack');
var happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

// The path to the Cesium source code
const cesiumSource = '../node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';
const cesiumThirdParty = '../Build/Cesium/ThirdParty';

function resolve (dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    entry: {
        main: '@/main',
        'vender-base': '@/vendors/vendors.base.js',
        'vender-exten': '@/vendors/vendors.exten.js'
    },
    output: {
        path: path.resolve(__dirname, '../dist/dist'),
        // Needed to compile multiline strings in Cesium
        sourcePrefix: ''
    },
    amd: {
        // Enable webpack-friendly use of require in Cesium
        toUrlUndefined: true
    },
    node: {
        // Resolve node module use of fs
        fs: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        css: 'vue-style-loader!css-loader',
                        less: 'vue-style-loader!css-loader!less-loader'
                    },
                    postLoaders: {
                        html: 'babel-loader'
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'happypack/loader?id=happybabel',
                include: [
                    path.resolve(__dirname, '../src'),
                    path.resolve(__dirname, '../node_modules/swiper'),
                    path.resolve(__dirname, '../node_modules/dom7'),
                    path.resolve(__dirname, '../node_modules/element-ui'),
                    path.resolve(__dirname, '../static/VTKloader'),
                    path.resolve(__dirname, '../static/thirdParty')
                ]
            },
            {
                test: /\.js[x]?$/,
                include: [resolve('src')],
                exclude: /node_modules/,
                loader: 'happypack/loader?id=happybabel'
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader?minimize', 'autoprefixer-loader'],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader?minimize','autoprefixer-loader', 'less-loader'],
                    fallback: 'style-loader'
                }),
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=1024'
            },
            {
                test: /\.(html|tpl)$/,
                loader: 'html-loader'
            }
        ]
    },
    plugins: [
        new HappyPack({
            id: 'happybabel',
            loaders: [{
                    loader: 'babel-loader',
                    query: {
                        compact: [ false ]
                    }
                }],
            threadPool: happyThreadPool,
            verbose: true
        }),
        // Copy Cesium Assets, Widgets, and Workers to a static directory
        new CopyWebpackPlugin([ { from: path.resolve(__dirname, cesiumSource, cesiumWorkers), to: 'Workers' } ]),
        new CopyWebpackPlugin([ { from: path.resolve(__dirname, cesiumSource, cesiumThirdParty), to: 'ThirdParty' } ]),
        new CopyWebpackPlugin([ { from: path.resolve(__dirname, cesiumSource, 'Assets'), to: 'Assets' } ]),
        new CopyWebpackPlugin([ { from: path.resolve(__dirname, cesiumSource, 'Widgets'), to: 'Widgets' } ]),
    ],
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue': 'vue/dist/vue.esm.js',
            '@': resolve('../src'),
            // Cesium module name
            'cesium': path.resolve(__dirname, cesiumSource)
        }
    }
};
