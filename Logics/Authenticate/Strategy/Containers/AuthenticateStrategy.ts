export interface AuthenticateStrategy {

    processOperation: () => Promise<boolean>;

}