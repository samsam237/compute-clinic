import express, {Request, Response} from 'express';
import { GeneratorEntity } from './models/concrete/GeneratorEntity';
import { ExportEntity } from './models/concrete/ExportEntity';
import {LogEntity} from './models/concrete/LogEntity'
import { DatabaseSingleton } from './utils/db';
import { Database } from 'sqlite';

const app = express();

app.use(express.json());

app.post('/generate', async (req: Request, res: Response) => {
    console.log (`Get Database`)
    const db = await DatabaseSingleton.getInstance(); 

    const logger = new LogEntity(db);
    try {
        const generator = new GeneratorEntity(db);
        generator.attach(logger);
        const data = await generator.generate();
        res.json({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur lors de la génération des données.' });
    }
});

app.post('/export', async (req: Request, res: Response) => {
    const db = await DatabaseSingleton.getInstance(); 

    const logger = new LogEntity(db);
    try {
        const { data, format } = req.body;
        const exporter = new ExportEntity();
        exporter.attach(logger)
        const buffer = await exporter.export(data, format);
        res.setHeader('Content-Disposition', `attachment; filename=data.${format}`);
        res.send(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur lors de l\'exportation des données.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
