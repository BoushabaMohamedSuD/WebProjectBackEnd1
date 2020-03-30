import { StateChangement } from './../containers/StateChangement';

import { User } from '../../../../Mysql/User';
import { Observable, Observer } from 'rxjs';
import { AuthenticateChaine } from '../containers/AuthenticateChaine';
import { Request, ParamsDictionary, Response } from 'express-serve-static-core';
export class ChangeStateContext implements AuthenticateChaine {
    private Nextchaine!: AuthenticateChaine;
    private stateStratigy!: StateChangement;


    constructor() {

    }

    public setNextChaine(chaine: AuthenticateChaine): void {
        this.Nextchaine = chaine;
        this.stateStratigy.setNextChaine(this.Nextchaine);
    }
    public setStateStartigy(stateStrategy: StateChangement): ChangeStateContext {
        this.stateStratigy = stateStrategy;
        return this;
    }
    public processOperation(): Promise<boolean> {
        console.log("State Changement context process Operation");
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
        console.log("this is content");
        return new Observable((observer: Observer<boolean>) => {
            observer.error(false);
        });


    }




}