import * as jwt from "jsonwebtoken";
import Schemas = require('../schema');

import _ = require('lodash');
import { User } from '../entities/all';
import * as bcrypt from 'bcrypt';
import config = require("../config");

export async function login(req, res) {
    const { embg, password } = req.body;
    const { adminUser, adminPass } = process.env;

    if (embg === adminUser && password === adminPass) {
        const token = jwt.sign({
            type: "admin"
        }, config.JWTsecret, { expiresIn: 3600 });
        res.cookie('jwt', token);
        return res.status(200).send({ message: 'Admin successfully logged in' });
    }

    const user: User = await User.select(User.password).where(User.embg.equals(embg)).get();
    if (_.isEmpty(user)) {
        return res.status(400).send({ message: 'User doesn\'t exist' });
    }
    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).send({ message: 'Wrong Password' });
    }
    const token = jwt.sign({
        type: "user",
        embg
    }, config.JWTsecret, { expiresIn: 3600 });
    res.cookie('jwt', token);
    return res.status(200).send({ message: 'User successfully logged in' });
}
export async function register(req, res) {
    const { embg, username, password } = req.body;
    const user: User = {
        id: null,
        embg,
        username,
        password,
        pollVotes: {}
    };
    if (user.embg.length !== 13) {
        return res.status(400).send({ message: 'EMBG doesn\'t exist' });
    }
    if (user.username.length > 20 || user.password.length > 20) {
        return res.status(400).send({ message: 'Username or password is too long' });
    }
    const [existingUser, polls] = await Promise.all([
        User.where(User.embg.equals(embg)).get() as Promise<User>,
        Schemas.Poll.find() as any
    ]);
    if (!_.isEmpty(existingUser)) {
        return res.status(400).send({ message: 'EMBG Already Taken' });
    }
    const pollNames = _.uniq(_.map(polls, poll => poll.pollName));
    _.forEach(pollNames, pollName => user.pollVotes[pollName] = 0);
    user.pollVotes = JSON.stringify(user.pollVotes);
    user.password = bcrypt.hashSync(user.password, 12);
    await User.insert(user).exec();
    return res.status(201).send({ username: user.username });
}
