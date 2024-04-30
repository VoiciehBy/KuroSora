export class notification {
    public id: number;
    public type: string;
    public from: string;
    public to: string;

    constructor(id : number, from : string, to: string){
        this.id = id;
        this.type = "FRIEND_REQUEST";
        this.from = from;
        this.to = to;
    }
}
