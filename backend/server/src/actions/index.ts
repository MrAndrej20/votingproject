import jwt = require('jsonwebtoken');
import _ = require('lodash');
import config = require('../config');

export { addPoll, getPolls, vote } from './polls';
export { login, register } from './users';

export function bodyHas(...parameterNames: string[]) {
    return (req, res, next) => {
        const missingParameter = _.filter(parameterNames, parameterName => !_.get(req.body, parameterName));
        if (missingParameter.length) {
            return res.status(400).send({ message: `Missing POST parameter: ${missingParameter}` });
        }
        else {
            return next();
        }
    };
}

export function verifyToken(req, res, next) {
    if (!req.headers['x-auth-header']) {
        return res.status(401).send({ message: 'Unauthorized' });
    }
    try {
        jwt.verify(req.headers['x-auth-header'], config.JWTsecret);
    } catch (err) {
        return res.status(401).send({ message: 'Unauthorized' });
    }
    return next();
}
export async function adminLogin(req, res) {
    const { username, password } = req.body;
    const { adminUser, adminPass } = process.env;
    if (username !== adminUser || password !== adminPass) {
        return res.status(401).send({ message: 'Wrong Credentials' });
    }
    const token = jwt.sign({

    }, config.JWTsecret);
    res.cookie('jwt', token);
    return res.status(200).send({ message: 'Admin successfully logged in' });
}
