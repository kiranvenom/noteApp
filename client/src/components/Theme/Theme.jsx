import { useContext, useEffect } from 'react';
import { CiLight, CiDark } from 'react-icons/ci';
import { ThemeContext } from '@/App';

const Theme = () => {
	const [theme, setTheme] = useContext(ThemeContext);

	const toggleTheme = () => {
		setTheme(theme === 'light' ? 'dark' : 'light');
	};

	useEffect(() => {
		if (theme === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, [theme]);

	return (
		<div className='flex justify-center items-center'>
			{theme === 'light' ? (
				<CiLight
					onClick={toggleTheme}
					size={30}
					className='cursor-pointer text-yellow-500'
				/>
			) : (
				<CiDark
					onClick={toggleTheme}
					size={30}
					className='cursor-pointer text-gray-500 dark:text-white'
				/>
			)}
		</div>
	);
};

export default Theme;
