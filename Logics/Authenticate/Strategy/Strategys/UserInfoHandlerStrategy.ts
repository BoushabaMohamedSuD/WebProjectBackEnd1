import { StateVerificationHeader } from './../../ChaineOfResponsability/contents/StateVerifcation/StateVerifcationHeader';
import { ChangeStateHeader } from './../../ChaineOfResponsability/contents/StateChangement/ChangeStateHeader';
import { ChangeStateParametre } from './../../ChaineOfResponsability/contents/StateChangement/ChangeStateParametre';
import { ChangeStateContext } from './../../ChaineOfResponsability/contents/ChangeStateContext';
import { ReadyTurnOn } from './../../ChaineOfResponsability/contents/ReadyTurnOn';
import { StateVerificationParametre } from './../../ChaineOfResponsability/contents/StateVerifcation/StateVerificationParametre';
import { StateVerificationContext } from './../../ChaineOfResponsability/contents/StateVerificationContext';
import { UserInfoRegestering } from './../../ChaineOfResponsability/contents/UserInfoRegestering';
import { AuthenticateChaine } from '../../ChaineOfResponsability/containers/AuthenticateChaine';
import { AuthenticateStrategy } from '../Containers/AuthenticateStrategy';
import { Request, ParamsDictionary, Response } from 'express-serve-static-core';
import { VerifyToken } from '../../ChaineOfResponsability/contents/VerifyToken';
export class UserInfoHandlerStrategy implements AuthenticateStrategy {
    private chaine1!: AuthenticateChaine;
    constructor(request: Request<ParamsDictionary, any, any>, response: Response<any>) {
        this.chaine1 = new VerifyToken(request, response);
        const chaine2 = new StateVerificationContext()
            .setStateStartigy(new StateVerificationHeader(request, response))
            .setStateChecked(2);
        const chaine3 = new UserInfoRegestering(request, response);
        const chaine4 = new ReadyTurnOn(request, response);
        const chaine5: AuthenticateChaine = new ChangeStateContext()
            .setStateStartigy(new ChangeStateHeader(request, response));
        this.chaine1.setNextChaine(chaine2);
        chaine2.setNextChaine(chaine3);
        chaine3.setNextChaine(chaine4);
        chaine4.setNextChaine(chaine5);


    }
    public processOperation(): Promise<boolean> {
        console.log("user info handler startegy");
        return new Promise((resolve, reject) => {
            this.chaine1.processOperation()
                .then((resp) => {
                    if (resp) {
                        console.log('succes in user Info handler strategy');
                        resolve(true);
                    } else {
                        console.log('error in user info handler strategy');
                        reject(false);
                    }

                })
                .catch((err) => {
                    console.log('error in user info handler strategy');
                    reject(false);
                })
        });

    }

}