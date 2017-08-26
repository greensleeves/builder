module.exports = {

    toMerge: {

        meta: {

            blocks: [

                {
                    opt: {
                        tag: "title",
                        contents: [
                            {
                                data: "Российская газета"
                            }
                        ]
                    }
                },
                {
                    opt: {
                        tag: "meta",
                        attrs: {
                            name: "description",
                            content: "Российская газета - издание Правительства Российской Федерации, официальный публикатор документов"
                        }
                    }
                }

            ]

        },

        head: {

            blocks: [

                RGInclude('article', 'scripts')

            ]
        },

        upper: {},

        sidebarLeft: {},

        main: {},

        sidebarRight: {}, // правый сайдбар

        footer: {

            blocks: [

                RGInclude('article', 'styles')

            ]

        },

        /*
         * Метаинформация
         *
         */

        _meta: {
            uri: "article"
        }
    }

};
