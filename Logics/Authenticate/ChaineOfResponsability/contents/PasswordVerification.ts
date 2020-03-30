import { Observable, Observer } from 'rxjs';
import { AuthenticateChaine } from '../containers/AuthenticateChaine';
import { Request, ParamsDictionary, Response } from 'express-serve-static-core';
export class PasswordVerification implements AuthenticateChaine {
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
                        console.log('password Verification achieved an response');
                        resolve(true);
                    }
                },
                (err) => {
                    console.log('Error in password verefication');
                    reject(false);

                },
                () => {
                    console.log('password verefication complete');
                }
            )
        });


    }

    public process(): Observable<boolean> {
        return new Observable((observer: Observer<boolean>) => {

            //:::::: your code her :::::::::::://  

            if (this.request.body.password == this.request.body.cfpassword) {
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
                console.log('user should confirm his password');
                observer.error(false);
            }



        });


    }




}