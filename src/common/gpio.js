const Gpio = require('pigpio').Gpio;

//phy pin num
// const excludepin = [1,2,4,6,9,14,17,20,25,30,34,39];

const LOW = 0;
exports.LOW = LOW;
const HIGH = 1;
exports.HIGH = HIGH;

const bcmNum = [null,null,2,null,3,null,4,14,null,15,17,18,27,null,22,23,null,24,10,null,9,25,11,8,null,7,0,1,5,null,6,12,13,null,19,16,26,20,null,21];
const gpio = [];
function initGpio() {
    for (let i = 0 ; i < 40 ; i++) {
        let bcmCode = bcmNum[i];
        if (bcmCode !== null) {
            gpio[i] = new Gpio(bcmCode, {mode: Gpio.OUTPUT});
        } else {
            gpio[i] = null;
        }
    }
}
exports.initGpio = initGpio;

function printBcmCode() {
    let row = "";
    for (let i = 0 ; i < 40 ; i++) {
        if (i % 2 === 0) {
            row = row + bcmNum[i] + "\t";
        } else if (i % 2 === 1) {
            row = row + bcmNum[i] + "\n"
        }
    }
    console.log(row);
}
exports.printBcmCode = printBcmCode;

function getGpioByPhyCode(phy) {
    if (gpio.length === 0) {
        initGpio()
    }
    return gpio[phy -1];
}
exports.getGpioByPhyCode = getGpioByPhyCode;

function readAllPinState() {
    if (gpio.length === 0) {
        initGpio()
    }
    let states = [];
    for (let i = 0; i < 40; i++) {
        let pin = gpio[i];
        if (pin !== null) {
            states[i] = pin.digitalRead();
        } else {
            states[i] = null;
        }
    }
    return states;
}
exports.readAllPinState = readAllPinState;

function resetAllPinState() {
    if (gpio.length === 0) {
        initGpio()
    }
    for (let i = 0; i < 40; i++) {
        let pin = gpio[i];
        if (pin !== null) {
            pin.digitalWrite(LOW);
        }
    }
}
exports.resetAllPinState = resetAllPinState;

function doAction(actions) {
    if (gpio.length === 0) {
        initGpio()
    }
    actions.forEach(function (action, index) {
        let pin = getGpioByPhyCode(action.phyNum);
        if (pin !== null) {
            pin.digitalWrite(action.power);
        }
    });
}
exports.doAction = doAction;
