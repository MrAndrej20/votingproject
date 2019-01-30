import https = require('https');
import express = require('express');
import * as fs from 'fs';
import * as path from 'path';
const options = {
    key: fs.readFileSync(path.join(__dirname, '../../certs/server.key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../../certs/server.cert.pem')),
    passphrase: "eximon107"
};



const app = express();
app.use(express.static(path.join(__dirname, "../../../frontend/build")));
app.use("*", (req, res) => { return res.redirect('/') });
https.createServer(options, app).listen(3443, () => console.log("Serve Server Started"));
