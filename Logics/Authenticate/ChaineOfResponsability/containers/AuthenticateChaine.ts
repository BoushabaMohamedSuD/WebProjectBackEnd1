import { Observable } from 'rxjs';


export interface AuthenticateChaine {

    setNextChaine: (chaine: AuthenticateChaine) => void;
    process: () => Observable<boolean>;
    processOperation: () => Promise<boolean>;

}