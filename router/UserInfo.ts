import { UserInfoHandlerStrategy } from './../Logics/Authenticate/Strategy/Strategys/UserInfoHandlerStrategy';
import { AuthenticateContent } from './../Logics/Authenticate/Strategy/Contents/AuthenticateContent';

import express from 'express';
import { AuthorizationUserInfo } from '../Logics/Authenticate/Strategy/Strategys/AuthorizationUserInfo';
const router = express.Router();

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
        cb(null, './uploads/public/images');
    },
    filename: function (req: any, file: any, cb: any) {
        // console.log(req.header('username'));
        cb(null, req.header('Username') + ".png");
    }
});
var upload = multer({ storage: storage });


router.post('/', (req, res, next) => {
    console.log('check authorization');
    console.log(req.headers);
    new AuthenticateContent(new AuthorizationUserInfo(req, res))
        .process()
        .then((resp) => {
            console.log(resp);
            if (resp) {
                console.log("::::: authorization valide:::::::");
                next();
            } else {
                console.log("authorization field");
                if (!res.headersSent) {
                    res.send("authorization field in  user info");
                }
            }

        })
        .catch((err) => {
            console.log(":::errror::::")
            console.log(err);
            console.log("authorization field");
            if (!res.headersSent) {

                res.status(400).send("authorization field from user info");
            }
        });

});

router.post('/UserInfoHandler', upload.single('PictureData'), (req, res) => {
    console.log('submiting the data');
    // console.log(req.headers);
    new AuthenticateContent(new UserInfoHandlerStrategy(req, res))
        .process()
        .then((resp) => {
            console.log(resp);
            if (!res.headersSent) {
                res.send("user handler true");
            }
        })
        .catch((err) => {
            console.log(err);
            if (!res.headersSent) {
                res.status(400).send("user handler false");
            }
        });

});


exports.router = router;
