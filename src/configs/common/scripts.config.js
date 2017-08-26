module.exports = {
    name: 'scripts',
    subTasks: [

        {
            name: 'index',
            dest: {
                dev: '/dest/scripts'
            },
            src: {
                include: [
                    './src/scripts/index.js'
                ]
            },
            plugins: [
                { name: 'vinyl-named' },
                {
                    name: 'webpack-stream',
                    options: webpackConfig
                }
            ]
        },

        {
            name: 'article',
            dest: {
                dev: '/dest/scripts'
            },
            src: {
                include: [
                    './src/scripts/article.js'
                ]
            },
            plugins: [
                { name: 'vinyl-named' },
                {
                    name: 'webpack-stream',
                    options: webpackConfig
                }
            ]
        }

    ]
}