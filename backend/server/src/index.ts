import express = require("express");
import bodyParser = require("body-parser");
import path = require('path');
import migrations = require('anydb-sql-migrations');
import mongoose = require("mongoose");
import routes = require("./routes/index");
import config = require('./config');
import * as db from './lib/base';
const app = express();

mongoose.connect(config.mongodbEndpoint, { useNewUrlParser: true }).catch(err => {
    console.log("Error connecting to mongoose endpoint", config.mongodbEndpoint);
    console.log(err);
});

// Migrations
// try {
//     var migrationDir = path.resolve(__dirname, './migrations');
//     console.log("Migrations with database", config.mysql.url);
//     migrations.create(db, migrationDir).run();
// } catch (err) {
//     console.log("Test");
//     console.log(err);
// }
// ============


app.disable('x-powered-by');
app.use(bodyParser.urlencoded({ extended: true }));
app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    return next();
});
app.use(routes);

app.listen(config.port, () => console.log("Server started!"));
