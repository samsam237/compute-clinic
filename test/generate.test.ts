import { GeneratorEntity } from '../src/models/concrete/GeneratorEntity';
import { config } from '../src/config/config';

describe('GeneratorEntity', () => {
    it('should generate data correctly', async () => {
        const generator = new GeneratorEntity();
        const data = await generator.generate();

        expect(data).toBeDefined();
        expect(typeof data).toBe('string'); // Exemple : chaîne de JSON ou CSV
    });

});
