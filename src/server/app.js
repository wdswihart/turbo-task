const https = require('https');
const express = require('express');
const helmet = require('helmet');
const fs = require('fs');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/turbo-task', 
        { useNewUrlParser: true });
require('./models/user');
require('./models/list');
require('./models/task');
require('./models/description');
require('./passport');
const api = require('./api');

const app = express();
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use((req, res, next) => {
    if (req.secure) {
        next();
    } else {
        res.redirect('https://' + req.headers.host + req.url);
    }
});
app.use(express.static(path.resolve('./dist/turbo-task')));
app.use('/api', api);
app.get('*', (req, res) => {
    res.status(200).sendFile(path.resolve('./dist/turbo-task/index.html'));
});

const mode = 'develop';
const credentials = mode === 'develop' ? {
    cert: fs.readFileSync('./src/server/ssl/localhost.crt'),
    key: fs.readFileSync('./src/server/ssl/localhost.key')
} : {
    cert: fs.readFileSync('./src/server/ssl/fullchain.pem'),
    key: fs.readFileSync('./src/server/ssl/privkey.pem'),
    ca: fs.readFileSync('./src/server/ssl/chain.pem')
};
const port = 443;
https.createServer(credentials, app).listen(port, () => {
    console.log('HTTPS server started on port ' + port + '.');
});
