import express = require("express");
import bodyParser = require("body-parser");
import mongoose = require("mongoose");
import routes = require("./routes/index");
import config = require('../../../config');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    if (!mongoose.connection.readyState)
        mongoose.connect("mongodb://127.0.0.1:27017/votedb").catch(err => {
            console.log("Error:", err.message);
        })
    next();
});
app.use(routes);
app.listen(config.port, () => console.log("Server started!"));
