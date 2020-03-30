import { User } from './../../../../Mysql/User';
import { Observable, Observer } from 'rxjs';
import { AuthenticateChaine } from '../containers/AuthenticateChaine';
import { Request, ParamsDictionary, Response } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';
export class ReadyTurnOn implements AuthenticateChaine {
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
                        console.log('sign up achieved an response');
                        resolve(true);
                    }
                },
                (err) => {
                    console.log('Error up Sign in');
                    reject(false);

                },
                () => {
                    console.log('Sign up complete');
                }
            )
        });


    }

    public process(): Observable<boolean> {
        return new Observable((observer: Observer<boolean>) => {

            const bearer = (this.request.header('authorization') as string).split(' ');
            let token: string = bearer[1];
            jwt.verify(token, 'NodeJsIotSUD', (err, authdata: any) => {
                if (!err) {
                    if (authdata != null) {
                        User.update({ isReady: true }, { where: { username: authdata.username } })
                            .then((user) => {

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

                            })
                            .catch((err) => {
                                console.log("error update ready");
                                observer.error(false);
                            });
                    } else {
                        console.log("authdata is null");
                        observer.error(false);
                    }
                } else {
                    console.log("can not fetch the authdata from token");
                    observer.error(false);
                }
            });




        });


    }




}