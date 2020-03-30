
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





router.post('/SignIn', (req, res) => {
    console.log('SgnIn');
    new AuthenticateContent(new SignInStrategy(req, res))
        .process()
        .then((resp) => {
            console.log(resp);
            if (!res.headersSent) {
                res.send("SignIn true");
            }

        })
        .catch((err) => {
            console.log(err);
            if (!res.headersSent) {
                res.status(400).send("SignIn false");
            }


        })

});
router.post('/SignUp', (req, res) => {
    console.log('Signup');
    new AuthenticateContent(new SignUpStrategy(req, res))
        .process()
        .then((resp) => {
            console.log(resp);
            if (!res.headersSent) {
                res.send("Signup true");
            }
        })
        .catch((err) => {
            console.log(err);
            if (!res.headersSent) {
                res.status(400).send("Signup false");
            }
        })
});
router.get('/SendEmail', (req, res) => {
    console.log('sendEmail');
    new AuthenticateContent(new SendEmailValidation(req, res))
        .process()
        .then((resp) => {
            console.log(resp);
            if (!res.headersSent) {
                res.send("Send email true");
            }
        })
        .catch((err) => {
            console.log(err);
            if (!res.headersSent) {
                res.status(400).send("sendemail false");
            }
        })
})
router.post('/LogOut', (req, res) => {
    console.log('/Log out');
    new AuthenticateContent(new LogOutStrategy(req, res))
        .process()
        .then((resp) => {
            console.log(resp);
            if (!res.headersSent) {
                res.send("logout true");
            }
        })
        .catch((err) => {
            console.log(err);
            if (!res.headersSent) {
                res.status(400).send("logout false");
            }
        });
})

router.get('/ValidationEmail/:token', (req, res) => {

    console.log('email validation');
    new AuthenticateContent(new EmailVerificationStartegy(req, res))
        .process()
        .then((resp) => {
            console.log('email has been validated');
            res.send(true);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send(false);

        });

})






exports.router = router;
