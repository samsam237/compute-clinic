
import * as json2csv from 'json2csv';
import { ExportEntityInterface } from '../interfaces/ExportEntityInterface';

export class ExportToCSV implements ExportEntityInterface {
    public async export(data: string): Promise<Buffer> {
        //const myData = JSON.parse(data);
        const csvData = json2csv.parse(data); 
        return Buffer.from(csvData, 'utf-8'); 
    }
}
