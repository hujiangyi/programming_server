const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = require('./db');

const userSchema = new Schema({
    userName: String,
    password: String,
    auth: String,
}, { collection: 'user'});
exports.user = db.model('user', userSchema);

const actionSchema = new Schema({
    bcmNum: Number,
    mode: Number,
    state: Number,
}, { _id:false});

const actionListSchema = new Schema({
    name: String,
    actionList: [
        actionSchema
    ]
}, { collection: 'actionlist'});
exports.actionlist = db.model('actionlist', actionListSchema);

const logsSchema = new Schema({
    log: String,
}, { collection: 'logs'});
exports.logs = db.model('logs', logsSchema);

const operationLogSchema = new Schema({
    user: String,
    ipAddress: String,
    batchNo: String,
    operationLog: String,
    state: Boolean,
    createTime: Date
}, { collection: 'operationlog'});
exports.operationlog = db.model('operationlog', operationLogSchema);
