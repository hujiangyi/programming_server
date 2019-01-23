const utils = require('../common/utils.js');
const model = require('../db/schema.js');
const errorCode = require('../common/errorCode.js');

exports.login = function (req, res,next) {
    const password = req.body.password;
    const userName = req.body.userName;
    req.session.user = userName;
    let query = model.user.findOne({"userName":userName});
    let select = query.select();
    select.exec(function (err,doc) {
        if(err){
            utils.end(req,next,{
                isSuccess : false,
                errorMsg : errorCode.C0004.msg + "[" + userName + "]",
                errorCode : errorCode.C0004.code,
                operationLog : "登录失败，" + errorCode.C0004.msg + "[" + userName + "]"+ err
            });
        } else {
            if (doc) {
                let pwd = doc.get("password");
                let auth = doc.get("auth");
                const passwordMd5 = utils.md5str(pwd);
                if (password === passwordMd5) {
                    utils.end(req,next,{
                        isSuccess: true,
                        currentAuthority: auth,
                        username: userName,
                        operationLog : "登录成功，[" + userName + "]"
                    });
                } else {
                    utils.end(req,next,{
                        isSuccess : false,
                        errorMsg : errorCode.C0006.msg,
                        errorCode : errorCode.C0006.code,
                        operationLog : "登录失败，" + errorCode.C0006.msg + "[" + userName + "]"
                    });
                }
            } else {
                utils.end(req,next,{
                    isSuccess : false,
                    errorMsg : errorCode.C0004.msg + "[" + userName + "]",
                    errorCode : errorCode.C0004.code,
                    operationLog : "登录失败，" + errorCode.C0004.msg + "[" + userName + "]"
                });
            }
        }
    });
};
exports.modifyPassword = function (req, res,next) {
    const sessionUser = req.session.user;
    const userName = req.body.userName;
    const password = req.body.password;
    if (sessionUser !== userName) {
        utils.end(req,next,{
            isSuccess : false,
            errorMsg : errorCode.C0005.msg + "[" + userName + "]",
            errorCode : errorCode.C0005.code,
            operationLog : "修改用户密码失败，" + errorCode.C0005.msg + "[" + userName + "]"
        });
        return;
    }
    let query = model.user.findOne({"userName":userName});
    let select = query.select();
    select.exec(function (err,doc) {
        if(err){
            utils.end(req,next,{
                isSuccess : false,
                errorMsg : errorCode.C0004.msg + "[" + userName + "]",
                errorCode : errorCode.C0004.code,
                operationLog : "修改用户密码失败，" + errorCode.C0004.msg + "[" + userName + "]"+ err
            });
        } else {
            if (doc) {
                doc.set("password",password);
                doc.save();
                utils.end(req,next,{
                    isSuccess : true,
                    operationLog : "修改用户密码成功，["+ userName + "]"
                });
            } else {
                utils.end(req,next,{
                    isSuccess : false,
                    errorMsg : errorCode.C0004.msg + "[" + userName + "]",
                    errorCode : errorCode.C0004.code,
                    operationLog : "修改用户密码失败，" + errorCode.C0004.msg + "[" + userName + "]"
                });
            }
        }
    });
};