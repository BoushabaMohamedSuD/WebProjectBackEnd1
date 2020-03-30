

import { StateVerification } from '../containers/StateVerification';
import { User } from '../../../../Mysql/User';
import { AuthenticateChaine } from '../containers/AuthenticateChaine';
import { Observable, Observer, Subscription, Subject } from 'rxjs';
import { Request, ParamsDictionary, Response } from 'express-serve-static-core';

export class StateVerificationContext implements AuthenticateChaine {
    private Nextchaine!: AuthenticateChaine;

    private stateStratigy!: StateVerification;
    private state: number;
    constructor() {
        this.state = -1;
    }

    public setNextChaine(chaine: AuthenticateChaine): void {
        this.Nextchaine = chaine;
        this.stateStratigy.setNextChaine(this.Nextchaine);
    }
    public setStateStartigy(stateStrategy: StateVerification): StateVerificationContext {
        this.stateStratigy = stateStrategy;
        return this;
    }
    public setStateChecked(state: number): StateVerificationContext {
        this.state = state;
        this.stateStratigy.setStateChecked(this.state);
        return this;
    }
    public processOperation(): Promise<boolean> {
        console.log("State verification content process Operation");
        if (this.stateStratigy != null && this.stateStratigy != undefined) {

            return this.stateStratigy.processOperation();

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