const mongoose = require('mongoose');

const Rating = mongoose.model(
	'Rating',
	mongoose.Schema({
		title: { type: String, index: true, unique: true, dropDups: true },
		id: String,
		rating: Number,
		image: String,
		numberOfRatings: Number,
		genre: String,
		description: String,
		website: String,
		itunes: String,
		itunesid: Number,
		listennotesurl: String
	})
);

module.exports = Rating;
