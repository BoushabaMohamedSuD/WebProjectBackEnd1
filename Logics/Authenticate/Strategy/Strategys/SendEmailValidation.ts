import { StateVerificationHeader } from './../../ChaineOfResponsability/contents/StateVerifcation/StateVerifcationHeader';
import { SendEmailHeader } from './../../ChaineOfResponsability/contents/SendEmail/SendEmailHeader';
import { SendEmailContext } from './../../ChaineOfResponsability/contents/SendEmailContext';

import { VerifyToken } from './../../ChaineOfResponsability/contents/VerifyToken';
import { StateVerificationParametre } from './../../ChaineOfResponsability/contents/StateVerifcation/StateVerificationParametre';
import { StateVerificationContext } from '../../ChaineOfResponsability/contents/StateVerificationContext';
import { StateVerification } from './../../ChaineOfResponsability/containers/StateVerification';
import { ChangeStateContext } from '../../ChaineOfResponsability/contents/ChangeStateContext';
import { IsActive } from './../../ChaineOfResponsability/contents/IsActive';
import { SignIn } from '../../ChaineOfResponsability/contents/SignIn';
import { AuthenticateChaine } from '../../ChaineOfResponsability/containers/AuthenticateChaine';
import { AuthenticateStrategy } from '../Containers/AuthenticateStrategy';
import { EmailVerification } from '../../ChaineOfResponsability/contents/EmailVerification';
import { SignUp } from '../../ChaineOfResponsability/contents/SignUp';
import { GenerateToken } from '../../ChaineOfResponsability/contents/GenerateToken';
import { Request, ParamsDictionary, Response } from 'express-serve-static-core';
import { ChangeStateParametre } from '../../ChaineOfResponsability/contents/StateChangement/ChangeStateParametre';
export class SendEmailValidation implements AuthenticateStrategy {
    private chaine1!: AuthenticateChaine;
    constructor(request: Request<ParamsDictionary, any, any>, response: Response<any>) {
        this.chaine1 = new VerifyToken(request, response);
        const chaine2 = new StateVerificationContext()
            .setStateStartigy(new StateVerificationHeader(request, response))
            .setStateChecked(1);
        const chaine3: AuthenticateChaine = new SendEmailContext()
            .setStateStartigy(new SendEmailHeader(request, response));
        this.chaine1.setNextChaine(chaine2);
        chaine2.setNextChaine(chaine3);



    }
    public processOperation(): Promise<boolean> {
        console.log("Email Verification startegy");
        return new Promise((resolve, reject) => {
            this.chaine1.processOperation()
                .then((resp) => {
                    if (resp) {
                        console.log('succes in Email Verification strategy');
                        resolve(true);
                    } else {
                        console.log('error in Email Verification strategy');
                        reject(false);
                    }

                })
                .catch((err) => {
                    console.log('error in Email Verification strategy');
                    reject(false);
                })
        });

    }

}