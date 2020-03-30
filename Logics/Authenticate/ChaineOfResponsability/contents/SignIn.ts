import { IsReady } from './IsReady';
import { User } from './../../../../Mysql/User';
import { AuthenticateChaine } from '../containers/AuthenticateChaine';
import { Observable, Observer, Subscription, Subject } from 'rxjs';
import { Request, ParamsDictionary, Response } from 'express-serve-static-core';

export class SignIn implements AuthenticateChaine {
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
        console.log("Sign in process Operation");
        return new Promise((resolve, reject) => {
            this.process().subscribe(
                (resp) => {
                    if (resp) {
                        console.log('sign in achieved an response');
                        resolve(true);
                    }
                },
                (err) => {
                    console.log('Error in Sign in');
                    reject(false);

                },
                () => {
                    console.log('Sign in complete');
                }
            )
        });


    }

    public process(): Observable<boolean> {
        return new Observable((observer: Observer<boolean>) => {

            //:::::: your code her ::::::::::w:://  
            User.findOne({ where: { username: this.request.body.username } })
                .then((user) => {
                    if (user != null) {
                        if (user.password == this.request.body.password) {
                            this.data.username = user.username;
                            this.data.email = user.email;
                            this.data.state = user.state;
                            this.data.authority = user.authority;
                            this.data.isReady = user.isReady;

                            User.update({ isActive: true }, { where: { username: this.request.body.username } })
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
                                    }

                                })
                                .catch((err) => {
                                    console.log("could not update the activity of user");
                                    observer.error(false);
                                });
                        } else {
                            console.log('the password is uncorect');
                            observer.error(false);
                        }
                    } else {
                        console.log('user is null');
                        observer.error(false);
                    }

                })
                .catch((err) => {
                    observer.error(false);
                    console.log('user could not be found');
                });



        });


    }



}