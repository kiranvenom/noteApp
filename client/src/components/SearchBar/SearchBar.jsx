import { TbZoom } from 'react-icons/tb';
import { MdOutlineClose } from 'react-icons/md';

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
	return (
		<>
			<div className='bg-slate-100 rounded-md px-4 flex items-center w-[50vw]'>
				<input
					type='text'
					placeholder='Search Note'
					className='outline-none py-2 w-full bg-transparent'
					onChange={onChange}
					value={value}
				/>

				{value && (
					<MdOutlineClose
						size={20}
						className='text-slate-400 hover:text-slate-500 cursor-pointer mr-2'
						onClick={onClearSearch}
					/>
				)}

				<TbZoom
					size={20}
					className='text-slate-400 hover:text-slate-500 cursor-pointer'
					onClick={handleSearch}
				/>
			</div>
		</>
	);
};

export default SearchBar;
