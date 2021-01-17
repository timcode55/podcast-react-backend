const mongoose = require('mongoose');

const Rating = mongoose.model(
	'Rating',
	mongoose.Schema({
		title: { type: String, index: true },
		rating: Number,
		numberOfRatings: Number,
		genre: String,
		description: String,
		website: String,
		itunes: String,
		categoryid: Number,
		itunesid: Number,
		listennotesurl: String
	})
);

module.exports = Rating;
