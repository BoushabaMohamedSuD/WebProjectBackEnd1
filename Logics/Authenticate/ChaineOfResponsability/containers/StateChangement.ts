import { Observable } from 'rxjs';
import { AuthenticateChaine } from './AuthenticateChaine';

export interface StateChangement {

    setNextChaine: (chaine: AuthenticateChaine) => void;
    process: () => Observable<boolean>;
    processOperation: () => Promise<boolean>;

}