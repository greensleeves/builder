/**
 * Метаинформация общая для всех страниц
 *
 */

module.exports = function(data) {

	return {

		opt: {

			blocks: [

				{
					opt: {
						tag: "meta",
						attrs: {
							charset: "utf-8"
						}
					}
				},
				{
					opt: {
						tag: "meta",
						attrs: {
							property: "og:site_name",
							content: "Российская газета"
						}
					}
				},
				{
					opt: {
						tag: "meta",
						attrs: {
							name: "viewport",
							content: "width=device-width, initial-scale=1, maximum-scale=2.0"
						}
					}
				}

			]
		}
	}
};
