import { StateVerification } from './../../containers/StateVerification';
import { User } from '../../../../../Mysql/User';
import { Observable, Observer } from 'rxjs';
import { AuthenticateChaine } from '../../containers/AuthenticateChaine';
import { Request, ParamsDictionary, Response } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';
export class StateVerificationParametre implements AuthenticateChaine, StateVerification {
    private Nextchaine!: AuthenticateChaine;
    private state: number;
    private request: Request<ParamsDictionary>;
    private response: Response<any>;

    constructor(request: Request<ParamsDictionary, any, any>, response: Response<any>) {
        this.request = request;
        this.response = response;
        this.state = -1;
    }
    public setNextChaine(chaine: AuthenticateChaine): void {
        this.Nextchaine = chaine;
    }
    public setStateChecked(state: number): void {
        this.state = state;
    }
    public processOperation(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.process().subscribe(
                (resp) => {
                    if (resp) {
                        console.log('change state achieved an response');
                        resolve(true);
                    }
                },
                (err) => {
                    console.log('Error in change state');
                    reject(false);

                },
                () => {
                    console.log('change state complete');
                }
            )
        });


    }

    public process(): Observable<boolean> {
        return new Observable((observer: Observer<boolean>) => {
            if (this.state >= 0 || this.state <= 3) {
                jwt.verify(this.request.params['token'], 'NodeJsIotSUD', (err, authdata: any) => {
                    if (!err) {
                        if (authdata != null) {
                            User.findOne({ where: { username: authdata.username } })
                                .then((user) => {
                                    if (user != null) {
                                        if (user.state == this.state && user.email == authdata.email) {
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

                                        } else {
                                            console.log('the state si not valide');
                                            observer.error(false);
                                        }
                                    } else {
                                        observer.error(false);
                                        console.log('user is null');
                                    }
                                })
                                .catch((err) => {
                                    console.log('can not fetch the user from token in db');
                                    observer.error(false);
                                })
                        } else {
                            observer.error(false);
                            console.log('authdata is null');
                        }

                    } else {
                        console.log("----error with jwt----");
                        observer.error(false);

                    }
                });

            } else {
                console.log('state not set it yet');
                console.log('state is out of range');
                observer.error(false);
            }




        });


    }




}