module.exports = {
    name: 'tmpl',
    subTasks: [

        {
            name: 'index',
            dest: {
                dev: '/dest'
            },
            src: {
                include: [
                    './src/pages/index.html'
                ]
            }
        },

        {
            name: 'article',
            dest: {
                dev: '/dest'
            },
            src: {
                include: [
                    './src/pages/article.html'
                ]
            }
        }

    ]
}