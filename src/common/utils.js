const fs = require('fs');
const crypto = require('crypto');

exports.checkSessionTime = function (req, res,next) {
    if (req.baseUrl === '/api/login') {
        next();
    } else {
        if (req.session.user) {
            next()
        } else {
            res.send(401);
        }
    }
};

exports.end = function(req,next,data) {
    req.re = data;
    next()
};

function md5str(str) {
    let md5 = crypto.createHash('md5');
    md5.update(str);
    return md5.digest('hex');
}
exports.md5str=md5str;

function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
}
exports.getClientIp=getClientIp;