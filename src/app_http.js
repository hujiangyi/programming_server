const express    = require('express');
const config = require('config');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const fs = require('fs');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const log4js = require('./common/logger.js');
const utils = require('./common/utils.js');
const login = require('./service/login.js');
const operationlog = require('./service/operationlog.js');
const pi3 = require('./service/pi3.js');

let app        = express();
let logger = log4js.getLogger();
log4js.useLogger(app,logger);

let port = config.get('http.port') || 8080;

app.set('port', port);
app.use(express.static(path.join(__dirname,'../face')));
app.use(bodyParser());
app.use(methodOverride());
app.get('/',function(req,res){
    res.sendFile('index.html')
});
app.use(cookieParser());
app.use(session({
    secret:'raspberry',
    name:'programming_server',
    resave:false,
    saveUninitialized : true
}));

app.use("*", function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Content-Type");
    response.header("Access-Control-Allow-Methods","POST,GET,OPTIONS");
    response.header("Access-Control-Allow-Credentials",true);
    response.header("X-Powered-By",' 3.2.1');
    response.header("Content-Type","application/json;charset=utf-8" );
    if(response.method==="OPTIONS") response.send(200);
    else  next();
});
app.use("*", utils.checkSessionTime);

app.post('/api/login', login.login);
app.post('/api/modifyPassword', login.modifyPassword);
app.post('/api/loadOperationLogList', operationlog.loadOperationLogList);
app.post('/api/loadpinstate', pi3.loadpinstate);
app.post('/api/resetpin', pi3.resetpin);
app.post('/api/loadactions', pi3.loadactions);
app.post('/api/addaction', pi3.addaction);
app.post('/api/deleteaction', pi3.deleteaction);
app.post('/api/doaction', pi3.doaction);

app.use("*", operationlog.addOperationLog);
app.listen(port);
console.log("start at port:" + port);