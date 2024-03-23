export class messageC {
    //public id: number;
    public sender_id: string;
    public recipient_id: string;
    public content: string;
    public m_date: string;
    public x: string;

    /*
    public constructor(id : string, sender_id: string, recipient_id: string, content: string, m_date: string, x : string) {
        this.sender_id = sender_id;
        this.recipient_id = recipient_id;
        this.content = content;
        this.m_date = m_date;
        this.x = x;
    }*/
    

    public constructor(sender_id: string, recipient_id: string, content: string, m_date: string, x : string) {
        this.sender_id = sender_id;
        this.recipient_id = recipient_id;
        this.content = content;
        this.m_date = m_date;
        this.x = x;
    }
}