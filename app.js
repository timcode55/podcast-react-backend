const express = require('express');
const app = express();
const PORT = 5000;
const mongoose = require('mongoose');
const dotenv = require('dotenv');
require('./db/mongoose');

app.get('/', (req, res) => res.send('Hello World! This works!'));

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
