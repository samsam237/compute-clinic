import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { promisify } from 'util';
import { log } from 'console';

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

export function fetchAll(db: sqlite3.Database, sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const results: any[] = [];

        db.each(sql, params, (err, row) => {
            if (err) {
                return reject(err);
            }
            results.push(row);
        });

        setTimeout(() => {
            resolve(results);
        }, 1500);
    });
}

const test = async (): Promise<void> => {
    const db = await DatabaseSingleton.getInstance();
    console.log("Connexion à la base de données réussie.");

    try {
        const data = await fetchAll(db, "SELECT * FROM data");
        console.log("Données récupérées :", data);
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
};
