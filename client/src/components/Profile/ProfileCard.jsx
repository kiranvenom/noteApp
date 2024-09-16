import { getInitials } from '../../utils/helper';
import { CiLogout } from 'react-icons/ci';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import ProfileDropDown from './ProfileDropDown';

const ProfileCard = ({ userInfo }) => {
	if (!userInfo) return;
	return (
		<div>
			<div className='flex items-center gap-1 md:gap-4'>
				<Popover>
					<PopoverTrigger>
						<h1 className='border border-slate-300 bg-slate-100 w-[50px] h-[50px] center rounded-full hidden md:flex'>
							{getInitials(userInfo?.fullName)}
						</h1>
					</PopoverTrigger>
					<PopoverContent>
						<ProfileDropDown userInfo={userInfo} />
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
};

export default ProfileCard;
