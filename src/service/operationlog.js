const moment = require('moment');
const model = require('../db/schema.js');
const utils = require('../common/utils.js');

exports.loadOperationLogList = function (req, res) {
    // let query = {};
    // if (req.body.startTime) {
    //     let start = new moment(parseInt(req.body.startTime));
    //     if (req.body.endTime) {
    //         let end = new moment(parseInt(req.body.startTime));
    //         query.createTime= {$gte: start.toISOString() , $lt: end.toISOString()};
    //     } else {
    //         query.createTime= {$gte: start.toISOString()};
    //     }
    // }
    // if (req.body.userName) {
    //     query.user =
    // }
    let list = model.operationlog.find({});
    if (req.body.startTime) {
        let start = new moment(parseInt(req.body.startTime));
        list = list.where('createTime').gte(start.toISOString());
    }
    if (req.body.endTime) {
        let end = new moment(parseInt(req.body.startTime));
        list = list.where('createTime').lt(end.toISOString());
    }
    if (req.body.userName) {
        const reg=new RegExp(req.body.userName,'i');
        list = list.where('user').regex(reg);
    }
    if (req.body.ipAddress) {
        const reg=new RegExp(req.body.ipAddress,'i');
        list = list.where('ipAddress').regex(reg);
    }
    if (req.body.batchNo) {
        const reg=new RegExp(req.body.batchNo,'i');
        list = list.where('batchNo').regex(reg);
    }
    if (req.body.state && req.body.state!=='-1') {
        let state = req.body.state === "0";
        list = list.where('state').equals(state);
    }
    let select  = list.select("user batchNo ipAddress operationLog state createTime");
    select.sort({_id: -1});
    select.exec(function (err, doc) {
        res.end(JSON.stringify(doc));
    });
};

exports.addOperationLog = function (req, res, next) {
    if (!req.re) {
        return
    }
    if (req.re.operationLog) {
        let user = req.session.user;
        let state = req.re.isSuccess;
        let operationLog = req.re.operationLog;
        let ipAddress = utils.getClientIp(req);
        let batchNo = req.re.batchNo;
        let date = new Date();
        let createTime = date.toLocaleDateString() + " " + date.toLocaleTimeString();
        let doc = new model.operationlog();
        doc.set("user",user);
        if (batchNo) {
            doc.set("batchNo",batchNo);
        }
        doc.set("ipAddress",ipAddress);
        doc.set("operationLog",operationLog);
        doc.set("state",state);
        doc.set("createTime",createTime);
        doc.save();
    }
    if (req.re.isSuccess) {
        res.send(JSON.stringify(req.re));
    } else {
        req.session.user = null;
        if (req.re.errorCode) {
            res.send(req.re.errorCode);
        } else {
            res.send(JSON.stringify(req.re));
        }
    }
};