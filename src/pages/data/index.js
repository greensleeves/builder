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

				// RG.R({
				// 	type: 'script',
				// 	src: 'index'
				// })

			]
		},

		upper: {},

		sidebarLeft: {},

		main: {},

		sidebarRight: {}, // правый сайдбар

		footer: {

			blocks: [

				// RGInclude('index', 'styles')

			]

    	},

		/*
		 * Метаинформация
		 *
		 */

		_meta: {
			uri: "index"
		}
	}

};
