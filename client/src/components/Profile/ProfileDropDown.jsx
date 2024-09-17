import { getInitials } from '@/utils/helper';
import { Link, useNavigate } from 'react-router-dom';

import { TbLayoutDashboard } from 'react-icons/tb';
import { CgProfile } from 'react-icons/cg';
import { RiLogoutBoxRLine } from 'react-icons/ri';

const ProfileDropDown = ({ userInfo }) => {
	const navigate = useNavigate();

	const onLogout = () => {
		localStorage.clear();
		navigate('/login');
	};

	return (
		<div>
			<div className='flex flex-col gap-1'>
				<div className='flex items-center gap-4 mb-2'>
					<h1 className='border border-slate-300 bg-slate-100 w-[30px] h-[30px] center rounded-full hidden md:flex dark:text-black'>
						{getInitials(userInfo?.fullName)}
					</h1>
					<div>
						<div className=' text-xs'>
							{userInfo?.fullName.split(' ')[0]}
						</div>
						<div className=' text-xs'>{userInfo?.email}</div>
					</div>
				</div>
				<hr />

				<Link
					className='hover:bg-slate-100 px-2 py-1 rounded-md mt-1 flex items-center gap-4 dark:hover:text-black'
					to={`/dashboard`}>
					<TbLayoutDashboard /> <h2>Dashboard</h2>
				</Link>

				<Link
					className='hover:bg-slate-100 px-2 py-1 rounded-md mt-1 flex items-center gap-4 dark:hover:text-black'
					to={`/dashboard/profile`}>
					<CgProfile />
					<h2>Profile</h2>
				</Link>

				<div
					onClick={onLogout}
					className='hover:bg-slate-100 px-2 py-1 rounded-md flex items-center gap-4 dark:hover:text-black'>
					<RiLogoutBoxRLine className=' rotate-180' />
					<h2>Log Out</h2>
				</div>
			</div>
		</div>
	);
};

export default ProfileDropDown;
