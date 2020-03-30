import { User } from './../../../../Mysql/User';
import { Observable, Observer } from 'rxjs';
import { AuthenticateChaine } from '../containers/AuthenticateChaine';
import { Request, ParamsDictionary, Response } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';
export class VerifyToken implements AuthenticateChaine {
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
                        console.log('verification tokn achieved an response');
                        resolve(true);
                    }
                },
                (err) => {
                    console.log('Error in verefocation the token');
                    reject(false);

                },
                () => {
                    console.log('verification token complete');
                }
            )
        });


    }

    public process(): Observable<boolean> {
        console.log("starttttttttttttttttttt");
        return new Observable((observer: Observer<boolean>) => {
            console.log(this.request.header('authorization'));
            const bearer = (this.request.header('authorization') as string).split(' ');
            let token: string = bearer[1];
            console.log(token);
            console.log(this.request.header('Username'));
            jwt.verify(token, 'NodeJsIotSUD', (err: any, authdata: any) => {
                if (!err) {
                    if (authdata != null) {
                        if (authdata.username == this.request.header('Username') as string) {
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
                            console.log("token is not match up with headres");
                            observer.error(false);
                        }
                    } else {
                        observer.error(false);
                        console.log('authdata is null');
                    }

                } else {
                    observer.error(false);
                    console.log('authorization field');
                }
            });





        });



    }




}