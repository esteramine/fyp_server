const app = require('./app');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { MONGO_URL } = require('./config');
const User = require('./models/User');
const { validateRegisterInput, validateLoginInput } = require('./utils/validators');

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
    const { itsc, password, confirmedPassword } = req.body;
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

app.post('/login', (req, res) => {
    const { itsc, password } = req.body;
    const { errors, valid } = validateLoginInput(itsc, password);
    if (!valid) {
        res.send(errors);
    }
    else {
        User.findOne({ itsc }, (err, user) => {
            if (!user) {
                errors.itsc = 'User does not exist!';
                res.send(errors);
            }
            else {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (!result) {
                        errors.password = 'Password incorrect!';
                        res.send(errors);
                    }
                    else {
                        res.send('Successfully Login!');
                    }
                });
            }

        });
    }

});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});