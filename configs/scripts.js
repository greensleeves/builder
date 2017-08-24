module.exports = {
    name: 'script',
    subTasks: [

        {
            name: 'index',
            dest: {
                dev: '/dest'
            },
            src: {
                include: [
                    './src/scripts/index.js',
                    './src/scripts/popup.js'
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
};