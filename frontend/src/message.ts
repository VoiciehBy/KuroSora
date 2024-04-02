export class message {
    public id: number;
    public sender: string;
    public recipient: string;
    public content: string;
    public m_date: string;
    public timeSince: string;
    public olderThan8Hours : boolean;

    static getMessageTimeSince(miliseconds: number): string {
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

    public constructor(id: number,
        sender: string,
        recipient: string,
        content: string,
        m_date: string) {
        this.id = id;
        this.sender = sender;
        this.recipient = recipient;
        this.content = content
        this.m_date = m_date
        let miliseconds = Date.now() - Date.parse(m_date)
        this.timeSince = message.getMessageTimeSince(miliseconds)
    }

    public getMDate(): string {
        return this.m_date.slice(1, 20).replace('T', ' ');
    }

    public static updateTimeSince(m_date: string): string {
        let miliseconds = Date.now() - Date.parse(m_date)
        if (miliseconds > 28800000)
            return m_date.slice(0,10)
        else
            return message.getMessageTimeSince(miliseconds)
    }

    public static includes(x: number, a: message[]): boolean {
        for (let i = 0; i < a.length; i++)
            if (a[i].id === x)
                return true;
        return false
    }
}