import NavBar from '@/components/NavBar/NavBar';
import axiosInstance from '@/utils/axiosInstance';
import { useEffect, useState } from 'react';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import useScrollTracker from '@/hooks/useScrollTracker';
import moment from 'moment';

const Profile = () => {
	const { scrollPercentage } = useScrollTracker();

	const [userInfo, setUserInfo] = useState('');

	const getUserInfo = async () => {
		try {
			const { data } = await axiosInstance.get('/getUser');
			if (data && data.user) {
				setUserInfo(data.user);
			}
		} catch (error) {
			if (error.response.status === 401) {
				localStorage.clear();
				navigate('/login');
			}
		}
	};

	useEffect(() => {
		getUserInfo();
	}, []);

	return (
		<div>
			<NavBar userInfo={userInfo} />
			<div className='maxW flex'>
				<div className='w-[70%]'>
					<div>
						<h1 className='my-10 font-extrabold text-6xl'>
							Account Settings
						</h1>

						{/* Users Details */}
						<div className='bb p-4 w-[60%]'>
							<h2 className='text-xl'>Profile</h2>
							<div className='flex items-start justify-between mt-10'>
								<h2>Full Name</h2>
								<input
									type='text'
									className='bb px-2'
									value={userInfo.fullName}
								/>
							</div>
							<div className='flex items-start justify-between mt-4'>
								<h2>Email</h2>
								<input
									type='text'
									className='bb px-2'
									value={userInfo.email}
								/>
							</div>

							<div className='flex items-center justify-end mt-8'>
								<button className='bg-slate-200 px-4 py-1 rounded-md'>
									Save
								</button>
							</div>
						</div>

						{/* no of notes */}
						<div className='bb p-4 w-[60%] mt-4'>
							<h2 className='text-xl'>#Number Note(s)</h2>

							<h1 className='font-bold text-6xl mt-10'>
								{userInfo.notesCount}
							</h1>
						</div>

						{/* Created On */}
						<div className='bb p-4 w-[60%] mt-4'>
							<h2 className='text-xl'>Created On</h2>

							<h1 className='font-bold text-4xl mt-10'>
								{moment(userInfo.createdOn).format(
									'Do MM YYYY',
								)}
							</h1>
						</div>

						{/* theme */}
						<div className='bb p-4 w-[60%] mt-4'>
							<h2 className='text-xl'>Themes</h2>

							<div className='flex items-start justify-between mt-10'>
								<div>
									<h2>Theme Preference</h2>
									<p className=' text-xs'>
										Choose the theme that works best for
										you.
									</p>
								</div>
								<Select>
									<SelectTrigger className='w-[180px]'>
										<SelectValue placeholder='Theme' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='light'>
											Light
										</SelectItem>
										<SelectItem value='dark'>
											Dark
										</SelectItem>
										<SelectItem value='system'>
											System
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className='flex items-center justify-end mt-8'>
								<button className='bg-slate-200 px-4 py-1 rounded-md'>
									Save
								</button>
							</div>
						</div>

						{/* Security */}
						<div className='bb p-4 w-[60%] mt-4'>
							<h2 className='text-xl'>Security</h2>
							<div className='flex items-start justify-between mt-10'>
								<h2>Password</h2>
								<input
									type='text'
									className='bb px-2'
									placeholder='change password'
								/>
							</div>

							<div className='flex items-center justify-end mt-8'>
								<button className='bg-slate-200 px-4 py-1 rounded-md'>
									Save
								</button>
							</div>
						</div>

						{/* Delete Account */}
						<div className='bb p-4 w-[60%] mt-4 mb-16'>
							<h2 className='text-xl'>Delete Account</h2>

							<div className='flex items-center justify-start mt-8'>
								<button className='bg-red-500 text-white px-4 py-1 rounded-md'>
									Delete Account
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className='w-[30%] mt-8 h-full sticky top-8'>
					<div>
						<ul className='border-l border-l-slate-400 pl-4'>
							<li className='my-3'>Profile</li>
							<li className='my-3'>Number Note(s)</li>
							<li className='my-3'>Created On</li>
							<li className='my-3'>Themes</li>
							<li className='my-3'>Security</li>
							<li className='my-3'>Delete Account</li>
						</ul>
						<div
							style={{
								top: `${Math.min(
									Math.max(scrollPercentage, 5),
									85,
								)}%`,
							}}
							className={`w-[4px] h-[25px] bg-black absolute -left-[0.3%]`}></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
