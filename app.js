const mongoose = require('mongoose');
const fs = require('fs');
const cheerio = require('cheerio');
require('./db/mongoose');
const express = require('express');
const app = express();
const PORT = process.env.port || 8000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const dotenv = require('dotenv');

const Rating = require('./db/Rating');
const connectDB = require('./db/mongoose');

dotenv.config({ path: './config.env' });

connectDB();

app.get('/', (req, res) => res.send('Hello World! This works!'));
const storeData = () => {
	let podcastData = Rating.find({});
	// console.log(podcastData, 'podcastData');
	// fs.writeFile('fulldatabase2.txt', podcastData, function(err) {
	// 	if (err) throw err;
	// 	console.log('Saved!');
	// });
};

storeData();
// fs.writeFile('fulldatabase.txt', , function(err) {
// 	if (err) throw err;
// 	console.log('Saved!');
// });

app.get('/podcasts', async (req, res) => {
	try {
		const podcast = await Rating.find({}).limit(20).lean();
		res.send(podcast);
	} catch (e) {
		res.status(500).send();
	}
});

app.get('/topTwenty', async (req, res) => {
	try {
		const topTwenty = await Rating.find({
			rating: { $gt: 4.8 },
			numberOfRatings: { $gt: 10000 }
		}).limit(20);
		console.log(topTwenty, 'topTwenty');
		res.send(topTwenty);
	} catch (e) {
		res.status(500).send();
	}
});

app.post('/addpodcast', (req, res) => {
	const addPodcast = new Rating({
		title: req.body.title,
		rating: req.body.rating,
		numberOfRatings: req.body.numberOfRatings,
		genre: req.body.genre,
		description: req.body.description,
		website: req.body.website,
		itunes: req.body.itunes,
		categoryid: req.body.categoryid,
		itunesid: req.body.itunesid,
		listennotesurl: req.body.listennotesurl
	});

	// const podInDb = Rating.findOne({ title: pod.title }).lean();
	if (true) {
		try {
			addPodcast.save((err, doc) => {
				if (err) return console.log(err);
				res.status(200).json(doc);
			});
		} catch (error) {
			console.log('Problem adding to DB', error);
		}
	}
});

app.post('/updatepodcast', (req, res) => {
	const title = req.body.title;
	const categoryid = req.body.title;
	const genre = req.body.title;
	const itunes = req.body.title;
	const numberOfRatings = req.body.title;
	const rating = req.body.title;

	Rating.findOneAndUpdate(title, (err, pod) => {
		if (err) return console.log(err);

		pod.set({
			categoryid: categoryid,
			genre: genre,
			itunes: itunes,
			numberOfRatings: numberOfRatings,
			rating: rating
		});
		pod.save((err, doc) => {
			if (err) return console.log(err);
			res.json(doc);
		});
	});
});

app.post('/itunesdb', (req, res) => {
	console.log('ituneslistarray - app.js 104', req.body.urls);
	scrapeItunes(req.body.urls);
	res.send({ status: 'ok' });
	// req.body.urls = [];
});

async function scrapeItunes(list) {
	if (list.length > 20) {
		list = list.slice(list.length - 20);
	}

	// console.log('156', list);
	for (let i = 0; i < list.length; i++) {
		// console.log('157', list[i]);
		// console.log('158', list.length);
		try {
			const html = await request.get(`${list[i]}`);

			// const html = await request.get(`${list[i]}`);
			// // console.log(html);
			const $ = await cheerio.load(html);
			let object = {};
			const titles = $('.product-header__title');
			const ratings = $('.we-customer-ratings__averages__display');
			const genre = $('.inline-list__item--bulleted');
			const numberOfRatings = $('p.we-customer-ratings__count');
			// const description = $('#ember381 > p');
			// const descriptions = $('[name="ember-cli-head-start"]');
			// console.log(descriptions);
			// await sleep(200);
			titles.each((i, element) => {
				const title = $(element).text().trim();
				object['title'] = title;
			});

			ratings.each((i, element) => {
				const rating = $(element).text().trim();
				// console.log(rating);
				object['rating'] = parseFloat(rating);
			});
			genre.each((i, element) => {
				const genre = $(element).text().trim();
				// console.log(rating);
				object['genre'] = genre;
			});
			numberOfRatings.each((j, element) => {
				let numberOfRatings = $(element, j).text().split(' ')[0];
				for (let i = 0; i < numberOfRatings.length; i++) {
					if (numberOfRatings[i] === 'K') {
						numberOfRatings = parseFloat(numberOfRatings) * 1000;
					} else {
						numberOfRatings;
					}
				}
				console.log(numberOfRatings);
				object['numberOfRatings'] = numberOfRatings;
			});

			//Add Listen Notes Call to add it's data to the DB
			const podRating = new Rating({
				title: object.title,
				rating: object.rating,
				numberOfRatings: object.numberOfRatings,
				genre: object.genre,
				url: list[i] || ''
			});

			const podFromDb = await Rating.findOne({ title: object.title }).lean();
			console.log(podRating, 'podRating');
			try {
				if (!podFromDb) {
					try {
						testArray.push(podRating);
						console.log("item doesn't exist, I'll add it");

						podRating.save();
						console.log('TEST, NEW ITEM', object);
					} catch (error) {
						console.log('PROBLEM', error);
					}
				} else {
					console.log('item already exists, Ill update it.');
					try {
						// console.log('223', object);
						Rating.findOneAndUpdate(
							// $set: { rating: object.rating },

							{ title: object.title },
							{
								$set: {
									rating: object.rating,
									numberOfRatings: object.numberOfRatings
								}
							},
							{ new: true },
							function(err, res) {
								if (err) throw err;
								console.log('1 document updated');
							}
						);

						console.log('in DB after update', object);
					} catch (e) {
						console.log('PROBLEM LATER', e);
					}
				}
			} catch (err) {
				console.log('PROBLEM MORE LATER', err);
			}
		} catch (e) {
			console.log('AND EVEN MORE LATER', e);
			continue;
		}
	}
	console.log('ALL DONE SCANNING');
}

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
