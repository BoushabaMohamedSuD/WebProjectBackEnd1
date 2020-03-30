import { UserInfo } from './../../../../Mysql/UserInfo';
import { User } from './../../../../Mysql/User';
import { Observable, Observer } from 'rxjs';
import { AuthenticateChaine } from '../containers/AuthenticateChaine';
import { Request, ParamsDictionary, Response } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';
export class UserInfoRegestering implements AuthenticateChaine {
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
                        console.log('user info achieved an response');
                        resolve(true);
                    }
                },
                (err) => {
                    console.log('Error in user info');
                    reject(false);

                },
                () => {
                    console.log('user infocomplete');
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
                        User.findOne({ where: { username: authdata.username } })
                            .then((user) => {
                                if (user != null) {
                                    UserInfo.create({
                                        firstname: this.request.body.firstname,
                                        lastname: this.request.body.lastname,
                                        address: this.request.body.address,
                                        picture: authdata.username + ".png"
                                    }).then((userInfo) => {
                                        if (userInfo != null) {
                                            user.$set('UserInfoId', userInfo)
                                                .then(() => {
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

                                                }).catch((err: any) => {
                                                    console.log(err);
                                                    console.log("can not add userifno to user");
                                                    observer.error(false);
                                                });

                                        } else {
                                            console.log("userinfo is null");
                                            observer.error(false);
                                        }
                                    })
                                        .catch((err) => {
                                            console.log(err);
                                            console.log("enable to crate a userinfo");
                                            observer.error(false);
                                        })

                                } else {
                                    observer.error(false);
                                    console.log("user is null");
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