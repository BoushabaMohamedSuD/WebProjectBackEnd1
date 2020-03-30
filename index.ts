import { DeviceInfos } from './proprieties/DevicesInfos';
import { SocketInfo } from './proprieties/SocketInfo';

import { RasberyId } from './proprieties/RasberyId';
export { };



import express from 'express';
import bodyParser from 'body-parser';
import { sequelize } from './Mysql/MysqlConnectivity';
import { RasberySql } from './Mysql/RasberySQL';



const RouterAuthenticate = require('./router/Authenticate').router;
const RouterUserInfo = require('./router/UserInfo').router;
const RouterRabsery = require('./router/RasberryRegistering').router;
const RouterTest = require('./router/TestJohhnyFive').router;
const RouterTestSQl = require('./router/TestSQL').router;
const RouterRabseryOperation = require('./router/RasberyOperations').router;
const RouterRabseryNotifications = require('./router/RasberyNotificationOperations').router;


const app = express();
//const five = require("johnny-five");


//const board = new five.Board();




//initializing the configuration
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Expose-Headers", "Username,Authorization,authorization,PictureData");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Authorization,Username,Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser({ extended: false }));
app.use('/images', express.static(__dirname + '/uploads/public/images'));
app.use(RouterAuthenticate);
app.use('/UserInfo', RouterUserInfo);
app.use('/Rasbery', RouterRabsery);
app.use('/RasberyOperation', RouterRabseryOperation);
app.use('/RasberyNotification', RouterRabseryNotifications);

app.use('/Test', RouterTest);
app.use('/TestSQl', RouterTestSQl);







// connect to board arduino
// board.on("ready", function () {
//     console.log("succes connect to arduino");
//     //creating databases
//     sequelize.sync(/*{ force: true }*/)
//         .then(() => {
//             //creating server
//             const server = app.listen(3000);
//             //::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
//             //Socket Integration and johnny-five


//             console.log("begin blink 500 ms");
//             var led = new five.Led(13);
//             led.blink(500);


//             //::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://

//         })
//         .catch((err) => {
//             console.log(err);
//             console.log("failed to create databases  or tables");
//         })

// });



/////////////////////////////////////////////////////////
var five = require("johnny-five"), lcd: any;
const { Board, Led } = require("johnny-five");


const board = new Board();

board.on("ready", function () {
    console.log("ready");

    lcd = new five.LCD({
        // LCD pin name  RS  EN  DB4 DB5 DB6 DB7
        // Arduino pin # 7    8   9   10  11  12
        pins: [7, 8, 9, 10, 11, 12],
        backlight: 6,
        rows: 2,
        cols: 20


        // Options:
        // bitMode: 4 or 8, defaults to 4
        // lines: number of lines, defaults to 2
        // dots: matrix dimensions, defaults to "5x8"
    });

    const led = new Led.RGB({
        pins: {
            red: 6,
            green: 5,
            blue: 3
        }
    });


    const servo = new five.Servo(13);

    // Tell the LCD you will use these characters:
    console.log("lcd begin");
    lcd.useChar("check");
    lcd.useChar("heart");
    lcd.useChar("duck");

    // Line 1: Hi rmurphey & hgstrp!
    lcd.clear();
    lcd.cursor(1, 0);
    lcd.print("hello");


    //setting in the singleton
    DeviceInfos.getInstance().setLcd(lcd);
    DeviceInfos.getInstance().setLed(led);
    DeviceInfos.getInstance().setServo(servo);





    sequelize.sync(/*{ force: true }*/)
        .then(() => {
            //just one time
            /* RasberySql.create()
                 .then(() => {
     
     
                 })
                 .catch((err) => {
                     console.log('connot create rasbery table');
                     console.log(err);
                 })*/
            const server = app.listen(4000);
            let SocketENV = require('socket.io').listen(server);
            SocketENV.on('connection', (socket: any) => {
                console.log("::::::::::::::::::::::::::::::::");
                console.log('Un client est connecté !');
                console.log("::::::::::::::::::::::::::::::::");
                SocketENV.emit('test', 'test');
                SocketInfo.getInstance().setSocket(SocketENV);


            });
            console.log("server has been created");


        })
        .catch((err) => {
            console.log(err);
            console.log("failed to create databases  or tables");
        })






});


////////////////////////////////////////////////////










//const server = app.listen(3000);

