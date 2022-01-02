const app = require('./app');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { MONGO_URL } = require('./config');
const User = require('./models/User');
const { validateRegisterInput } = require('./utils/validators');

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

app.post('/register', (req, res) => {
    // const { itsc, password, confirmedPassword } = req.body;
    const itsc = req.body.itsc;
    const password = req.body.password;
    const confirmedPassword = req.body.confirmedPassword;
    const { errors, valid } = validateRegisterInput(itsc, password, confirmedPassword);
    if (!valid) {
        res.send(errors);
    }
    else {
        User.findOne({ itsc }, (err, user) => {
            if (user) {
                errors.itsc = 'This ITSC has been registerd before.';
                res.send(errors);
            }
            else {
                bcrypt.hash(password, 13, (err, hash) => {
                    const newUser = new User({
                        itsc, 
                        password: hash,
                        createdAt: new Date().toISOString()
                    });
                    User.create(newUser);
                    res.send('Successfully Registered!');
                });  
            }
        });    
    }
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});