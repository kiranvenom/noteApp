import NavBar from '@/components/NavBar/NavBar';
import axiosInstance from '@/utils/axiosInstance';
import { useEffect, useState } from 'react';

const Profile = () => {
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
			<div className='maxW'>ds</div>
		</div>
	);
};

export default Profile;
