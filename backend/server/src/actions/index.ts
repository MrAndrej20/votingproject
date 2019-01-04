// import Schemas = require("../schema");
import jwt = require("jsonwebtoken");
import _ = require("lodash");
import config = require("../config");
import { User } from '../entities/all';
// import * as bcrypt from 'bcrypt';

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
    if (req.headers['x-auth-header']) {
        try {
            jwt.verify(req.headers['x-auth-header'], config.JWTsecret);
        } catch (err) {
            return res.status(401).send({ message: "Unauthorized" });
        }
        return next();
    }
    return res.status(401).send({ message: "Unauthorized" });
}
export async function adminLogin(req, res) {
    const { username, password } = req.body;
    const { adminUser, adminPass } = process.env;
    if (username !== adminUser || password !== adminPass) {
        return res.status(401).send({ message: 'Wrong Credentials' });
    }
    const token = jwt.sign({

    }, config.JWTsecret);
    res.setHeader("x-auth-header", token);
    return res.status(200).send({ message: 'Done' });
}
export async function login(req, res) {
    // const password = req.body.password;
    // const user: User = await User.select(User.password).where(User.embg.equals(req.body.embg)).get();
    // if (_.isEmpty(user)) {
    //     return res.status(400).send({ message: 'EMBG doesn\'t exit' });
    // }
    // if (!bcrypt.compareSync(password, user.password)) {
    //     return res.status(400).send({ message: 'Bad Password' });
    // };
    return res.status(200).send({ message: 'Done' });
}
export async function register(req, res) {
    const user: User = {
        id: null,
        embg: req.body.embg,
        username: req.body.username,
        password: req.body.password,
        voteCount: 0
    };
    // const existingUser: User = await User.where(User.embg.equals(req.body.embg)).get();
    // if (_.isEmpty(existingUser)) {
    //     user.password = bcrypt.hashSync(user.password, 12);
    //     await User.insert(user).all();
    //     return res.status(201).send({ username: user.username });
    // }
    return res.status(400).send({ message: "EMBG Already Taken" });
}

export async function polls(req, res) {
    // const all: Schemas.Poll[] = await Schemas.Poll.find() as any;
    // const pollsWithSubjects: any = _.groupBy(all, b => b.pollName);
    // _.forEach(
    //     _.keys(pollsWithSubjects), c =>
    //         pollsWithSubjects[c] = _.map(pollsWithSubjects[c], d => pollsWithSubjects[c] = d.subjectName
    //         )
    // );
    // return res.status(200).send(pollsWithSubjects);
    return res.status(200).send({ message: "done" });
}

export async function vote(req, res) {
    // const { pollName, subjectName } = req.body;
    // try {
    //     const pollSubject: Schemas.Poll = await Schemas.Poll.findOne({ subjectName, pollName }) as any;
    //     pollSubject.voteCount++;
    //     await Schemas.Poll.updateOne({ subjectName, pollName }, pollSubject);
    // } catch (err) {
    //     console.log(err);
    //     return res.status(500).send({ message: 'Something is wrong' });
    // }
    return res.status(200).send({ message: 'Done' });
}
