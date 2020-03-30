import { UserInfoRegestering } from './../../ChaineOfResponsability/contents/UserInfoRegestering';
import { AuthenticateChaine } from '../../ChaineOfResponsability/containers/AuthenticateChaine';
import { AuthenticateStrategy } from '../Containers/AuthenticateStrategy';
import { Request, ParamsDictionary, Response } from 'express-serve-static-core';
import { VerifyToken } from '../../ChaineOfResponsability/contents/VerifyToken';
export class AuthorizationUserInfo implements AuthenticateStrategy {
    private chaine1!: AuthenticateChaine;
    constructor(request: Request<ParamsDictionary, any, any>, response: Response<any>) {
        this.chaine1 = new VerifyToken(request, response);

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