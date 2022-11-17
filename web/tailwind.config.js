/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			textColor: {
				primary: "#1A202C",
				secondary: "#4A5568",
			},
			borderColor: {
				lightgray: "#E8E8E8",
			},
			backgroundColor: {
				"button-primary": "#04C45C",
				"button-primary-hovered": "#06a14e",

				"button-secondary": "#0497c4",
				"button-secondary-hovered": "#048ab3",
			},
		},
	},
	plugins: [],
};
