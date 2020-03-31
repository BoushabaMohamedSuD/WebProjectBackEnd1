
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

        /* Data.bulkCreate([
             {
                 Nom: 'DATA',
                 Description: 'Ingénieur des Sciences de Données'
             },
             {
                 Nom: 'ASEDS',
                 Description: 'Advanced Software Engineering for Digital Services'
             },
             {
                 Nom: 'ICCN',
                 Description: 'Ingénieur Cybersécurité Et Confiance Numérique'
             },
             {
                 Nom: 'SESNum',
                 Description: 'Systèmes Embraqués et Services Numériques'
             },
             {
                 Nom: 'SmartICT',
                 Description: 'Ingénierie Smart Information & Communication Technology Engineering'
             },
             {
                 Nom: 'SUD',
                 Description: 'Ingénierie des Systèmes Ubiquitaires et Distribués – Cloud et IoT'
             },
             {
                 Nom: 'AMOA',
                 Description: 'Ingénieur Innovation et AMOA'
             },
         ])
             .then(() => {
 
                 console.log("server has been created");
             })
             .catch(() => console.log('cannot create data'))*/

        const server = app.listen(4000);


    })
    .catch((err) => {
        console.log(err);
        console.log("failed to create databases  or tables");
    })


