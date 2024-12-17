/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{html,ts,css,scss}",
		"./node_modules/primeng/**/*.{js,ts,css,scss}",
		"./node_modules/tailwindcss-primeui/**/*.{js,ts,css,scss}",
	],
	theme: {
		extend: {},
	},
	plugins: [require("tailwindcss-primeui")],
};
