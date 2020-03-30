import { User } from './../../../../Mysql/User';
import { Observable, Observer } from 'rxjs';
import { AuthenticateChaine } from '../containers/AuthenticateChaine';
import { Request, ParamsDictionary, Response } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';
import { reject } from 'bluebird';
export class GenerateTokenSignIn implements AuthenticateChaine {
    private Nextchaine!: AuthenticateChaine;
    private request: Request<ParamsDictionary>;
    private response: Response<any>;
    private data: any;


    constructor(request: Request<ParamsDictionary, any, any>, response: Response<any>, data: any) {
        this.request = request;
        this.response = response;
        this.data = data;
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
                        }, 'NodeJsIotSUD', { expiresIn: 60 * 60 * 24 * 12 }, (errToken, resToken) => {
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
                                    this.data.token = resToken
                                    this.response.send(this.data);
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