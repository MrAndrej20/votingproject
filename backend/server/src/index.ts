process.env.adminUser = 'root';
process.env.adminPass = 'root';
import express = require('express');
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');
import https = require('https');
import * as fs from 'fs';
// import path = require('path');
// import migrations = require('anydb-sql-migrations');
import mongoose = require('mongoose');
import routes = require('./routes/index');
import config = require('./config');
import * as path from "path";
// import * as db from './lib/base';

const app = express();

const options = {
    key: fs.readFileSync(path.join(__dirname, '../../../certs/server.key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../../../certs/server.cert.pem')),
    passphrase: "eximon107"
};
mongoose.connect(config.mongodbEndpoint, { useNewUrlParser: true }).catch(err => {
    console.log('Error connecting to mongoose endpoint', config.mongodbEndpoint);
    console.log(err);
});

// Migrations
// try {
//     var migrationDir = path.resolve(__dirname, './migrations');
//     console.log('Migrations with database', config.mysql.url);
//     migrations.create(db, migrationDir).run();
// } catch (err) {
//     console.log('Test');
//     console.log(err);
// }
// ============


app.disable('x-powered-by');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://localhost:3443');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'x-auth-header');
    return next();
});
app.use(routes);

https.createServer(options, app).listen(config.port, () => console.log("Server Started"));
