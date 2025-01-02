

import fs from 'fs';
import { EntityAbstract } from '../abstract/EntityAbstract';
import {ExportToCSV} from './ExportCSV';
import {ExportToJSON} from './ExportJSON';
import {ExportToXML} from './ExportXML';
import {ExportToExcel} from './ExportXLSX'
import { ExportEntityInterface } from '../interfaces/ExportEntityInterface';

export class ExportEntity extends EntityAbstract {
    private state: { format: string; data: any } | null = null;

    public async export(data: any, format: string): Promise<Buffer> {
        /* this.state = { format, data };
        this.notify(this.state); */

        let content: Buffer;
        let exporter : ExportEntityInterface
        switch (format) {
            case 'json':
                exporter = new ExportToJSON();
                break;
            case 'csv':
                exporter = new ExportToCSV();
                break;
            case 'xml':
                exporter = new ExportToXML();
                break;
            case 'excel':
                exporter = new ExportToExcel();
                break;
            default:
                throw new Error(`Unsupported format: ${format}`);
        }
        
        content = await exporter.export(data);
        this.notify (`-> Data : \n${data} 
                    \n---------------------------------------------------------------\n
                      -> Exported in format : ${format}`);
        return content;
    }

    static getExporter(format: string): ExportEntityInterface {
        switch (format.toLowerCase()) {
            case 'json':
                return new ExportToJSON();
            case 'csv':
                return new ExportToCSV();
            case 'xml':
                return new ExportToXML();
            case 'excel':
                return new ExportToExcel();
            default:
                throw new Error(`Format d'exportation non supporté : ${format}`);
        }
    }

    public getState() {
        return this.state;
    }
}
