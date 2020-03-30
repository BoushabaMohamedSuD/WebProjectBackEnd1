import { Observable } from 'rxjs';
import { AuthenticateChaine } from './AuthenticateChaine';

export interface StateVerification {

    setNextChaine: (chaine: AuthenticateChaine) => void;
    setStateChecked: (state: number) => void;
    process: () => Observable<boolean>;
    processOperation: () => Promise<boolean>;


}