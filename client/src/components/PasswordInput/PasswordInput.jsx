import { useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const PasswordInput = ({ onChange }) => {
	const [passwordVisible, setPasswordVisible] = useState(false);

	const togglePasswordVisibility = () => {
		setPasswordVisible((prevState) => !prevState);
	};

	return (
		<div className='relative'>
			<input
				type={passwordVisible ? 'text' : 'password'}
				placeholder='Password'
				name='password'
				className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
				onChange={onChange}
			/>
			<span
				className='absolute inset-y-0 right-3 flex items-center cursor-pointer'
				onClick={togglePasswordVisibility}>
				{passwordVisible ? (
					<AiFillEyeInvisible size={24} className='text-myBlue' />
				) : (
					<AiFillEye size={24} className='text-myBlue' />
				)}
			</span>
		</div>
	);
};

export default PasswordInput;
