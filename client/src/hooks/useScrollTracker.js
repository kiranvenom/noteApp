import { useState, useEffect } from 'react';

const useScrollTracker = () => {
	const [pageHeight, setPageHeight] = useState(0);
	const [scrollPercentage, setScrollPercentage] = useState(0);

	useEffect(() => {
		// Function to calculate scroll percentage
		const calculateScrollDetails = () => {
			const totalHeight = document.documentElement.scrollHeight;
			const viewPortHeight = window.innerHeight;
			const scrolled = window.scrollY || window.pageYOffset;

			// Calculate scrollable height (totalHeight - viewport height)
			const scrollableHeight = totalHeight - viewPortHeight;

			// Calculate scroll percentage
			const scrolledPercentage = Math.floor(
				(scrolled / scrollableHeight) * 100,
			);

			setPageHeight(totalHeight);
			setScrollPercentage(scrolledPercentage);
		};

		// Calculate initial values
		calculateScrollDetails();

		// Set up event listener for scroll
		window.addEventListener('scroll', calculateScrollDetails);

		// Cleanup event listener on unmount
		return () => {
			window.removeEventListener('scroll', calculateScrollDetails);
		};
	}, []);

	return { pageHeight, scrollPercentage };
};

export default useScrollTracker;
