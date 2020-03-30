import { GetDataStrategy } from './../Logics/Authenticate/Strategy/Strategys/GetDataStrategy';

import { SendEmailValidation } from './../Logics/Authenticate/Strategy/Strategys/SendEmailValidation';
import { UserInfo } from './../Mysql/UserInfo';
import { User } from './../Mysql/User';
import { LogOutStrategy } from './../Logics/Authenticate/Strategy/Strategys/LogOutStrategy';
import { UserInfoHandlerStrategy } from './../Logics/Authenticate/Strategy/Strategys/UserInfoHandlerStrategy';
import { EmailVerificationStartegy } from './../Logics/Authenticate/Strategy/Strategys/EmailVerificationStrategy';
import { SignUpStrategy } from './../Logics/Authenticate/Strategy/Strategys/SignUpStrategy';
import { AuthenticateContent } from '../Logics/Authenticate/Strategy/Contents/AuthenticateContent';

import express from 'express';
import { SignInStrategy } from '../Logics/Authenticate/Strategy/Strategys/SignInStrategy';
import { Request, ParamsDictionary } from 'express-serve-static-core';
const router = express.Router();





router.get('/', (req, res) => {
    console.log('get Data');
    new AuthenticateContent(new GetDataStrategy(req, res))
        .process()
        .then((resp) => {
            console.log(resp);
            if (!res.headersSent) {
                res.send("get data true");
            }

        })
        .catch((err) => {
            console.log(err);
            if (!res.headersSent) {
                res.status(400).send("get data false");
            }


        })

});






exports.router = router;
