import { LuListX } from 'react-icons/lu';

const EmptyCard = () => {
	return (
		<div className='w-[80vw] h-[80vh] center flex-col'>
			<LuListX size={60} />
			<h2 className='text-xs'>No Notes yet, click on add button</h2>
		</div>
	);
};

export default EmptyCard;
