import Schemas = require("../schema");
import jwt = require("jsonwebtoken");
// import { Entropy } from "entropy-string";
// push to db every 10 votes
export ={
    verifyToken: (req, res, next) => {
        if (!req.headers.cookie) {
            if (req.route.path === "/" || req.route.path === "/login" || req.route.path === "/register") return next();
            console.log("No cookies, redirecting to /");
            return res.status(403).redirect("/");

        }
        const mycookie = req.headers.cookie.split(";");
        var thetoken;
        mycookie.forEach(cookie => {
            if (cookie.indexOf("Bearer") != -1) thetoken = cookie.split("=")[1];
        });
        if (!thetoken) {
            if (req.route.path === "/" || req.route.path === "/login" || req.route.path === "/register") return next();
            console.log("No token, redirecting to /");
            return res.status(403).redirect("/");
        }
        jwt.verify(thetoken, "6q74m4G6frHL6RTd", (err, data) => {// should use entropy-string
            if (err) {
                if (req.route.path === "/" || req.route.path === "/login" || req.route.path === "/register") return next();
                console.log("Token invalid, redirecting to /");
                return res.status(403).redirect("/");
            }
            if (req.route.path === "/" || req.route.path === "/login" || req.route.path === "/register") {
                console.log("Token valid, redirecting to /vote");
                return res.status(200).redirect("/vote");
            }
            res.locals.data = data;
            res.locals.token = thetoken;
            return next();

        });

    },
    register: (req, res) => {
        console.log("###", req.body);
        if (!req.body.embg) {
            console.log("EMBG missing");
            return res.status(400).send("EMBG required");
        }
        if (!req.body.password) {
            console.log("Password missing");
            return res.status(400).send("Password required");
        }
        Schemas.User.findOne({ embg: req.body.embg })
            .then(user => {
                if (user != null) {
                    console.log("EMBG taken");
                    res.status(400).send("EMBG taken");
                }
                else {
                    Schemas.User.create({ embg: req.body.embg, password: req.body.password, voteCount: 0, region: "test" })
                        .then(x => {
                            console.log("User registered, redirecting to /login with data");
                            res.redirect(307, "/login");
                        })
                }
            })
    },
    login: (req, res) => {
        Schemas.User.findOne({ embg: req.body.embg })
            .then((user: any) => {
                if (!(user !== null && user.validPassword(req.body.password))) {
                    console.log("Username or Password is incorrect");
                    res.status(400).send("Username or Password is incorrect");
                }
                else {
                    var token = jwt.sign({
                        embg: req.body.embg,
                        id: user.id
                    },
                        "6q74m4G6frHL6RTd"// should use entropy-string
                    );
                    res.cookie("Bearer", token);
                    res.redirect("/vote");
                }
            });
    },
    vote: async (req, res) => {
        console.log(req.body);
        if (!(req.body.brand === "mercedes" || "bmw" || "audi")) {
            console.log("Error on voting");
            res.status(400).send("ERROR ON VOTING");
        }
        else {
            const user = await findInDB("User", res.locals.data.embg).then(x => { return x });
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
                    const subject = await findInDB("Vote", req.body.brand).then(x => { return x; });
                    console.log(subject);
                    const saved = await updateDB("Vote", req.body.brand, { subjectCount: (Number(subject.subjectCount) + 1) });
                    console.log(saved);
                    const updated = await updateDB("User", user.embg, { voteCount: (Number(user.voteCount) + 1) });
                    console.log("Vote saved");
                    res.status(200).send("Vote Saved");
                }
            }
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
