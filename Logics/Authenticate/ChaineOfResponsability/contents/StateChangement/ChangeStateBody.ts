import { StateChangement } from './../../containers/StateChangement';
import { User } from './../../../../../Mysql/User';
import { AuthenticateChaine } from './../../containers/AuthenticateChaine';
import { Observable, Observer } from 'rxjs';

import { Request, ParamsDictionary, Response } from 'express-serve-static-core';
export class ChangeStateBody implements AuthenticateChaine, StateChangement {
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

            //:::::: your code her :::::::::::://  
            User.findOne({ where: { username: this.request.body.username } })
                .then((user) => {
                    // console.log(user);
                    if (user != null) {
                        console.log('::::::user state : ' + user.state);
                        User.update({ state: user.state + 1 }, { where: { username: this.request.body.username } })
                            .then((resp) => {
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
                                console.log('error in updating the state');
                                observer.error(false);

                            });

                    }


                })
                .catch((err) => {
                    console.log('could not find the user in change state');
                    observer.error(false);
                });



        });


    }




}