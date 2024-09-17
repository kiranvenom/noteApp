import React, { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import NoteCard from '../../components/NoteCard/NoteCard';
import AddEditNotes from './AddEditNotes';
import Modal from 'react-modal';
import moment from 'moment';

import { IoMdAdd } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import EmptyCard from '../../components/EmptyCard/EmptyCard';

const Home = () => {
	const [openAddEdit, setOpenAddEdit] = useState({
		isShown: false,
		type: 'add',
		data: null,
	});

	const [userInfo, setUserInfo] = useState(null);
	const [userNotes, setUserNotes] = useState([]);
	const [searchResults, setSearchResults] = useState(null);

	const navigate = useNavigate();

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

	const getUserNotes = async () => {
		try {
			const { data } = await axiosInstance.get('/allNotes');
			if (data && data.notes) {
				setUserNotes(data.notes);
				setSearchResults(data.notes);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const deleteNote = async (noteId) => {
		try {
			await axiosInstance.delete(`/deleteNote/${noteId}`);
			getUserNotes();
		} catch (error) {
			console.log(error);
		}
	};

	const handleSearch = (results) => {
		if (results === null) {
			// When search is cleared, show all notes
			setSearchResults(userNotes);
		} else {
			setSearchResults(results);
		}
	};

	const pinedNote = async (noteId) => {
		try {
			await axiosInstance.patch(`/togglePin/${noteId}`);

			getUserNotes();
		} catch (error) {
			console.error('Error toggling pin status:', error);

			if (error.response) {
				console.log('Server error:', error.response.data.message);
			} else {
				console.log('An unknown error occurred.');
			}
		}
	};

	useEffect(() => {
		getUserInfo();
		getUserNotes();
	}, []);

	if (!userNotes) return '...loading';

	return (
		<>
			<NavBar userInfo={userInfo} onSearch={handleSearch} />
			<div className='maxW py-4 h-screen'>
				<div className='grid md:grid-cols-3 gap-2'>
					{searchResults && searchResults.length > 0 ? (
						searchResults.map((note) => (
							<NoteCard
								key={note._id}
								id={note._id}
								title={note.title}
								date={moment(note.createdOn).format(
									'Do MM YYYY',
								)}
								content={note.content}
								tags={note.tags}
								isPinned={note.isPinned}
								onEdit={() => {}}
								onDelete={() => deleteNote(note._id)}
								onPinNote={() => pinedNote(note._id)}
							/>
						))
					) : (
						<EmptyCard />
					)}
				</div>
			</div>

			<div
				onClick={() =>
					setOpenAddEdit({
						isShown: true,
						type: 'add',
						data: null,
					})
				}
				className='w-[50px] h-[50px] center rounded-lg bg-myBlue absolute bottom-4 right-4 shadow-sm hover:shadow-md transition-all'>
				<IoMdAdd color='white' size={30} />
			</div>

			<Modal
				isOpen={openAddEdit.isShown}
				onRequestClose={() => {}}
				style={{
					overlay: {
						backgroundColor: '#d9d9d9c2',
					},
				}}
				contentLabel='Add/Edit Note'
				className='center wh'>
				<AddEditNotes
					onClose={() => {
						setOpenAddEdit({
							isShown: false,
							type: 'add',
							data: null,
						});
					}}
					onSave={() => {
						getUserNotes();
					}}
				/>
			</Modal>
		</>
	);
};

export default Home;
