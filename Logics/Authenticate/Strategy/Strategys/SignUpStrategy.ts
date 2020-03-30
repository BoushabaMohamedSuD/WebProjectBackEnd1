import { SendEmailBody } from './../../ChaineOfResponsability/contents/SendEmail/SendEmailBody';
import { ChangeStateBody } from './../../ChaineOfResponsability/contents/StateChangement/ChangeStateBody';


import { ChangeStateContext } from '../../ChaineOfResponsability/contents/ChangeStateContext';
import { AuthenticateChaine } from '../../ChaineOfResponsability/containers/AuthenticateChaine';
import { AuthenticateStrategy } from '../Containers/AuthenticateStrategy';
import { EmailVerification } from '../../ChaineOfResponsability/contents/EmailVerification';
import { SignUp } from '../../ChaineOfResponsability/contents/SignUp';
import { GenerateToken } from '../../ChaineOfResponsability/contents/GenerateToken';
import { PasswordVerification } from '../../ChaineOfResponsability/contents/PasswordVerification';
import { Request, ParamsDictionary, Response } from 'express-serve-static-core';
import { SendEmailContext } from '../../ChaineOfResponsability/contents/SendEmailContext';
export class SignUpStrategy implements AuthenticateStrategy {
    private chaine1!: AuthenticateChaine;
    private request: Request<ParamsDictionary>;
    private response: Response<any>;

    constructor(request: Request<ParamsDictionary, any, any>, response: Response<any>) {

        console.log(request.body);
        this.chaine1 = new PasswordVerification(request, response);
        const chaine2: AuthenticateChaine = new SendEmailContext()
            .setStateStartigy(new SendEmailBody(request, response));

        const chaine3: AuthenticateChaine = new SignUp(request, response);

        const chaine4: AuthenticateChaine = new ChangeStateContext()
            .setStateStartigy(new ChangeStateBody(request, response));
        const chaine5: AuthenticateChaine = new GenerateToken(request, response);

        this.chaine1.setNextChaine(chaine2);
        chaine2.setNextChaine(chaine3);
        chaine3.setNextChaine(chaine4);
        chaine4.setNextChaine(chaine5);
        this.request = request;
        this.response = response;


    }

    public processOperation(): Promise<boolean> {
        console.log("Sign up startegy");
        return new Promise((resolve, reject) => {
            if (Object.keys(this.request.body).length !== 0) {
                this.chaine1.processOperation()
                    .then((resp) => {
                        if (resp) {
                            console.log('succes in sign up strategy');
                            resolve(true);
                        } else {
                            console.log('error in sign up strategy');
                            reject(false);
                        }

                    })
                    .catch((err) => {
                        console.log('error in sign up strategy');
                        reject(false);
                    })
            } else {
                console.log('request is null');
                reject(false);
            }

        });

    }
}