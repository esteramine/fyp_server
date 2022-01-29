const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');
const { validateRegisterInput, validateLoginInput } = require('../../utils/validators');

const generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        username: user.username
    }, SECRET_KEY, { expiresIn: '1h' });
}

module.exports = {
    Mutation: {
        async register(_, { registerInput: { username, password, confirmedPassword } }) {
            // Validate user data
            const { valid, errors } = validateRegisterInput(username, password, confirmedPassword);
            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }
            // Make sure user does not exist
            const user = await User.findOne({ username });
            if (user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken.'
                    }
                });
            }
            //hash password and create an auth token
            password = await bcrypt.hash(password, 13);

            const newUser = new User({
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            }
        },
        async login(_, { loginInput: {username, password} }) {
            const { valid, errors } = validateLoginInput(username, password);
            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }

            const user = await User.findOne({ username });

            if (!user) {
                errors.general = 'User not found.';
                throw new UserInputError('User not found', { errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = 'Wrong credentials.';
                throw new UserInputError('Wrong credentials', { errors });
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            };
        }
    }
}