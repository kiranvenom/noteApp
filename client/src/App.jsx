import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import SignUp from './Pages/SignUp/SignUp';
import Redirect from './Pages/Redirect/Redirect';
import NoteDetails from './Pages/NoteDetails/NoteDetails';

const App = () => {
	return (
		<>
			<Routes>
				<Route path='/' element={<Redirect />} />
				<Route path='/dashboard' element={<Home />} />
				<Route path='/dashboard/:id' element={<NoteDetails />} />
				<Route path='/login' element={<Login />} />
				<Route path='/signUp' element={<SignUp />} />
			</Routes>
		</>
	);
};

export default App;
