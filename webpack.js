// 全局搭建 npm i webapck webpack-cli -g (安装的webpack 是最近的版本)不推荐
// npm unintall webapack webpack-cli -g  卸载

// 局部 npm init

// npx  webpack

// 配置
const path = require('path')
module.exports = {
    entry: './index.js',
    output: {
        filename: 'enterprise.js',
        path: path.resolve(__dirname, 'enterprise')
    }
}