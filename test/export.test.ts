import { ExportEntity } from '../src/models/concrete/ExportEntity';

describe('ExportEntity', () => {
    it('should export data as JSON', async () => {
        const exporter = ExportEntity.getExporter('json');
        const data = { name: 'John', age: 30 };

        const buffer = await exporter.export(JSON.stringify(data));
        const result = buffer.toString();

        expect(result).toContain('"name":"John"');
        expect(result).toContain('"age":30');
    });

    it('should export data as CSV', async () => {
        const exporter = ExportEntity.getExporter('csv');
        const data = [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }];

        const buffer = await exporter.export(JSON.stringify(data));
        const result = buffer.toString();

        expect(result).toContain('name,age');
        expect(result).toContain('John,30');
        expect(result).toContain('Jane,25');
    });

    it('should throw error for unsupported format', () => {
        expect(() => ExportEntity.getExporter('xml')).toThrow('Format d\'exportation non supporté');
    });
});
