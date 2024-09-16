import { useState, useEffect, useCallback } from 'react';

const useScrollTracker = () => {
	const [pageHeight, setPageHeight] = useState(0);
	const [scrollPercentage, setScrollPercentage] = useState(0);

	const calculateScrollDetails = useCallback(() => {
		const totalHeight = document.documentElement.scrollHeight;
		const viewPortHeight = window.innerHeight;
		const scrolled = window.scrollY || window.pageYOffset;

		const scrollableHeight = totalHeight - viewPortHeight;

		const scrolledPercentage = Math.floor(
			(scrolled / scrollableHeight) * 100,
		);

		setPageHeight(totalHeight);
		setScrollPercentage(scrolledPercentage);
	}, []);

	useEffect(() => {
		// Calculate the scroll details on component mount
		calculateScrollDetails();

		// Add scroll event listener
		window.addEventListener('scroll', calculateScrollDetails);

		// Cleanup scroll event listener on component unmount
		return () => {
			window.removeEventListener('scroll', calculateScrollDetails);
		};
	}, [calculateScrollDetails]);

	return { pageHeight, scrollPercentage };
};

export default useScrollTracker;
