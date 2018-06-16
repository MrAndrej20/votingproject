import Schemas = require("../schema");
import jwt = require("jsonwebtoken");
export ={
    verifyToken: (req, res, next) => {
        if (!req.headers.cookie) {
            if (req.route.path === "/" || req.route.path === "/login" || req.route.path === "/register") next();
            else res.status(403).redirect("/");
        }
        else {
            const mycookie = req.headers.cookie.split(";");
            var thetoken;
            mycookie.forEach(cookie => {
                if (cookie.indexOf("Bearer") != -1) thetoken = cookie.split("=")[1];
            });
            if (!thetoken) {
                if (req.route.path === "/" || req.route.path === "/login" || req.route.path === "/register") next();
                else res.status(403).redirect("/");
            }
            else {
                jwt.verify(thetoken, "tajna", (err, data) => {
                    if (err) {
                        if (req.route.path === "/" || req.route.path === "/login" || req.route.path === "/register") next();
                        else res.status(403).redirect("/");
                    }
                    else {
                        if (req.route.path === "/" || req.route.path === "/login" || req.route.path === "/register")
                            res.status(200).redirect("/vote");
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
        if (!req.body.embg) res.status(400).send("EMBG required");
        else if (!req.body.password) res.status(400).send("Password required");
        else {
            Schemas.User.findOne({ embg: req.body.embg })
                .then(user => {
                    if (user != null) res.status(400).send("EMBG taken");
                    else {
                        Schemas.User.create({ embg: req.body.embg, password: req.body.password, voteCount: 0 })
                            .then(x => {
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
                        "tajna"
                    );
                    res.cookie("Bearer", token);
                    res.redirect("/vote");
                }
                else res.status(400).send("Username or Password is incorrect");
            });
    },
    vote: (req, res) => {
        if (req.body.option === "mercedes" || "bmw" || "audi") {
            Schemas.User.findOne({ embg: res.locals.data.embg }).then((user: any) => {
                if (user === null) res.status(400).send("User not found");
                else {
                    if (user.validVote(user.voteCount))
                        saveToDB(req.body.option).then((x) => {
                            Schemas.User.update({embg:res.locals.data.embg},{voteCount:(user.voteCount+1)}).then(()=>{
                                res.clearCookie("Bearer");
                                res.status(200).send(x);

                            });
                        });
                    else res.status(400).send("NO VOTES REMAINING");
                }
            });
        }
        else {
            res.clearCookie("Bearer");
            res.status(400).send("ERROR ON VOTING");
        }

    }
};
function saveToDB(subject) {
    return Schemas.Vote.findOne({ subjectName: subject }).then((vote: any) => {
        Schemas.Vote.update({ subjectName: subject }, { subjectCount: (Number(vote.subjectCount) + 1) }).then((err) => {
            if (err) return "Vote Not Saved";
            else return "Vote Saved";
        });
    });
}