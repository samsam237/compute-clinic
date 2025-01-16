
import { ExportEntityInterface } from "../interfaces/ExportEntityInterface";

export class ExportToJSON implements ExportEntityInterface {
    constructor() {};
    async export(data: string): Promise<Buffer> {
        return Buffer.from(data || "", 'utf-8'); 
    }
}