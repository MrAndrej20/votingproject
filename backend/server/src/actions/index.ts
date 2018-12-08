import Schemas = require("../schema");
import jwt = require("jsonwebtoken");
import _ = require("lodash");
import config = require("../config");

function isStart(path) {
    return (path === "/" || path === "/login" || path === "/register");
}

function findInDB(table, what) {
    if (table === "Vote") return Schemas[table].findOne({ subjectName: what })
    if (table === "User") return Schemas[table].findOne({ embg: what })
}

async function updateDB(table, who, change) {
    if (table === "Vote") return Schemas[table].update({ subjectName: who }, change);
    if (table === "User") return Schemas[table].update({ embg: who }, change);
}

function getToken(cookies: string[]): string {
    const token = _.find(cookies, cookie => {
        return cookie.includes("Bearer");
    });
    return token ? _.last(token.split("=")) : token;
}

export function bodyHas(...parameterNames: string[]) {
    return (req, res, next) => {
        const missingParameter = _.filter(parameterNames, parameterName => !_.get(req.body, parameterName));
        if (missingParameter.length) {
            return res.status(400).send(`Missing POST parameter: ${missingParameter}`);
        }
        else {
            return next();
        }
    };
}

export function verifyToken(req, res, next) {
    if (!req.headers.cookie) {
        if (isStart(req.route.path)) return next();
        console.log("No cookies, redirecting to /");
        return res.status(403).redirect("/");
    }
    const cookies = req.headers.cookie.split(";");
    const token = getToken(cookies);
    if (!token) {
        if (isStart(req.route.path)) return next();
        console.log("No token, redirecting to /");
        return res.status(403).redirect("/");
    }
    return jwt.verify(token, config.JWTsecret, (err, data) => {
        if (err) {
            if (isStart(req.route.path)) return next();
            console.log("Token invalid, redirecting to /");
            return res.status(403).redirect("/");
        }
        if (isStart(req.route.path)) {
            console.log("Token valid, redirecting to /vote");
            return res.status(200).redirect("/vote");
        }
        res.locals = { data, token };
        return next();
    });

}
export async function register(req, res) {
    const user = await Schemas.User.findOne({ embg: req.body.embg });
    if (user) {
        console.log("EMBG taken");
        res.status(400).send("EMBG taken");
    }
    else {
        await Schemas.User.create({ embg: req.body.embg, password: req.body.password, voteCount: 0, region: "test" })
        console.log("User registered, redirecting to /login with data");
        res.status(201).send("/login");
    }
}
export async function login(req, res) {
    const user: any = await Schemas.User.findOne({ embg: req.body.embg });
    if (!(user && user.validPassword(req.body.password))) {
        console.log("Username or Password are incorrect");
        res.status(400).send("Username or Password are incorrect");
    }
    else {
        var token = jwt.sign({
            embg: req.body.embg,
            id: user.id
        },
            config.JWTsecret
        );
        res.cookie(`user=${user}`);// send username
        res.status(200).send("Login Successful");
    }
}
export async function vote(req, res) {
    if (!(req.body.brand === "mercedes" || "bmw" || "audi")) {
        console.log("Error on voting");
        res.status(400).send("ERROR ON VOTING");
    }
    else {
        const user = await findInDB("User", res.locals.data.embg);
        if (!user) {
            console.log("User not found");
            res.status(400).send("User not found");
        }
        else {
            if (!user.validVote(user.voteCount)) {
                console.log("No votes remaining");
                res.status(400).send("No votes remaining");
            }
            else {
                const subject = await findInDB("Vote", req.body.brand);
                console.log(subject);
                const saved = await updateDB("Vote", req.body.brand, { subjectCount: (Number(subject.subjectCount) + 1) });
                console.log(saved);
                const updated = await updateDB("User", user.embg, { voteCount: (Number(user.voteCount) + 1) });
                console.log("Vote saved");
                res.status(200).send("Vote Saved");
            }
        }
    }
}
