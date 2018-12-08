import express = require("express");
import bodyParser = require("body-parser");
import mongoose = require("mongoose");
import routes = require("./routes/index");
import config = require('./config');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(async (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    if (!mongoose.connection.readyState) {
        try {
            await mongoose.connect(config.mongodbEndpoint);
        }
        catch (err) {
            console.log("Error connecting to mongoose endpoint", config.mongodbEndpoint);
            console.log(err);
        }
    }
    return next();
});

app.use(routes);

app.listen(config.port, () => console.log("Server started!"));
