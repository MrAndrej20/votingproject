import Schemas = require('../schema');
import _ = require('lodash');
import { User } from '../entities/all';
import * as bcrypt from 'bcrypt';

export async function login(req, res) {
    const password = req.body.password;
    const user: User = await User.select(User.password).where(User.embg.equals(req.body.embg)).get();
    if (_.isEmpty(user)) {
        return res.status(400).send({ message: 'EMBG doesn\'t exit' });
    }
    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).send({ message: 'Bad Password' });
    };
    return res.status(200).send({ message: 'User successfully logged in' });
}
export async function register(req, res) {
    const user: User = {
        id: null,
        embg: req.body.embg,
        username: req.body.username,
        password: req.body.password,
        pollVotes: {}
    };
    if (user.username.length > 20 || user.password.length > 80) {
        return res.status(400).send({ message: 'Username or password is too long' });
    }
    const [existingUser, polls] = await Promise.all([
        User.where(User.embg.equals(req.body.embg)).get() as Promise<User>,
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
