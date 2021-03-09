const mongoose = require('mongoose');
const fs = require('fs');
const cheerio = require('cheerio');
const request = require('request-promise');
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

app.get('/getpodcast', async (req, res) => {
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
		title: req.body.title.trim(),
		id: req.body.id,
		rating: req.body.rating,
		numberOfRatings: req.body.numberOfRatings,
		genre: req.body.genre,
		description: req.body.description,
		website: req.body.website,
		itunes: req.body.itunes,
		image: req.body.image,
		itunesid: req.body.itunesid,
		listennotesurl: req.body.listennotesurl
	});

	// const podInDb = Rating.findOne({ title: req.body.title }).lean();
	// console.log(podInDb, 'podindb');
	// console.log(req.body.title, 'req.body.title');
	if (true) {
		try {
			console.log('title not in database yet');
			addPodcast.save((err, doc) => {
				res.status(200).send(doc);
			});
		} catch (error) {
			res.status(400).json({ message: 'Error', error: error });
		}
	}
});

app.post('/updatepodcast', (req, res) => {
	const title = req.body.title;

	const genre = req.body.genre;
	const itunes = req.body.itunes;
	const numberOfRatings = req.body.title;
	const rating = req.body.title;

	Rating.findOneAndUpdate(title, (err, pod) => {
		if (err) return console.log(err);

		pod.set({
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
// async function waitRating() {
// 	let podInDb = await Rating.findOne({
// 		title: object.title
// 	}).lean();
// 	return Promise.resolve(podInDb);
// }
// async function run() {
// 	const data = await waitRating();
// 	console.log(data, 'data');
// }

// run();
let testArray = [];
let object = {};
async function scrapeItunes(list) {
	console.log('list', list);
	if (list.length > 20) {
		list = list.slice(list.length - 20);
	}
	console.log(list, 'list');
	for (let i = 0; i < list.length; i++) {
		try {
			const html = await request.get(`${list[i]}`);
			const $ = await cheerio.load(html);

			const titles = $('.product-header__title');
			const ratings = $('.we-customer-ratings__averages__display');
			const genre = $('.inline-list__item--bulleted');
			const numberOfRatings = $('p.we-customer-ratings__count');
			titles.each((i, element) => {
				const title = $(element).text().trim();
				object['title'] = title.trim();
			});

			ratings.each((i, element) => {
				const rating = $(element).text().trim();
				object['rating'] = parseFloat(rating);
			});

			genre.each((i, element) => {
				const genre = $(element).text().trim();
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
			console.log(object, 'object');
			let searchTitle = object.title;
			let podInDb = Rating.findOne({ title: 'Mommy Doomsday' }).lean();
			if (podInDb) {
				let updateItem = Rating.findOneAndUpdate(
					// $set: { rating: object.rating },

					{ title: 'Mommy Doomsday' },
					{
						$set: {
							rating: object.rating,
							numberOfRatings: object.numberOfRatings,
							itunes: list[i],
							genre: object.genre
						}
					},
					// { new: true },
					function(err, res) {
						if (err) throw err;
						console.log('1 document updated');
					}
				);
			}
			// console.log(object, 'object');
			// let searchTitle = object.title.toString();
			// console.log(searchTitle, 'searchTitle');
			// async function waitRating() {
			// 	let podInDb = await Rating.findOneAndUpdate(
			// 		// $set: { rating: object.rating },

			// 		{ title: searchTitle },
			// 		{
			// 			$set: {
			// 				rating: object.rating,
			// 				numberOfRatings: object.numberOfRatings,
			// 				itunes: list[i],
			// 				genre: object.genre
			// 			}
			// 		},
			// 		// { new: true },
			// 		function(err, res) {
			// 			if (err) throw err;
			// 			console.log('1 document updated');
			// 		}
			// 	);
			// 	return Promise.resolve(podInDb);
			// }
			// async function run() {
			// 	const data = await waitRating();
			// 	console.log(data, 'data');
			// }

			// run();
			// let podInDb = await Rating.findOne({ title: 'Third Degree‬' }).lean();
			// console.log(object, 'object');
			// let searchTitle = object.title;
			// console.log(searchTitle, 'searchTitle');
			// let test = await Rating.findOneAndUpdate(
			// 	// $set: { rating: object.rating },

			// 	{ title: searchTitle },
			// 	{
			// 		$set: {
			// 			rating: object.rating,
			// 			numberOfRatings: object.numberOfRatings,
			// 			itunes: list[i],
			// 			genre: object.genre
			// 		}
			// 	},
			// 	{ new: true },
			// 	function(err, res) {
			// 		if (err) throw err;
			// 		console.log('1 document updated');
			// 	}
			// );

			// console.log(updatePod, 'updatePod');
			// const podFromDb = await Rating.findOne({ title: object.title }).lean();
			// console.log(podRating, 'podRating');
			// try {
			// 	if (!podFromDb) {
			// 		try {
			// 			// testArray.push(podRating);
			// 			console.log("item doesn't exist, I'll add it");

			// 			// podRating.save();
			// 			console.log('TEST, NEW ITEM', object);
			// 		} catch (error) {
			// 			console.log('PROBLEM', error);
			// 		}
			// 	} else {
			// 		console.log('item already exists, Ill update it.');
			// 		try {
			// 			// console.log('223', object);
			// 			Rating.findOneAndUpdate(
			// 				// $set: { rating: object.rating },

			// 				{ title: object.title },
			// 				{
			// 					$set: {
			// 						rating: object.rating,
			// 						numberOfRatings: object.numberOfRatings,
			// 						itunes: list[i],
			// 						genre: object.genre
			// 					}
			// 				},
			// 				{ new: true },
			// 				function(err, res) {
			// 					if (err) throw err;
			// 					console.log('1 document updated');
			// 				}
			// 			);

			// 			console.log('in DB after update', object);
			// 		} catch (e) {
			// 			console.log('PROBLEM LATER', e);
			// 		}
			// 	}
			// } catch (err) {
			// 	console.log('PROBLEM MORE LATER', err);
			// }
		} catch (e) {
			console.log('AND EVEN MORE LATER', e);
			continue;
		}
	}

	console.log('ALL DONE SCANNING');
}

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
