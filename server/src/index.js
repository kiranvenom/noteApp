require('dotenv').config();
const mongoose = require('mongoose');

mongoose
	.connect(process.env.CONNECTION_STRING)
	.then(() => console.log('connected'))
	.catch((err) => console.log(err));

const User = require('./models/user.model');
const Note = require('./models/note.model');

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const port = 5000;

const { authenticationToken } = require('./utils/utils');

app.use(express.json());
app.use(
	cors({
		origin: '*',
	}),
);

app.get('/status', (req, res) => {
	res.send(true);
});

// user ----------------------------------------------------
app.post('/createAccount', async (req, res) => {
	const { fullName, email, password } = req.body;

	if (!fullName) {
		return res
			.status(400)
			.json({ error: true, message: 'Full Name is Required' });
	}
	if (!email) {
		return res
			.status(400)
			.json({ error: true, message: 'Email is Required' });
	}
	if (!password) {
		return res
			.status(400)
			.json({ error: true, message: 'Password is Required' });
	}

	const isUser = await User.findOne({ email: email });
	if (isUser)
		return res.json({ error: true, message: 'User already exists' });

	const hashedPassword = await bcrypt.hash(password, 10);

	const newUser = new User({ fullName, email, password: hashedPassword });
	await newUser.save();

	const assessToken = jwt.sign({ newUser }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: '15000m',
	});

	return res.json({
		error: false,
		newUser,
		assessToken,
		message: 'Registration completed',
	});
});

app.post('/login', async (req, res) => {
	const { email, password } = req.body;

	if (!email) {
		return res
			.status(400)
			.json({ error: true, message: 'Email is required' });
	}

	if (!password) {
		return res
			.status(400)
			.json({ error: true, message: 'Password is required' });
	}

	const userInfo = await User.findOne({ email: email });

	if (!userInfo) {
		return res.status(400).json({ error: true, message: 'User not found' });
	}

	// Compare the hashed password
	const isPasswordValid = await bcrypt.compare(password, userInfo.password);
	if (!isPasswordValid) {
		return res.status(400).json({
			error: true,
			message: 'Invalid credentials',
		});
	}

	const user = { user: userInfo };

	const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: '15000m',
	});

	return res.json({
		error: false,
		message: 'Login successful',
		email,
		accessToken,
	});
});

app.get('/getUser', authenticationToken, async (req, res) => {
	const { user } = req.user; // Extract user from the request

	try {
		// Perform the aggregation to fetch user and related notes
		const isUser = await User.aggregate([
			{ $match: { fullName: user.fullName } },
			{
				$lookup: {
					from: 'notes',
					localField: '_id',
					foreignField: 'userId',
					as: 'details',
				},
			},
			{
				$addFields: {
					notesCount: { $size: '$details' },
					theme: 'light',
				},
			},
			{
				$project: {
					fullName: 1,
					email: 1,
					createdOn: 1,
					notesCount: 1,
					theme: 1,
				},
			},
		]);

		if (!isUser || isUser.length === 0) {
			return res.sendStatus(401);
		}

		const formattedResponse = {
			user: {
				fullName: isUser[0].fullName,
				email: isUser[0].email,
				_id: isUser[0]._id,
				createdOn: isUser[0].createdOn,
				notesCount: isUser[0].notesCount,
				theme: isUser[0].theme,
			},
			message: '',
		};

		return res.json(formattedResponse);
	} catch (error) {
		// Handle any potential errors
		console.error(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
});

// app.get('/getUser', authenticationToken, async (req, res) => {
// 	const { user } = req.user;

// 	const isUser = await User.findOne({ _id: user._id });

// 	if (!isUser) res.sendStatus(401);

// 	return res.json({
// 		user: {
// 			fullName: isUser?.fullName,
// 			email: isUser?.email,
// 			_id: isUser?._id,
// 			createdOn: isUser?.createdOn,
// 		},
// 		message: '',
// 	});
// });

// notes -----------------------------------------------------
app.post('/addNote', authenticationToken, async (req, res) => {
	const { title, content, tags } = req.body;

	const { user } = req.user;

	if (!title) {
		return res
			.status(400)
			.json({ error: true, message: 'Title is Required' });
	}
	if (!content) {
		return res
			.status(400)
			.json({ error: true, message: 'content is Required' });
	}

	try {
		const note = new Note({
			title,
			content,
			tags: tags || [],
			userId: user._id,
		});

		await note.save();

		return res.json({
			error: false,
			note,
			message: 'note added successfully',
		});
	} catch (err) {
		return res.status(500).json({
			error: true,
			message: 'Internal Server Error',
		});
	}
});

app.put('/editNote/:noteId', authenticationToken, async (req, res) => {
	const noteId = req.params.noteId;
	const { title, content, tags, isPinned } = req.body;
	const { user } = req.user;

	if (!title && !content && !tags && typeof isPinned === 'undefined') {
		return res
			.status(400)
			.json({ error: true, message: 'no changes made' });
	}

	try {
		const note = await Note.findOne({ _id: noteId, userId: user._id });

		if (!note) {
			return res
				.status(404)
				.json({ error: true, message: 'note not found' });
		}

		if (title) note.title = title;
		if (content) note.content = content;
		if (tags) note.tags = tags;
		if (typeof isPinned !== 'undefined') note.isPinned = isPinned;

		await note.save();

		return res.json({
			error: false,
			note,
			message: 'changes updated',
		});
	} catch (error) {
		return res
			.status(500)
			.json({ error: true, message: 'internal server error' });
	}
});

app.get('/allNotes', authenticationToken, async (req, res) => {
	const { user } = req.user;

	try {
		const notes = await Note.find({ userId: user._id }).sort({
			isPinned: -1,
		});

		return res.json({
			error: false,
			notes,
			message: 'all notes retrieved',
		});
	} catch (error) {
		return res
			.status(500)
			.json({ error: true, message: 'internal server error' });
	}
});

app.delete('/deleteNote/:noteId', authenticationToken, async (req, res) => {
	const { user } = req.user;
	const noteId = req.params.noteId;

	try {
		const note = await Note.findOne({ _id: noteId, userId: user._id });

		if (!note)
			return res
				.status(404)
				.json({ error: true, message: 'note not found' });

		await note.deleteOne({ _id: noteId, userId: user._id });

		return res.json({ error: false, message: 'note deleted' });
	} catch (error) {
		return res
			.status(500)
			.json({ error: true, message: 'something went wrong' });
	}
});

app.get('/allNotes/:noteId', authenticationToken, async (req, res) => {
	const noteId = req.params.noteId;
	const { user } = req.user;

	try {
		const note = await Note.findOne({ _id: noteId, userId: user._id });

		return res.json({
			error: false,
			note,
			message: `ID : ${noteId} note retrieved`,
		});
	} catch (error) {
		console.log(error);
	}
});

app.get('/searchNotes', authenticationToken, async (req, res) => {
	const { query } = req.query;
	const { user } = req.user;

	try {
		if (!query) {
			return res.status(400).json({
				error: true,
				message: 'Query parameter is required.',
			});
		}

		const notes = await Note.find({
			userId: user._id,
			$or: [
				{ title: { $regex: query, $options: 'i' } },
				{ content: { $regex: query, $options: 'i' } },
			],
		});

		return res.json({
			error: false,
			notes,
			message: `Notes matching query: ${query} retrieved`,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: true,
			message: 'Internal server error',
		});
	}
});

app.patch('/togglePin/:id', authenticationToken, async (req, res) => {
	const { id } = req.params;
	const { user } = req.user;

	try {
		const note = await Note.findOne({ _id: id, userId: user._id });

		if (!note) {
			return res.status(404).json({
				error: true,
				message: 'Note not found',
			});
		}

		note.isPinned = !note.isPinned;

		await note.save();

		return res.json({
			error: false,
			note,
			message: `Note ${
				note.isPinned ? 'pinned' : 'unpinned'
			} successfully`,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			error: true,
			message: 'Internal server error',
		});
	}
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
