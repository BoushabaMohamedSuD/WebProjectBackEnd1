
export class EndPointInfo {
    private static Instance: EndPointInfo;
    private endPointEmail: string;


    private constructor() {
        this.endPointEmail = 'http://localhost:3000/';
    }

    /* public setEndPointEmail(endPointEmail: string) {
         this.endPointEmail = endPointEmail;
 
     }*/

    public getEndPointEmail(): string {
        return this.endPointEmail;
    }


    public static getInstance(): EndPointInfo {
        if (EndPointInfo.Instance == null) {
            EndPointInfo.Instance = new EndPointInfo();
        }
        return EndPointInfo.Instance;
    }
}