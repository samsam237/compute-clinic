
import * as XLSX from 'xlsx';
import { ExportEntityInterface } from '../interfaces/ExportEntityInterface';

export class ExportToExcel implements ExportEntityInterface {
    public async export(data: string): Promise<Buffer> {
        const jsonData = JSON.parse(data);
        const ws = XLSX.utils.json_to_sheet(jsonData); 
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Logs'); 
        return XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' }); 
    }
}
