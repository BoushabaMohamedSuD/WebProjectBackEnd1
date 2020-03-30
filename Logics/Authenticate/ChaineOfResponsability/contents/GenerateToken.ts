import { User } from './../../../../Mysql/User';
import { Observable, Observer } from 'rxjs';
import { AuthenticateChaine } from '../containers/AuthenticateChaine';
import { Request, ParamsDictionary, Response } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';
import { reject } from 'bluebird';
export class GenerateToken implements AuthenticateChaine {
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
                        console.log('Genrate Token  achieved an response');
                        resolve(true);
                    }
                },
                (err) => {
                    console.log('Error in Genrate Token');
                    reject(false);

                },
                () => {
                    console.log('Genrate Token complete');
                }
            )
        });


    }

    public process(): Observable<boolean> {
        return new Observable((observer: Observer<boolean>) => {

            User.findOne({ where: { username: this.request.body.username } })
                .then((user) => {
                    if (user != null) {
                        jwt.sign({
                            id: user.id,
                            username: user.username,
                            email: user.email,
                        }, 'NodeJsIotSUD', { expiresIn: 60 * 5 }, (errToken, resToken) => {
                            if (!errToken) {
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
                                    this.response.setHeader('Content-Type', 'application/json');
                                    this.response.send({ Token: resToken });
                                    observer.next(true);
                                    observer.complete();
                                }
                            } else {
                                console.log('error generate token inside signin');
                                observer.error(false);
                            }


                        });

                    } else {
                        observer.error(false);
                        console.log('could not generate token');
                    }


                })
                .catch((err) => {

                });



        });


    }




}