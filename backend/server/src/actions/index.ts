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
    const authCookie = req.cookies ? req.cookies.jwt : req.cookies;
    if (!authCookie) {
        return res.status(401).send({ message: 'Unauthorized' });
    }
    try {
        jwt.verify(authCookie, config.JWTsecret);
    } catch (err) {
        return res.status(401).send({ message: 'Unauthorized' });
    }
    return next();
}
