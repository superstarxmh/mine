// 基础路径 注意发布之前要先修改这里
const webpack = require('webpack');
let path = require("path");

const BASE_API = process.env.VUE_APP_BASE_API || '';
const PROXY_TARGET= process.env.VUE_APP_PROXY_TARGET || '';

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
    publicPath: './', // 根据你的实际情况更改这里
    lintOnSave: true,
    productionSourceMap: false,
    // configureWebpack: config => {
    //     if (process.env.NODE_ENV === 'production') {
    //         return {
    //             plugins: [
    //                 new BundleAnalyzerPlugin()
    //             ]
    //         }
    //     }
    // },
    devServer: {
        open: true,
        host: "0.0.0.0",
        port: 8080,
        contentBase: path.resolve(__dirname, "public"),
        https: false,
        hotOnly: false,
        proxy: {
            [`/${BASE_API}`]: {
                // target: "http://192.168.8.17:8383",
                target: PROXY_TARGET,
                ws: false,
                pathRewrite: {[`^/${BASE_API}`]: ""},
                changeOrigin: true
            }
        }
    },
    configureWebpack:{
       /* resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                'jquery': 'jquery',
                'jquery-ui': 'jquery-ui'
            }
        },*/
    },
    css: {
        loaderOptions: {
            sass: {
                // data: `@import "@/styles/variables.scss";`,

            }
        }
    }
};
