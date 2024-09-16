import axios from 'axios';
import { baseUrl } from './constants';

const axiosInstance = axios.create({
	baseURL: baseUrl,
	timeout: 15000,
	headers: {
		'Content-Type': 'application/json',
	},
});

axiosInstance.interceptors.request.use(
	(config) => {
		const accessToken = localStorage.getItem('token');
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

export default axiosInstance;
