export class validator {
    public login: string;
    public password: string;
    public password_1: string;
    public username: string;
    public email: string;

    public constructor(login: string, password: string, password_1: string, username: string, email: string) {
        this.login = login;
        this.password = password;
        this.password_1 = password_1;
        this.username = username;
        this.email = email;
    }

    private isLoginValid(): boolean {
        return this.login != '';
    }

    private isPasswordValid(): boolean {
        return this.password != '' && this.password_1 != '';
    }

    private isTwoPasswordsMatch(): boolean {
        return this.password === this.password_1;
    }

    private isUsernameValid(): boolean {
        return this.username != '';
    }

    private emailValid(): boolean {
        return this.email.includes('@');
    }

    public isValid(): boolean {
        return (this.isTwoPasswordsMatch() && this.isLoginValid()
            && this.isUsernameValid() && this.emailValid()
            && this.isPasswordValid());
    }
}