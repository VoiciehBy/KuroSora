export class template {
    public id: number;
    public owner: string;
    public content: string;

    public constructor(id: number, owner: string, content: string) {
        this.id = id;
        this.owner = owner;
        this.content = content;
    }
}
