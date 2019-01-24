const model = require('../db/schema.js');
const utils = require('../common/utils.js');
const gpio = require('../common/gpio.js');

exports.loadpinstate = function (req, res, next) {
    let allState = gpio.readAllPinState();
    utils.end(req,next,{
        isSuccess : true,
        pinState : JSON.stringify(allState)
    });
};
exports.resetpin = function (req, res, next) {
    gpio.resetAllPinState();
    let allState = gpio.readAllPinState();
    utils.end(req,next,{
        isSuccess : true,
        pinState : JSON.stringify(allState)
    });
};
exports.addaction = function (req, res, next) {
    let action = [
        {pinPhy:3,power:gpio.HIGH},
        {pinPhy:11,power:gpio.HIGH},
    ];
    gpio.doAction(actions)
    // let allState = gpio.readAllPinState();
    // utils.end(req,next,{
    //     isSuccess : true,
    //     pinState : JSON.stringify(allState)
    // });
};
exports.deleteaction = function (req, res, next) {
    let allState = gpio.readAllPinState();
    console.log(allState)
    // utils.end(req,next,{
    //     isSuccess : true,
    //     pinState : JSON.stringify(allState)
    // });
};
