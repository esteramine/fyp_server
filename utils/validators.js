module.exports.validateRegisterInput = (itsc, password, confirmedPassword) => {
    const errors = {};
    if (itsc.trim() == '') {
        errors.itsc = 'ITSC should not be empty!';
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