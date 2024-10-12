import ProfileCard from '../Profile/ProfileCard';
import SearchBar from '../SearchBar/SearchBar';
import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useLocation } from 'react-router-dom';
import Theme from '../Theme/Theme';
import { baseUrl } from '@/utils/constants';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

import { FaRegCopy } from 'react-icons/fa6';
import { CiCircleCheck } from 'react-icons/ci';

const NavBar = ({ userInfo, onSearch }) => {
	let location = useLocation();

	const [searchQuery, setSearchQuery] = useState('');
	const [checkLs, setCheckLs] = useState(false);

	const [working, setWorking] = useState(false);
	const [copied, setCopied] = useState(false);

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

	const getBEServerStatus = async () => {
		try {
			let { data } = await axiosInstance.get(`${baseUrl}/status`);

			setWorking(data);
		} catch (error) {
			console.log(error);
		}
	};

	const copyToClipBoard = () => {
		navigator.clipboard.writeText(`${baseUrl}/status`);

		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, 1500);
	};

	useEffect(() => {
		if (localStorage.getItem('token')) {
			setCheckLs(true);
		}

		getBEServerStatus();
	}, []);

	return (
		<div className='px-6 md:px-10 py-4 shadow-md flex items-center justify-between dark:bg-slate-800 dark:shadow-lg'>
			<h2 className='text-2xl hidden md:block dark:text-white'>Notes</h2>

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

			<div className='flex items-center gap-4 pl-2'>
				<Popover>
					<PopoverTrigger>
						<div
							className={`w-[20px] h-[20px] rounded-full ${
								working ? 'bg-green-500' : 'bg-red-500'
							}`}></div>
					</PopoverTrigger>
					<PopoverContent>
						<div className='flex items-center gap-4'>
							<h2>{baseUrl}</h2>
							{copied ? (
								<CiCircleCheck size={30} />
							) : (
								<FaRegCopy
									cursor={'pointer'}
									onClick={copyToClipBoard}
								/>
							)}
						</div>
					</PopoverContent>
				</Popover>

				<Theme />

				<ProfileCard userInfo={userInfo} />
			</div>
		</div>
	);
};

export default NavBar;
