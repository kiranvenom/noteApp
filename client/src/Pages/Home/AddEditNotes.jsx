import { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';

const AddEditNotes = ({
	initialNote = {},
	onSave,
	onClose,
	label,
	updateNote,
}) => {
	const [note, setNote] = useState({
		title: initialNote.title || '',
		content: initialNote.content || '',
		tags: Array.isArray(initialNote.tags)
			? initialNote.tags
			: initialNote.tags
			? initialNote.tags.split(',')
			: [],
	});

	const [newTag, setNewTag] = useState('');

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNote((prevNote) => ({
			...prevNote,
			[name]: value,
		}));
	};

	const handleAddTag = () => {
		if (newTag.trim() && !note.tags.includes(newTag.trim())) {
			setNote((prevNote) => ({
				...prevNote,
				tags: [...prevNote.tags, newTag.trim()],
			}));
			setNewTag('');
		}
	};

	const handleRemoveTag = (tagToRemove) => {
		setNote((prevNote) => ({
			...prevNote,
			tags: prevNote.tags.filter((tag) => tag !== tagToRemove),
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const { data } = await axiosInstance.post('/addNote', {
				title: note.title,
				content: note.content,
				tags: note.tags,
			});

			if (data && data.note) {
				onClose();
				onSave();
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg w-[80vw] md:w-[30vw]'>
			<h4 className='text-2xl font-bold mb-4'>
				{initialNote.id ? 'Edit Note' : 'Add Note'}
			</h4>

			<form onSubmit={handleSubmit}>
				<div className='mb-4'>
					<label className='block text-gray-700 text-sm font-semibold mb-2'>
						Title
					</label>
					<input
						type='text'
						name='title'
						value={note.title}
						onChange={handleInputChange}
						placeholder='Enter note title'
						className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
					/>
				</div>

				<div className='mb-4'>
					<label className='block text-gray-700 text-sm font-semibold mb-2'>
						Content
					</label>
					<textarea
						style={{ minHeight: '100px' }}
						name='content'
						value={note.content}
						onChange={handleInputChange}
						placeholder='Enter note content'
						rows='5'
						className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'></textarea>
				</div>

				<div className='mb-4'>
					<label className='block text-gray-700 text-sm font-semibold mb-2'>
						Tags
					</label>
					<div className='flex items-center mb-2'>
						<input
							type='text'
							value={newTag}
							onChange={(e) => setNewTag(e.target.value)}
							placeholder='Enter tag'
							className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
						/>
						<button
							type='button'
							onClick={handleAddTag}
							className='ml-2 px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-500'>
							Add
						</button>
					</div>

					{note?.tags?.length > 0 && (
						<>
							<div className='flex flex-wrap gap-2 border p-2 rounded-lg'>
								{note.tags.map((tag, index) => (
									<span
										key={index}
										className='px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-lg flex items-center'>
										{tag}
										<button
											type='button'
											onClick={() => handleRemoveTag(tag)}
											className='ml-2 text-red-600 hover:text-red-500'>
											&times;
										</button>
									</span>
								))}
							</div>
						</>
					)}
				</div>

				<div className='flex justify-end space-x-3'>
					<button
						type='button'
						onClick={onClose}
						className='px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300'>
						Cancel
					</button>
					{label.type === 'add' ? (
						<>
							<button
								type='submit'
								className='px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-500'>
								Save
							</button>
						</>
					) : (
						<>
							<div
								onClick={() => updateNote(label.data._id, note)}
								className='px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-500'>
								Update
							</div>
						</>
					)}
				</div>
			</form>
		</div>
	);
};

export default AddEditNotes;
