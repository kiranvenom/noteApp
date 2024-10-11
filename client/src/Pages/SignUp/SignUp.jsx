import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import PasswordInput from '../../components/PasswordInput/PasswordInput';
import { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';

const SignUp = () => {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		fullName: '',
		email: '',
		password: '',
	});
	const [errors, setErrors] = useState({
		fullName: '',
		email: '',
		password: '',
	});

	// Validation functions
	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const validatePassword = (password) => password.length >= 6;

	const onChangeFormUpdate = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));

		// Real-time validation
		if (name === 'email' && !validateEmail(value)) {
			setErrors((prevErrors) => ({
				...prevErrors,
				email: 'Invalid email address',
			}));
		} else if (name === 'email') {
			setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
		}

		if (name === 'password' && !validatePassword(value)) {
			setErrors((prevErrors) => ({
				...prevErrors,
				password: 'Password must be at least 6 characters',
			}));
		} else if (name === 'password') {
			setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const emailValid = validateEmail(formData.email);
		const passwordValid = validatePassword(formData.password);

		if (!emailValid || !passwordValid) {
			setErrors({
				email: emailValid ? '' : 'Invalid email address',
				password: passwordValid
					? ''
					: 'Password must be at least 6 characters',
			});
			return;
		}

		try {
			const response = await axiosInstance.post('/createAccount', {
				fullName: formData.fullName,
				email: formData.email,
				password: formData.password,
			});

			if (response.data && response.data.assessToken) {
				localStorage.setItem('token', response.data.assessToken);
				navigate('/login');
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<NavBar />

			<div className='flex justify-center items-center h-[90vh] bg-gray-100'>
				<div className='mx-4 md:mx-0 w-full max-w-sm p-6 bg-white rounded-lg shadow-md'>
					<h4 className='text-3xl font-semibold text-center mb-6 text-gray-800'>
						Sign Up
					</h4>

					<form className='space-y-4' onSubmit={handleSubmit}>
						{/* Name Field */}
						<div>
							<input
								type='text'
								placeholder='Name'
								name='fullName'
								value={formData.fullName}
								className={`w-full px-4 py-2 border ${
									errors.name
										? 'border-red-500'
										: 'border-gray-300'
								} rounded-lg focus:outline-none focus:ring-2 ${
									errors.name
										? 'focus:ring-red-500'
										: 'focus:ring-indigo-500'
								}`}
								onChange={onChangeFormUpdate}
							/>
							{errors.name && (
								<p className='text-red-500 text-sm mt-1'>
									{errors.name}
								</p>
							)}
						</div>

						{/* Email Field */}
						<div>
							<input
								type='email'
								placeholder='Email'
								name='email'
								value={formData.email}
								className={`w-full px-4 py-2 border ${
									errors.email
										? 'border-red-500'
										: 'border-gray-300'
								} rounded-lg focus:outline-none focus:ring-2 ${
									errors.email
										? 'focus:ring-red-500'
										: 'focus:ring-indigo-500'
								}`}
								onChange={onChangeFormUpdate}
							/>
							{errors.email && (
								<p className='text-red-500 text-sm mt-1'>
									{errors.email}
								</p>
							)}
						</div>

						{/* Password Field */}
						<PasswordInput
							name='password'
							value={formData.password}
							onChange={onChangeFormUpdate}
						/>
						{errors.password && (
							<p className='text-red-500 text-sm mt-1'>
								{errors.password}
							</p>
						)}

						<button
							type='submit'
							className='w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:bg-indigo-700'>
							Submit
						</button>
					</form>

					<p className='text-center text-sm text-gray-600 mt-4'>
						Already have an account?
						<Link
							to='/login'
							className='text-indigo-600 hover:text-indigo-500 font-medium ml-2 bg-indigo-100 px-2 py-1 rounded-full'>
							Log in
						</Link>
					</p>
				</div>
			</div>
		</>
	);
};

export default SignUp;
