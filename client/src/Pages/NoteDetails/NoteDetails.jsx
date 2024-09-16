import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import moment from 'moment';
import { IoArrowBackSharp } from 'react-icons/io5';

const NoteDetails = () => {
	let { id } = useParams();

	const [note, setnote] = useState('');

	const getNote = async () => {
		try {
			let { data } = await axiosInstance.get(`/allNotes/${id}`);
			setnote(data.note);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getNote();
	}, []);

	if (note === '') return;

	return (
		<>
			<div className='flex justify-center items-center min-h-screen bg-gray-100 flex-col'>
				<div className='w-[60vw] flex justify-end'>
					<Link
						to='/dashboard'
						className='flex border border-slate-400 items-center gap-2 hover:gap-3 transition-all mr-1 mb-2 px-2 py-1 rounded-full bg-white'>
						<IoArrowBackSharp /> <p>Back</p>
					</Link>
				</div>
				<div className='bg-white w-[60vw] hover:bg-slate-50 shadow-lg rounded-xl p-6 border border-gray-200 transition-shadow duration-300'>
					<div className=' flex justify-between items-start mb-4'>
						<div>
							<h6 className='text-2xl font-semibold text-gray-900 capitalize'>
								{note.title}
							</h6>
							<span className='text-sm text-gray-500'>
								{moment(note.createdOn).format('Do MMMM YYYY')}
							</span>
						</div>
					</div>

					<p className='text-gray-700 mb-6 leading-relaxed bg-slate-100 p-4 rounded-lg border border-slate-200'>
						{note.content}
					</p>

					<div className='flex justify-between items-center'>
						<div className='flex flex-wrap gap-2'>
							{note.tags?.map((tag, index) => (
								<span
									key={index}
									className='bg-indigo-100 text-indigo-600 text-xs font-semibold px-2 py-1 rounded-full'>
									{tag}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default NoteDetails;
