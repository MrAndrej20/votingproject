import https = require('https');
import express = require('express');
import * as fs from 'fs';
const options = {
    key: fs.readFileSync('/Users/andrej-macbookair/Downloads/151109.key.pem'),
    cert: fs.readFileSync('/Users/andrej-macbookair/Downloads/G7ca.cert.pem'),
    passphrase: "eximon107"
};



const app = express();
app.use(express.static("../../../frontend/build"));
app.use("*", (req, res) => { return res.redirect('/') });
https.createServer(options, app).listen(3443, () => console.log("Serve Server Started"));
