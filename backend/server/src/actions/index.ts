import Schemas = require("../schema");
import jwt = require("jsonwebtoken");
// import { Entropy } from "entropy-string";

export ={
    verifyToken: (req, res, next) => {
        if (!req.headers.cookie) {
            if (req.route.path === "/" || req.route.path === "/login" || req.route.path === "/register") next();
            else {
                console.log("No cookies, redirecting to /");
                res.status(403).redirect("/");
            }
        }
        else {
            const mycookie = req.headers.cookie.split(";");
            var thetoken;
            mycookie.forEach(cookie => {
                if (cookie.indexOf("Bearer") != -1) thetoken = cookie.split("=")[1];
            });
            if (!thetoken) {
                if (req.route.path === "/" || req.route.path === "/login" || req.route.path === "/register") next();
                else {
                    console.log("No token, redirecting to /");
                    res.status(403).redirect("/");
                }
            }
            else {
                jwt.verify(thetoken, "6q74m4G6frHL6RTd", (err, data) => {// should use entropy-string
                    if (err) {
                        if (req.route.path === "/" || req.route.path === "/login" || req.route.path === "/register") next();
                        else {
                            console.log("Token invalid, redirecting to /");
                            res.status(403).redirect("/");
                        }
                    }
                    else {
                        if (req.route.path === "/" || req.route.path === "/login" || req.route.path === "/register") {
                            console.log("Token valid, redirecting to /vote");
                            res.status(200).redirect("/vote");
                        }
                        else {
                            res.locals.data = data;
                            res.locals.token = thetoken;
                            next();
                        }
                    }
                });
            }
        }
    },
    register: (req, res) => {
        if (!req.body.embg) {
            console.log("EMBG missing");
            res.status(400).send("EMBG required");
        }
        else if (!req.body.password) {
            console.log("Password missing");
            res.status(400).send("Password required");
        }
        else {
            Schemas.User.findOne({ embg: req.body.embg })
                .then(user => {
                    if (user != null) {
                        console.log("EMBG taken");
                        res.status(400).send("EMBG taken");
                    }
                    else {
                        Schemas.User.create({ embg: req.body.embg, password: req.body.password, voteCount: 0 })
                            .then(x => {
                                console.log("User registered, redirecting to /login with data");
                                res.redirect(307, "/login");
                            })
                    }
                })
        }
    },
    login: (req, res) => {
        Schemas.User.findOne({ embg: req.body.embg })
            .then((user: any) => {
                if (user !== null && user.validPassword(req.body.password)) {
                    var token = jwt.sign({
                        embg: req.body.embg,
                        id: user.id
                    },
                        "6q74m4G6frHL6RTd"// should use entropy-string
                    );
                    res.cookie("Bearer", token);
                    res.redirect("/vote");
                }
                else {
                    console.log("Username or Password is incorrect");
                    res.status(400).send("Username or Password is incorrect");
                }
            });
    },
    vote: async (req, res) => {
        console.log(req.body);
        if (req.body.brand === "mercedes" || "bmw" || "audi") {
            const user = await findInDB("User", res.locals.data.embg).then(x => { return x });
            if (user) {
                if (user.validVote(user.voteCount)) {
                    const subject = await findInDB("Vote", req.body.brand).then(x => { return x; });
                    console.log(subject);
                    const saved = await updateDB("Vote", req.body.brand, { subjectCount: (Number(subject.subjectCount) + 1) });
                    console.log(saved);
                    const updated = await updateDB("User", user.embg, { voteCount: (Number(user.voteCount) + 1) });
                    console.log("Vote saved");
                    res.status(200).send("Vote Saved");
                }
                else {
                    console.log("No votes remaining");
                    res.status(400).send("No votes remaining");
                }
            }
            else {
                console.log("User not found");
                res.status(400).send("User not found");
            }
        }
        else {
            console.log("Error on voting");
            res.status(400).send("ERROR ON VOTING");
        }

    },
    logout: (req, res) => {
        res.clearCookie('Bearer');
        res.redirect('/');
    }
};

function findInDB(table, what) {
    if (table === "Vote") return Schemas[table].findOne({ subjectName: what })
    if (table === "User") return Schemas[table].findOne({ embg: what })
}
function updateDB(table, who, change) {
    if (table === "Vote") return Schemas[table].update({ subjectName: who }, change).then(x => { return x; });
    if (table === "User") return Schemas[table].update({ embg: who }, change).then(x => { return x; });
}
