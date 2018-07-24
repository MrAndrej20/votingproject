// import nf=require("node-forge");
// const md1=nf.md.sha512.create();
// md1.update("Testing");
// const hex1=md1.digest().toHex();
// const md2=nf.md.sha512.create();
// md2.update("Testing");
// const hex2=md2.digest().toHex();
// console.log(hex1);
// console.log(hex2);
// console.log(hex1===hex2);
const mongoose = require("mongoose");
const Schemas = require("../server/src/schema");
function findInDB(table, what) {
    mongoose.connect("mongodb://127.0.0.1:27017/votedb");
    if (table === "Vote") return Schemas[table].findOne({ subjectName: what }).then(x => {
        return x;
    });
    if (table === "User") return Schemas[table].findOne({ embg: what }).then(x => {
        return x;
    });
}
function updateDB(table, who, change) {
    if (table === "Vote") return Schemas[table].update({ subjectName: who }, change).then(x => {return x;});
    if (table === "User") return Schemas[table].update({ embg: who }, change).then(x => {return x;});
}
console.log("1");
async function vote(embg, option) {
    console.log("2");
    const x = await findInDB("User", embg)
    console.log(x);
    const z=await updateDB("User", embg, { voteCount: 0 });
    console.log(z);
    mongoose.disconnect();
    // Schemas.User.findOne({ embg: res.locals.data.embg }).then((user: any) => {
    //     if (user === null) res.status(400).send("User not found");
    //     else {
    //         if (user.validVote(user.voteCount))
    //             saveToDB(req.body.option).then((x) => {
    //                 Schemas.User.update({ embg: res.locals.data.embg }, { voteCount: (user.voteCount + 1) }).then(() => {
    //                     res.clearCookie("Bearer");
    //                     res.status(200).send(x);
    //                 });
    //             });
    //         else res.status(400).send("NO VOTES REMAINING");
    //     }
    // });
}
vote("123", "bmw");
