import { getInitials } from '@/utils/helper';
import { Link, useNavigate } from 'react-router-dom';

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
					<h1 className='border border-slate-300 bg-slate-100 w-[30px] h-[30px] center rounded-full hidden md:flex'>
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
					className='hover:bg-slate-100 px-2 py-1 rounded-md mt-1'
					to={`/dashboard`}>
					Dashboard
				</Link>

				<Link
					className='hover:bg-slate-100 px-2 py-1 rounded-md mt-1'
					to={`/dashboard/profile`}>
					Profile
				</Link>

				<div
					onClick={onLogout}
					className='hover:bg-slate-100 px-2 py-1 rounded-md'>
					Log Out
				</div>
			</div>
		</div>
	);
};

export default ProfileDropDown;
