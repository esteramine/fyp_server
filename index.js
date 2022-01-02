const express = require('express');
const mongoose = require('mongoose');
const app = express();
const { MONGO_URL } = require('./config');

const PORT = process.env.PORT || 4000;

mongoose.connect(MONGO_URL, { useNewUrlParser: true,  useUnifiedTopology: true })
const db = mongoose.connection;
db.on('error', (error) => {
    console.error(error)
});
db.once('open', () => {
    console.log('MongoDB connected!')
});