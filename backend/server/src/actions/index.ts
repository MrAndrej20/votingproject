import Schemas = require('../schema');
import jwt = require('jsonwebtoken');
import _ = require('lodash');
import config = require('../config');
import { User } from '../entities/all';
import * as bcrypt from 'bcrypt';

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
    const pollNames = _.uniq(_.map(polls, poll => poll.pollName));
    _.forEach(pollNames, pollName => user.pollVotes[pollName] = 0);
    if (!_.isEmpty(existingUser)) {
        return res.status(400).send({ message: 'EMBG Already Taken' });
    }
    user.pollVotes = JSON.stringify(user.pollVotes);
    user.password = bcrypt.hashSync(user.password, 12);
    await User.insert(user).all();
    return res.status(201).send({ username: user.username });
}

export async function polls(req, res) {
    const all: Schemas.Poll[] = await Schemas.Poll.find() as any;
    const pollsWithSubjects: any = _.groupBy(all, b => b.pollName);
    _.forEach(
        _.keys(pollsWithSubjects), c =>
            pollsWithSubjects[c] = _.map(pollsWithSubjects[c], d => pollsWithSubjects[c] = d.subjectName
            )
    );
    return res.status(200).send(pollsWithSubjects);
}

export async function addPoll(req, res) {
    const { pollName, subjects } = req.body;
    const subjectsNames = subjects.split(' ').join('').split(',');
    const polls = _.map(subjectsNames, subjectName => {
        return {
            pollName,
            subjectName
        }
    });
    const existingPoll = await Schemas.Poll.findOne({ pollName });
    if (existingPoll) {
        return res.status(400).send({ message: 'Poll already exists' });
    }
    const users: User[] = await User.select().all();
    const queries = _.map(users, user => {
        let pollVotes = JSON.parse(user.pollVotes as string);
        pollVotes[pollName] = 0;
        pollVotes = JSON.stringify(pollVotes);
        return User.update({ pollVotes }).where(User.embg.equals(user.embg)).exec();
    });
    queries.push(Schemas.Poll.insertMany(polls));
    try {
        await Promise.all(queries);
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Something is wrong' });
    }
    return res.status(201).send({ message: `Successfully added ${pollName}` });
}

export async function vote(req, res) {
    const { pollName, subjectName, embg } = req.body;
    try {
        const user: User = await User.select(User.pollVotes).where(User.embg.equals(embg)).get();
        if (user) {
            user.pollVotes = JSON.parse(user.pollVotes as string);
            if (user.pollVotes[pollName] === 0) {
                user.pollVotes[pollName]++;
                const pollSubject: Schemas.Poll = await Schemas.Poll.findOne({ subjectName, pollName }) as any;
                pollSubject.voteCount++;
                await Schemas.Poll.updateOne({ subjectName, pollName }, pollSubject);
                await User.update({ pollVotes: JSON.stringify(user.pollVotes) }).where(User.embg.equals(embg)).exec();
            } else {
                return res.status(406).send({ message: 'User has no votes remaining for that Poll' });
            }
        } else {
            return res.status(400).send({ message: 'User does not exist' });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Something is wrong' });
    }
    return res.status(200).send({ message: 'Vote successfull' });
}
