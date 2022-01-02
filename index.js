const app = require('./app');
const mongoose = require('mongoose');

const { MONGO_URL } = require('./config');

const PORT = process.env.PORT || 4000;

mongoose.connect(MONGO_URL, { useNewUrlParser: true,  useUnifiedTopology: true })
const db = mongoose.connection;
db.on('error', (error) => {
    console.error(error);
});
db.once('open', () => {
    console.log('MongoDB connected!');
});

app.get('/', (req, res) => {
    res.send('Server Successfully Setup!');
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});