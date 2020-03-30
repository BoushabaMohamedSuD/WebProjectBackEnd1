
import { Data } from './Mysql/Data';

export { };



import express from 'express';
import bodyParser from 'body-parser';
import { sequelize } from './Mysql/MysqlConnectivity';




const RouterAuthenticate = require('./router/Authenticate').router;
const RouterUserInfo = require('./router/UserInfo').router;
const RouterGetData = require('./router/GetDataRouter').router;

const app = express();

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
app.use('/GetData', RouterGetData);




sequelize.sync(/*{ force: true }*/)
    .then(() => {

        /* Data.create()
             .then(() => {
                 const server = app.listen(4000);
                 console.log("server has been created");
             })
             .catch(() => console.log('cannot create data'))*/



    })
    .catch((err) => {
        console.log(err);
        console.log("failed to create databases  or tables");
    })


