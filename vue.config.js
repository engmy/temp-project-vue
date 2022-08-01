const path = require('path')

module.exports = {
    lintOnSave: false,
    productionSourceMap: false,
    transpileDependencies:['element-ui'],
    chainWebpack(config) {
        config.plugin('html')
            .tap(args => {
                args[0].title= '前台模板'
                return args
            })
        config.module
            .rule('svg')
            .exclude.add(path.resolve(__dirname, './src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(path.resolve(__dirname, './src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]',
            })
            .end()
    },
    devServer: {
        port: 9999,
        host: "localhost",
        https: false,
        open: true,
        proxy: {
            '/api': {
                target: process.env.VUE_APP_BASE_API,
                changOrigin: true
            }
        }
    }
}
