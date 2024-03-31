export class message {
    public id: number;
    public sender_id: string;
    public recipient_id: string;
    public content: string;
    public m_date: string;
    public timeSince: string;

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
        sender_id: string,
        recipient_id: string,
        content: string,
        m_date: string) {
        this.id = id;
        this.sender_id = sender_id;
        this.recipient_id = recipient_id;
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
        return message.getMessageTimeSince(miliseconds)
    }

    public static includes(x: number, a: message[]): boolean {
        for (let i = 0; i < a.length; i++)
            if (a[i].id === x)
                return true;
        return false
    }
}