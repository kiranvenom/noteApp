const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
	title: { type: String, require: true },
	content: { type: String, require: true },
	tags: { type: [String], default: [], require: true },
	isPinned: { type: Boolean, default: false },
	// userId: { type: String, require: true },
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	createdOn: { type: Date, default: new Date().getTime() },
});

module.exports = mongoose.model('Note', noteSchema);
