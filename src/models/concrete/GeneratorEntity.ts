import { EntityAbstract } from "../abstract/EntityAbstract";
import { GeneratorEntityInterface } from "../interfaces/GeneratorEntityInterface";
import {config} from '../../config/config'
import { ExportEntityInterface } from "../interfaces/ExportEntityInterface";
import { ExportToJSON } from "./ExportJSON";
import { ExportToCSV } from "./ExportCSV";
import { GeneratorFromAPI } from "./GeneratorFromAPI";
import { GeneratorFromDB } from "./GeneratorFromDB";
import { Database } from "sqlite3";

export class GeneratorEntity extends EntityAbstract {
    private state: any = null;

    private generator: GeneratorEntityInterface;
    private exporter: ExportEntityInterface;
  
    constructor(db : Database | null) {
        super ();
        switch (config.dataSource) {
            case 'api':
                this.generator = new GeneratorFromAPI(config.path); break;
            case 'db':
                if (!db) throw new Error(`Invalid Database`);
                this.generator = new GeneratorFromDB(db);  break;
            default:
                throw new Error(`Unsupported format: ${config.exportFormat}`);
        }          
        switch (config.exportFormat) {
            case 'json':
                this.exporter = new ExportToJSON(); break;
            case 'csv':
                this.exporter = new ExportToCSV();  break;
            default:
                throw new Error(`Unsupported format: ${config.exportFormat}`);
        }                   
    }  

    public async generate(): Promise<Buffer> {
      const data : string = await this.generator.generate();
      this.notify(`Data generated : ${data}`);  
      return this.exporter.export(data);
    }

    public getState(): any {
        return this.state;
    }
}
