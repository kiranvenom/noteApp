import { MdCreate, MdDelete } from 'react-icons/md';
import { VscPinned } from 'react-icons/vsc';
import { TbPinnedFilled } from 'react-icons/tb';
import { Link } from 'react-router-dom';

const NoteCard = ({
	id,
	title,
	date,
	content,
	tags,
	isPinned,
	onEdit,
	onDelete,
	onPinNote,
}) => {
	return (
		<>
			<div className='bg-white hover:bg-slate-50 shadow-md rounded-lg p-4 border border-gray-200 mx-4 md:mx-1'>
				<div className='flex justify-between items-start mb-3'>
					<div>
						<Link to={`/dashboard/${id}`}>
							<h6 className='text-lg font-semibold text-gray-800 capitalize'>
								{title}
							</h6>
						</Link>
						<span className='text-sm text-gray-500'>{date}</span>
					</div>

					{isPinned ? (
						<>
							<button
								onClick={onPinNote}
								className='text-yellow-500 hover:text-gray-500 bg-yellow-200 rounded-full'>
								<TbPinnedFilled className={`text-xl`} />
							</button>
						</>
					) : (
						<>
							<button
								onClick={onPinNote}
								className='text-gray-500 bg-slate-200 rounded-full hover:text-yellow-500'>
								<VscPinned className={`text-xl`} />
							</button>
						</>
					)}
				</div>

				<p className='text-gray-600 mb-4 min-h-[50px]'>
					{content?.length > 80
						? `${content.slice(0, 80)}...`
						: content}
				</p>

				<div className='flex justify-between items-center'>
					<div className='flex flex-wrap gap-2'>
						{tags?.map((tag, index) => (
							<span
								key={index}
								className='bg-indigo-100 text-indigo-600 text-xs font-medium px-2 py-1 rounded-full'>
								{tag}
							</span>
						))}
					</div>
					<div className='flex space-x-3'>
						<button
							onClick={onEdit}
							className='text-blue-500 hover:text-blue-700 transition-colors bg-blue-200 rounded-full'>
							<MdCreate className='text-xl' />
						</button>
						<button
							onClick={onDelete}
							className='text-red-500 hover:text-red-700 transition-colors bg-red-200 rounded-full'>
							<MdDelete className='text-xl' />
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default NoteCard;
