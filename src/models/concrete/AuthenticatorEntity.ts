import { Database } from "sqlite";
import { EntityAbstract } from "../abstract/EntityAbstract";
import bcrypt from 'bcrypt';

export class AuthenticatorEntity extends EntityAbstract {
    private state: { authenticated: boolean; userId?: string } = { authenticated: false };
    private db: Database;

    constructor(db: Database) {
        super ()
        this.db = db;
    }

    public authenticate(userId: string): void {
        this.state = { authenticated: true, userId };
        this.notify(this.state);
    }

    public async registerUser(email: string, password: string): Promise<string> {
        const existingUser = await this.db.get(`SELECT * FROM users WHERE email = ?`, [email]);
        if (existingUser) {
            throw new Error("Utilisateur ou email déjà utilisé.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await this.db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, hashedPassword]);

        this.notify(`User with ${email} register.`)
        return "Utilisateur inscrit avec succès.";
    }
    
    public async authenticateUser(email: string, password: string): Promise<string> {
        const user = await this.db.get(`SELECT * FROM users WHERE email = ?`, [email]);
        if (!user) {
            throw new Error("Utilisateur non trouvé.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Mot de passe incorrect.");
        }

        this.notify(`User with ${email} authenticated.`)
        return email; 
    }

    public logout(email: string): void {
        this.notify(`User with ${email} logout.`)
        //this.notify(this.state);
    }

    public getState(): void {
        return 
    }
}
