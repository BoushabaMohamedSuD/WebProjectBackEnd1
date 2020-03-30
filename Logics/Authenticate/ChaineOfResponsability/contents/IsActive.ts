import { User } from './../../../../Mysql/User';
import { Observable, Observer } from 'rxjs';
import { AuthenticateChaine } from '../containers/AuthenticateChaine';
import { Request, ParamsDictionary, Response } from 'express-serve-static-core';
import { userInfo } from 'os';
export class IsActive implements AuthenticateChaine {
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
                        console.log('is active achieved an response');
                        resolve(true);
                    }
                },
                (err) => {
                    console.log('Error in email is active');
                    reject(false);

                },
                () => {
                    console.log('is active complete');
                }
            )
        });


    }

    public process(): Observable<boolean> {
        return new Observable((observer: Observer<boolean>) => {

            User.findOne({ where: { username: this.request.header('Username') as string } })
                .then((user) => {
                    if (user != null) {
                        if (user.isActive) {
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
                            console.log("user is not active");
                            observer.error(false);
                        }
                    } else {
                        console.log("user is null");
                        observer.error(false);
                    }


                })
                .catch((err) => {
                    console.log('cannot update the activity of the user in logout');
                    observer.error(false);
                })


        });


    }




}