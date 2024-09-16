import { useNavigate } from 'react-router-dom';
import ProfileCard from '../Profile/ProfileCard';
import SearchBar from '../SearchBar/SearchBar';
import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useLocation } from 'react-router-dom';

const NavBar = ({ userInfo, onSearch }) => {
	let location = useLocation();

	const [searchQuery, setSearchQuery] = useState('');
	const [checkLs, setCheckLs] = useState(false);

	const navigate = useNavigate();

	const handleSearch = async () => {
		if (searchQuery.trim() === '') {
			return;
		}

		try {
			const { data } = await axiosInstance.get('/searchNotes', {
				params: { query: searchQuery },
			});
			onSearch(data.notes);
		} catch (error) {
			console.log(error);
		}
	};

	const onClearSearch = () => {
		setSearchQuery('');
		onSearch(null);
	};

	useEffect(() => {
		if (localStorage.getItem('token')) {
			setCheckLs(true);
		}
	}, []);

	return (
		<div className='px-6 md:px-10 py-4 shadow-md flex items-center justify-between'>
			<h2 className='text-2xl hidden md:block'>Notes</h2>

			{location.pathname === '/dashboard' && (
				<>
					{checkLs && (
						<SearchBar
							value={searchQuery}
							onChange={({ target }) => {
								setSearchQuery(target.value);
							}}
							handleSearch={handleSearch}
							onClearSearch={onClearSearch}
						/>
					)}
				</>
			)}

			<ProfileCard userInfo={userInfo} />
		</div>
	);
};

export default NavBar;
