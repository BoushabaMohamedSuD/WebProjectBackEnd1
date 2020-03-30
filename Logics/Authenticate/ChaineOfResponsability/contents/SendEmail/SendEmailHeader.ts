import { EndPointInfo } from './../../../../../proprieties/EndPointInfo';
import { SendEmail } from '../../containers/SendEmail';
import { AuthenticateChaine } from './../../containers/AuthenticateChaine';
import { Request, ParamsDictionary, Response } from 'express-serve-static-core';
import { Observable, Observer } from 'rxjs';
import jwt from 'jsonwebtoken';
var nodemailer = require('nodemailer');


export class SendEmailHeader implements AuthenticateChaine, SendEmail {
    private Nextchaine!: AuthenticateChaine;
    private request: Request<ParamsDictionary>;
    private response: Response<any>;
    constructor(request: Request<ParamsDictionary, any, any>, response: Response<any>) {
        this.request = request;
        this.response = response;
    }


    public setNextChaine(chaine: AuthenticateChaine): void {
        this.Nextchaine = chaine;
    }
    public processOperation(): Promise<boolean> {

        return new Promise((resolve, reject) => {
            this.process().subscribe(
                (resp) => {
                    if (resp) {
                        console.log('SendEmail  achieved an response');
                        resolve(true);
                    }
                },
                (err) => {
                    console.log('Error in Send Email');
                    reject(false);

                },
                () => {
                    console.log('SendEmail complete');
                }
            )
        });


    }

    public process(): Observable<boolean> {
        return new Observable((observer: Observer<boolean>) => {

            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                // secure: true, // use SSL
                secureConnection: false,
                requireTLS: true,
                auth: {
                    user: 'nodejs1998yz@gmail.com',
                    pass: 'NodeJs2020'
                },
                tls: {
                    rejectUnauthorized: false
                },
            });
            const bearer = (this.request.header('authorization') as string).split(' ');
            let token: string = bearer[1];
            jwt.verify(token, 'NodeJsIotSUD', (err: any, authdata: any) => {
                if (authdata != null) {
                    jwt.sign({
                        username: authdata.username,
                        email: authdata.email,
                    }, 'NodeJsIotSUD', { expiresIn: 60 * 5 }, (errToken, resToken) => {
                        let htmlMessage: string = "<a href='" + EndPointInfo.getInstance().getEndPointEmail() + "ValidateEmail/" + resToken + "'>link text</a>";
                        transporter.sendMail({
                            from: 'Iot SUD ',
                            to: authdata.email as string,
                            subject: 'Validation email',
                            text: "please confirm your email ",
                            html: htmlMessage
                        }, (error: any, response: any) => {
                            //Email not sent
                            if (error) {
                                console.log(error);
                                observer.error(false);
                            }
                            //email send sucessfully
                            else {
                                console.log('email has been send sucessfully');
                                if (this.Nextchaine != null) {
                                    console.log('going to next chaine');
                                    this.Nextchaine.processOperation()
                                        .then((resp) => {
                                            console.log(resp);
                                            observer.next(true);
                                            observer.complete();
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                            console.log('Error');
                                            observer.error(false);
                                        });
                                } else {
                                    console.log('this is the end of the chaine');
                                    observer.next(true);
                                    observer.complete();
                                }
                            }
                        });

                    });

                } else {
                    console.log('authdata is null');
                    observer.error(false);
                }
            });







        });


    }




}