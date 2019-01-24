const config = require('config');
const mongoose = require("mongoose");

const mongodbip = config.get('raspberrydb.ip');
const mongodbport = config.get('raspberrydb.port');
const mongodbname = config.get('raspberrydb.db');
const mongodbusername = config.get('raspberrydb.username');
const mongodbpassword = config.get('raspberrydb.password');

const url = "mongodb://" +  mongodbusername + ":" + mongodbpassword + "@" + mongodbip + ":" + mongodbport + "/" + mongodbname;
const db = mongoose.createConnection(url);
db.on('error', console.error.bind(console, '... connect raspberrydb error ...'));
db.once('open', function callback() {
    console.info("... db open raspberrydb ...");
});
module.exports = db;