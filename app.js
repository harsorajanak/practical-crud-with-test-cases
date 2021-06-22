var express = require('express');
var config = require('./config/config');
var index = require('./routes/index');
const formidable = require('express-formidable');
const cors = require('cors');
var app = express();
var mongoose = require("mongoose");

//database connection
mongoose.connect('mongodb://' + config.database.host + '/' + config.database.db_name, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
    //console.log("database connected successfully");
}).catch(err => {
    console.error("App starting error:", err.message);
    process.exit(1);
});

// express app configurations
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(formidable());
app.use(cors());
app.use('/', index);

// Server
const port = config.port;
app.listen(port, () => {
    console.log(`Listening on: http://localhost:${port}`);
});

module.exports = app