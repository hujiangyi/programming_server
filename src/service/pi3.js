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
exports.addaction = function (req, res, next) {
    let actions = [
        {pinPhy:3,power:gpio.HIGH},
        {pinPhy:11,power:gpio.HIGH},
    ];
    gpio.doAction(actions)
    // let allState = gpio.readAllPinState();
    // utils.end(req,next,{
    //     isSuccess : true,
    //     pinState : JSON.stringify(allState)
    // });
    utils.end(req,next,{
        isSuccess : true,
    });
};
exports.deleteaction = function (req, res, next) {
    let allState = gpio.readAllPinState();
    console.log(allState)
    // utils.end(req,next,{
    //     isSuccess : true,
    //     pinState : JSON.stringify(allState)
    // });
    utils.end(req,next,{
        isSuccess : true,
    });
};
exports.doaction = function (req, res, next) {
    const actionId = req.body.actionId;
    let query = model.actionlist.findById(actionId);
    query.exec(function (err,doc) {
        let re = {};
        if(doc === undefined || doc === null){
            re = {
                isSuccess : false,
            };
        } else {
            const actions = doc.get("actionList");
            gpio.doAction(actions);
            re = {
                isSuccess : true,
            };
        }

        utils.end(req,next,re);
    });
};
