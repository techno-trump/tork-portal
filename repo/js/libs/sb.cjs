
module.exports = {
	sayHiToCommonJs: async (esModulesMsg) => {
		console.log(`Common JS is speaking with him self, 
			seying to his inside nature ES Modules:
			'ES modules laghing at me, importing me and saying: ${esModulesMsg}.`);
		return "Fuck you ES Modules!";
	},
}