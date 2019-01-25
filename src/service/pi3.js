const model = require('../db/schema.js');
const utils = require('../common/utils.js');
const gpio = require('../common/gpio.js');

exports.loadpinstate = function (req, res, next) {
    let allState = gpio.readAllPinState();
    utils.end(req,next,{
        isSuccess : true,
        pinstate : allState
    });
};
exports.resetpin = function (req, res, next) {
    gpio.resetAllPinState();
    let allState = gpio.readAllPinState();
    utils.end(req,next,{
        isSuccess : true,
        pinState : allState
    });
};
exports.loadactions = function (req, res, next) {
    let select = model.actions.find({});
    select.sort({_id: -1});
    select.exec(function (err, doc) {
        utils.end(req,next,{
            isSuccess : true,
            actions : doc
        });
    });
};
exports.addaction = function (req, res, next) {
    const name = req.body.name;
    const actions = req.body.actions;
    let user = new model.actions();
    user.set("name",name);
    user.set("actionList",actions);
    user.markModified("actionList");
    user.save(function (err, doc) {
        let re = {
            isError:false,
            isSuccess : true,
        };
        if (err) {
            re.isError = true;
            re.error = err;
            utils.end(req,next,re);
        } else {
            re.isError = false;
            utils.end(req,next,re);
        }
    });
};
exports.deleteaction = function (req, res, next) {
    const actionId = req.body.actionId;
    let query = model.actions.findById(actionId);
    query.remove().exec(function (err, doc) {
        let re = {
            isError:false,
            isSuccess : true,
        };
        if (err) {
            re.isError = true;
            re.error = err;
            utils.end(req,next,re);
        } else {
            re.isError = false;
            utils.end(req,next,re);
        }
    });
};
exports.doaction = function (req, res, next) {
    const actionId = req.body.actionId;
    let query = model.actions.findById(actionId);
    query.exec(function (err,doc) {
        let re = {};
        if(doc === undefined || doc === null){
            console.log("here 111");
            re = {
                isSuccess : false,
            };
        } else {
            console.log("here 222");
            const actions = doc.get("actionList");
            console.log("here 222 ：" + actions);
            gpio.doAction(actions);
            re = {
                isSuccess : true,
            };
        }

        utils.end(req,next,re);
    });
};
