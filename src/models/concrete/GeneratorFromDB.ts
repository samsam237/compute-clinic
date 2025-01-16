
// GeneratorFromDB.ts

import { DatabaseSingleton, fetchAll } from "../../utils/db";
import { GeneratorEntityInterface } from "../interfaces/GeneratorEntityInterface";
import { Database } from "sqlite3";  // ou autre bibliothèque de gestion de DB

export class GeneratorFromDB implements GeneratorEntityInterface {
  private db: Database;
  path: string = "";

  constructor(db:Database) {
    this.db = db;
  }

  private async initializeDB (){    
    this.db = await DatabaseSingleton.getInstance();
  }

  public async generate(): Promise<any> {
    if (!this.db) {return null; }
    
    const datas = await fetchAll (this.db as unknown as Database, `SELECT * FROM data`)
    
    return datas;
  }
}
