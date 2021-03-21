const mongoose = require('mongoose');
const fs = require('fs');
const cheerio = require('cheerio');
const request = require('request-promise');
require('./db/mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.port || 8000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cors());

const dotenv = require('dotenv');

const Rating = require('./db/Rating');
const connectDB = require('./db/mongoose');

dotenv.config({ path: './config.env' });

connectDB();

app.post('/findId', async (req, res) => {
	let id = req.query.data;
	try {
		// const podcast = await Rating.findOne({ id: req.body.id }).lean();
		// console.log(podcast, 'podcast in route');
		// res.send(podcast);
		// console.log(req.body.podcasts, 'req.body');
		// const newArray = [];
		// for (let pod of req.body.podcasts) {
		// console.log(pod, 'pod in req.body', req.body.podcasts.length);
		const podcast = await Rating.findOne({ id }).lean();
		// console.log(podcast, 'podcast in app.js');
		// pod['rating'] = podcast.rating;
		// pod['numberOfRatings'] = podcast.numberOfRatings || 'N/A';
		// pod['itunes'] = podcast.itunes;
		// console.log(pod, 'pod right before push to newArray');
		// newArray.push(pod);
		// }
		res.send(podcast);
		// console.log(req.body.podcasts, 'req.body.podcasts after findOne');
	} catch (e) {
		res.status(500).send();
	}
});

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	next();
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
