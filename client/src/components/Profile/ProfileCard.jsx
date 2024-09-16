import { getInitials } from '../../utils/helper';
import { CiLogout } from 'react-icons/ci';

const ProfileCard = ({ onLogout, userInfo }) => {
	if (!userInfo) return;
	return (
		<div>
			<div className='flex items-center gap-1 md:gap-4'>
				<h1 className='border border-slate-300 bg-slate-100 w-[50px] h-[50px] center rounded-full hidden md:flex'>
					{getInitials(userInfo?.fullName)}
				</h1>
				<div>
					<p className=' capitalize font-semibold hidden md:block'>
						{userInfo?.fullName}
					</p>
					<button
						onClick={onLogout}
						className='flex items-center gap-2 bg-slate-100 px-3 rounded-full py-1'>
						<CiLogout />
						<h2>Log out</h2>
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProfileCard;
