const config = require('config');
const mongoose = require("mongoose");

const mongodbip = config.get('licensesdb.ip');
const mongodbport = config.get('licensesdb.port');
const mongodbname = config.get('licensesdb.db');
const mongodbusername = config.get('licensesdb.username');
const mongodbpassword = config.get('licensesdb.password');

const url = "mongodb://" +  mongodbusername + ":" + mongodbpassword + "@" + mongodbip + ":" + mongodbport + "/" + mongodbname;
const db = mongoose.createConnection(url);
db.on('error', console.error.bind(console, '... connect licensesdb error ...'));
db.once('open', function callback() {
    console.info("... db open licensesdb ...");
});
module.exports = db;