import {ObserverAbstract} from '../abstract/ObserverAbstract'
import { Database } from 'sqlite3';
import { fetchAll } from '../../utils/db';

export class LogEntity extends ObserverAbstract{
    private logs: string[] = [];
    private db : Database | null = null;
    
    constructor (db: Database){
        super();
        this.db = db;        
    }
    
    async update(data : any): Promise<void> {
        const logEntry = `LogEntity received update: ${JSON.stringify(data)}`;
        this.logs.push(logEntry);

        const stmt = await this.db?.prepare(
            `INSERT INTO logs (timestamp, message) VALUES (?, ?)`
        )
        stmt?.run(new Date().toISOString(), logEntry);
    }

    public async getLogsFromDB(): Promise<any[]> {
        if (!this.db) {
            throw new Error("Database not initialized");
        }

        const logs = await fetchAll (this.db, `SELECT * FROM logs`)

        return logs;
    }
    
}