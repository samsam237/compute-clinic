
import * as json2csv from 'json2csv';
import { ExportEntityInterface } from '../interfaces/ExportEntityInterface';

export class ExportToCSV implements ExportEntityInterface {
    public async export(data: string): Promise<Buffer> {
        const csvData = json2csv.parse(JSON.parse(data)); 
        return Buffer.from(csvData, 'utf-8'); 
    }
}
