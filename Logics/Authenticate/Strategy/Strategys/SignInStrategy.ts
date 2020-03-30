import { GenerateTokenSignIn } from './../../ChaineOfResponsability/contents/GenerateTokenSignIn';
import { StateChangement } from './../../ChaineOfResponsability/containers/StateChangement';
import { SignIn } from '../../ChaineOfResponsability/contents/SignIn';
import { AuthenticateChaine } from '../../ChaineOfResponsability/containers/AuthenticateChaine';
import { AuthenticateStrategy } from '../Containers/AuthenticateStrategy';
import { EmailVerification } from '../../ChaineOfResponsability/contents/EmailVerification';
import { SignUp } from '../../ChaineOfResponsability/contents/SignUp';
import { GenerateToken } from '../../ChaineOfResponsability/contents/GenerateToken';
import { Request, ParamsDictionary, Response } from 'express-serve-static-core';
export class SignInStrategy implements AuthenticateStrategy {
    private chaine1!: AuthenticateChaine;
    private request: Request<ParamsDictionary>;
    private response: Response<any>;
    private data: {
        username: string,
        email: string,
        state: number,
        isReady: boolean,
        authority: string,
        token: string,

    };

    constructor(request: Request<ParamsDictionary, any, any>, response: Response<any>) {
        console.log(request.body);
        this.data = {
            username: "",
            email: "",
            state: 0,
            isReady: false,
            authority: "",
            token: "",
        };
        this.chaine1 = new SignIn(request, response, this.data);
        const chaine2: AuthenticateChaine = new GenerateTokenSignIn(request, response, this.data);
        this.chaine1.setNextChaine(chaine2);
        this.request = request;
        this.response = response;


    }
    public processOperation(): Promise<boolean> {
        console.log("Sign in startegy");
        return new Promise((resolve, reject) => {
            if (Object.keys(this.request.body).length !== 0) {
                this.chaine1.processOperation()
                    .then((resp) => {
                        if (resp) {
                            console.log('succes in sign in strategy');
                            resolve(true);
                        } else {
                            console.log('error in sign in strategy');
                            reject(false);
                        }

                    })
                    .catch((err) => {
                        console.log('error in sign in strategy');
                        reject(false);
                    })

            } else {
                console.log('request is null');
                reject(false);
            }

        });

    }

}