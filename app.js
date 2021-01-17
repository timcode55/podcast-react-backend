const mongoose = require('mongoose');
require('./db/mongoose');
const express = require('express');
const app = express();
const PORT = process.env.port || 8000;

const dotenv = require('dotenv');

const Rating = require('./db/Rating');
const connectDB = require('./db/mongoose');

dotenv.config({ path: './config.env' });

connectDB();

app.get('/', (req, res) => res.send('Hello World! This works!'));

app.get('/podcasts', async (req, res) => {
	try {
		const podcast = await Rating.find({}).limit(10).lean();
		res.send(podcast);
	} catch (e) {
		res.status(500).send();
	}
});

app.get('/topTwenty', async (req, res) => {
	try {
		const topTwenty = await Rating.find({
			rating: { $gt: 4.8 },
			numberOfRatings: { $gt: 5000 }
		}).limit(20);
		console.log(topTwenty, 'topTwenty');
		res.send(topTwenty);
	} catch (e) {
		res.status(500).send();
	}
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
