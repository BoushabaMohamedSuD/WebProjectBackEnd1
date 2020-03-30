import { SendEmail } from './../containers/SendEmail';


import { StateVerification } from '../containers/StateVerification';
import { User } from '../../../../Mysql/User';
import { AuthenticateChaine } from '../containers/AuthenticateChaine';
import { Observable, Observer, Subscription, Subject } from 'rxjs';
import { Request, ParamsDictionary, Response } from 'express-serve-static-core';

export class SendEmailContext implements AuthenticateChaine {
    private Nextchaine!: AuthenticateChaine;
    private emailStratigy!: SendEmail;
    constructor() {

    }

    public setNextChaine(chaine: AuthenticateChaine): void {
        this.Nextchaine = chaine;
        this.emailStratigy.setNextChaine(this.Nextchaine);
    }
    public setStateStartigy(emailstarigy: SendEmail): SendEmailContext {
        this.emailStratigy = emailstarigy;
        return this;
    }
    public processOperation(): Promise<boolean> {
        console.log("State verification content process Operation");
        if (this.emailStratigy != null && this.emailStratigy != undefined) {

            return this.emailStratigy.processOperation();

        } else {
            return new Promise((resolve, reject) => {
                this.process().subscribe(
                    (resp) => {
                        if (resp) {
                            console.log('stratigy content  achieved an response');
                            resolve(true);
                        }
                    },
                    (err) => {
                        console.log('Error in state strategy content');
                        reject(false);

                    },
                    () => {
                        console.log('strategy content complete');
                    }
                )
            });
        }



    }

    public process(): Observable<boolean> {
        console.log("this is context");
        return new Observable((observer: Observer<boolean>) => {
            observer.error(false);
        });


    }



}