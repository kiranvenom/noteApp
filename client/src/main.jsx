import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import Modal from 'react-modal';
import { Provider } from 'react-redux';
import { store } from './redux/Store/store.js';

Modal.setAppElement('#root');

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	</StrictMode>,
);
