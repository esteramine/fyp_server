module.exports.validateRegisterInput = (username, password, confirmedPassword) => {
    const errors = {};
    if (username.trim() == '') {
        errors.username = 'Username should not be empty!';
    }
    if (password == '') {
        errors.password = 'Password should not be empty!';
    }
    else if (password !== confirmedPassword) {
        errors.confirmedPassword = 'Passwords do not match!';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }

};

module.exports.validateLoginInput = (username, password) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = 'Username must not be empty!';
    }
    if (password === '') {
        errors.password = 'Password must not be empty!';
    }

    return {
        errors, 
        valid: Object.keys(errors).length < 1
    }
}