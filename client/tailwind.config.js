/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				myBlue: '#4F46E5',
			},
		},
	},
	plugins: [],
};
