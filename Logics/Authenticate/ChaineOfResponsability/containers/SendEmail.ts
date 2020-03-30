
import { Observable } from 'rxjs';
import { AuthenticateChaine } from './AuthenticateChaine';

export interface SendEmail {

    setNextChaine: (chaine: AuthenticateChaine) => void;
    process: () => Observable<boolean>;
    processOperation: () => Promise<boolean>;

}