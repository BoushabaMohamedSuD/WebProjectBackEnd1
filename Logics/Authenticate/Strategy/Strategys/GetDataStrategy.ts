import { GetData } from './../../ChaineOfResponsability/contents/GetData';
import { DestroyToken } from './../../ChaineOfResponsability/contents/DestroyToken';
import { VerifyToken } from './../../ChaineOfResponsability/contents/VerifyToken';
import { LogOut } from './../../ChaineOfResponsability/contents/LogOut';
import { IsReady } from './../../ChaineOfResponsability/contents/IsReady';
import { IsActive } from './../../ChaineOfResponsability/contents/IsActive';
import { SignIn } from '../../ChaineOfResponsability/contents/SignIn';
import { AuthenticateChaine } from '../../ChaineOfResponsability/containers/AuthenticateChaine';
import { AuthenticateStrategy } from '../Containers/AuthenticateStrategy';
import { EmailVerification } from '../../ChaineOfResponsability/contents/EmailVerification';
import { SignUp } from '../../ChaineOfResponsability/contents/SignUp';
import { GenerateToken } from '../../ChaineOfResponsability/contents/GenerateToken';
import { Request, ParamsDictionary, Response } from 'express-serve-static-core';
export class GetDataStrategy implements AuthenticateStrategy {

    private data: any
    private chaine1!: AuthenticateChaine;

    constructor(request: Request<ParamsDictionary, any, any>, response: Response<any>) {
        this.chaine1 = new VerifyToken(request, response);
        const chaine2 = new IsActive(request, response);
        const chaine3 = new GetData(request, response, this.data)

        this.chaine1.setNextChaine(chaine2);
        chaine2.setNextChaine(chaine3);



    }
    public processOperation(): Promise<boolean> {
        console.log("get Data strategy  handler startegy");
        return new Promise((resolve, reject) => {
            this.chaine1.processOperation()
                .then((resp) => {
                    if (resp) {
                        console.log('succes in userget data strategy');
                        resolve(true);
                    } else {
                        console.log('error in get data strategy');
                        reject(false);
                    }

                })
                .catch((err) => {
                    console.log('error in get data  strategy');
                    reject(false);
                })
        });

    }

}