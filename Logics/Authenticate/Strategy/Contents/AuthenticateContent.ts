import { AuthenticateStrategy } from '../Containers/AuthenticateStrategy';
export class AuthenticateContent {
    private Auth!: AuthenticateStrategy;
    constructor(Auth: AuthenticateStrategy) {
        this.Auth = Auth;

    }

    public process(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.Auth.processOperation()
                .then((resp) => {
                    if (resp) {
                        resolve(true);
                    }
                    reject(false)
                })
                .catch((err) => {
                    reject(false);
                });



        });
    }
}
