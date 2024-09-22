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

import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';

const Home = () => {
	const [openAddEdit, setOpenAddEdit] = useState({
		isShown: false,
		type: 'add',
		data: null,
	});

	const [userInfo, setUserInfo] = useState(null);
	const [userNotes, setUserNotes] = useState([]);
	const [userNotesFull, setUserNotesFull] = useState([]);
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

	const getUserNotes = async (page = 1) => {
		try {
			const { data } = await axiosInstance.get(
				`/allNotes?page=${page}&limit=9`,
			);
			if (data && data.notes) {
				setUserNotes(data.notes);
				setUserNotesFull(data);
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

	const handlePageChange = (pageNum) => {
		getUserNotes(pageNum);
	};

	useEffect(() => {
		getUserInfo();
		getUserNotes();
	}, []);

	if (!userNotes) return '...loading';

	return (
		<>
			<NavBar userInfo={userInfo} onSearch={handleSearch} />

			<div className='maxW py-4 h-full min-h-[90vh]'>
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

				<div className='mt-8'>
					<Pagination>
						<PaginationContent>
							{userNotesFull?.currentPage > 1 && (
								<PaginationItem>
									<PaginationPrevious
										className={`border mx-2 hover:bg-slate-300 dark:text-white`}
										onClick={() =>
											handlePageChange(
												userNotesFull.currentPage - 1,
											)
										}
									/>
								</PaginationItem>
							)}

							<PaginationItem>
								{Array.from(
									{
										length: userNotesFull?.totalPages,
									},
									(_, i) => i + 1,
								).map((num, idx) => {
									return (
										<PaginationLink
											className={`border mx-2 hover:bg-slate-300 ${
												userNotesFull?.currentPage ===
													num &&
												'bg-slate-300 dark:bg-slate-900'
											}`}
											key={idx}
											onClick={() =>
												handlePageChange(num)
											}>
											<span className='dark:text-white'>
												{num}
											</span>
										</PaginationLink>
									);
								})}
							</PaginationItem>

							{userNotesFull?.currentPage <
								userNotesFull?.totalPages && (
								<PaginationItem>
									<PaginationNext
										className={`border mx-2 hover:bg-slate-300 dark:text-white`}
										onClick={() =>
											handlePageChange(
												userNotesFull.currentPage + 1,
											)
										}
									/>
								</PaginationItem>
							)}
						</PaginationContent>
					</Pagination>
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
				className='w-[50px] h-[50px] center rounded-lg bg-myBlue fixed bottom-4 right-4 shadow-sm hover:shadow-md transition-all'>
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
