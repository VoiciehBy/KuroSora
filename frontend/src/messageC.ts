export class messageC {
    //public id: number;
    public sender_id: string;
    public recipient_id: string;
    public content: string;
    public m_date: string;
    public timeSince: string;

    /*
    public constructor(id : string, sender_id: string, recipient_id: string, content: string, m_date: string, x : string) {
        this.id = id;
        this.sender_id = sender_id;
        this.recipient_id = recipient_id;
        this.content = content
        this.m_date = m_date.slice(1, 20).replace('T', ' ');
        let miliseconds = Date.now() - Date.parse(m_date)
        this.timeSince = this.getMessageTimeSince(miliseconds)
    }*/

    getMessageTimeSince(miliseconds: number): string {
        let s = Math.trunc(miliseconds / 1000)
        let h = Math.trunc(s / 3600)
        let min = Math.trunc(s / 60) - h * 60
        let r = ``
        s = s - h * 3600 - min * 60

        if (h != 0) r += `${h} h `
        if (min != 0) r += `${min} min `
        if (s != 0) r += `${s} s`
        return r
    }

    public constructor(sender_id: string, recipient_id: string, content: string, m_date: string) {
        this.sender_id = sender_id;
        this.recipient_id = recipient_id;
        this.content = content
        this.m_date = m_date.slice(1, 20).replace('T', ' ');
        let miliseconds = Date.now() - Date.parse(m_date)
        this.timeSince = this.getMessageTimeSince(miliseconds)
    }
}