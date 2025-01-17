
import { Builder } from 'xml2js';
import { ExportEntityInterface } from '../interfaces/ExportEntityInterface';

export class ExportToXML implements ExportEntityInterface {
    public async export(data: string): Promise<Buffer> {
        //const jsonData = JSON.parse(data); 

        const xmlData = await this.convertJsonToXml(data);
        
        return Buffer.from(xmlData, 'utf-8'); 
    }

    private async convertJsonToXml(jsonData: any): Promise<string> {
        const builder = new Builder();
        return builder.buildObject(jsonData); 
    }
}
