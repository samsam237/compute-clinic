import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

/* export const initDatabase = async (): Promise<Database> => {
    const db = await open({
        filename: './logs.db',
        driver: sqlite3.Database,
    });

    // Crée une table si elle n'existe pas
    await db.exec(`
        CREATE TABLE IF NOT EXISTS logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            message TEXT NOT NULL
        );
    `);

    return db;
};
*/

export class DatabaseSingleton {
    private static instance: sqlite3.Database | null = null;

    private constructor() {}

    public static async getInstance(): Promise<sqlite3.Database> {
        if (!DatabaseSingleton.instance) {
            const db = await open({
                filename: './logs.db',
                driver: sqlite3.Database,
            });
        
            await db.exec(`
                CREATE TABLE IF NOT EXISTS logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    message TEXT NOT NULL
                );
            `);

            await db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL
                )
            `);

            await db.run(`
                CREATE TABLE IF NOT EXISTS data (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    content TEXT NOT NULL
                )
            `);
        
            DatabaseSingleton.instance = db as unknown as sqlite3.Database;
        }
        return DatabaseSingleton.instance;
    }
}

export const fetchAll = async (db: sqlite3.Database, sql: string, params: any[] = []): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  };
  

//export default DatabaseSingleton;