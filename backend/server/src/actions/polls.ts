import Schemas = require('../schema');
import _ = require('lodash');
import { User } from '../entities/all';

export async function getPolls(req, res) {
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
        if (!user) {
            return res.status(400).send({ message: 'User does not exist' });
        }
        user.pollVotes = JSON.parse(user.pollVotes as string);
        if (user.pollVotes[pollName] !== 0) {
            return res.status(406).send({ message: 'User has no votes remaining for that Poll' });
        }
        user.pollVotes[pollName]++;
        const pollSubject: Schemas.Poll = await Schemas.Poll.findOne({ subjectName, pollName }) as any;
        pollSubject.voteCount++;
        await Schemas.Poll.updateOne({ subjectName, pollName }, pollSubject);
        await User.update({ pollVotes: JSON.stringify(user.pollVotes) }).where(User.embg.equals(embg)).exec();
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Something is wrong' });
    }
    return res.status(200).send({ message: 'Vote successfull' });
}
