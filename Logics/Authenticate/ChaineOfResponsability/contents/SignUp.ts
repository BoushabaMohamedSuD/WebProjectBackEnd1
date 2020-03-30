import { User } from './../../../../Mysql/User';
import { Observable, Observer } from 'rxjs';
import { AuthenticateChaine } from '../containers/AuthenticateChaine';
import { Request, ParamsDictionary, Response } from 'express-serve-static-core';
export class SignUp implements AuthenticateChaine {
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

            //:::::: your code her :::::::::::://  
            User.create({
                username: this.request.body.username,
                password: this.request.body.password,
                email: this.request.body.email
            })
                .then((resp) => {
                    console.log('user has benn regestred');
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
                    console.log('could not create an a user in database');
                    observer.error(false);
                })



        });


    }




}