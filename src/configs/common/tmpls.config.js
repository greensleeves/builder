module.exports = {
    name: 'tmpls',
    subTasks: [

        {
            name: 'index',
            dest: {
                dev: '/dest'
            },
            src: {
                include: [
                    // './src/pages/data/index.js'
                    './src/pages/data/index.html'
                ]
            },
            plugins: [
                // { name: "gulp-rgcsspack" },
                // {
                //     name: "gulp-rgswig",
                //     options: {
                //         param: {
                //             compileType: "data"
                //         }
                //     }
                // }
            ]
        },

        {
            name: 'article',
            dest: {
                dev: '/dest'
            },
            src: {
                include: [
                    './src/pages/data/article.html'
                ]
            },
            plugins: [
                // { name: "gulp-rgcsspack" },
                // {
                //     name: "gulp-rgswig",
                //     options: {
                //         param: {
                //             "compileType": "data"
                //         }
                //     }
                // },
                // {
                //   name: "gulp-minify-html",
                //   options: {
                //     conditionals: true,
                //     comments: true,
                //     quotes: true
                //   }
                // }
            ]
        }

    ]
}