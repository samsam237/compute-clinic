import express, {Request, Response} from 'express';
import { GeneratorEntity } from './models/concrete/GeneratorEntity';
import { ExportEntity } from './models/concrete/ExportEntity';
import {LogEntity} from './models/concrete/LogEntity'
import { DatabaseSingleton } from './utils/db';
import { NeDBManager } from './utils/lowDBManager';

const app = express();

const dbManager = new NeDBManager('clinical_case.json');
const collectionName = 'clinical_case';

app.use(express.json());

app.post('/generate', async (req: Request, res: Response) => {
    
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

app.get('/logs', async (req: Request, res: Response) : Promise<void> => {
    
    try {
        const db = await DatabaseSingleton.getInstance();

        const logger = new LogEntity(db);
        const data = await logger.getLogsFromDB();

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des logs:', error);
        res.status(500).json({
            success: false,
            message: 'Une erreur est survenue.',
        });
    }
});

/**
 * Récupérer tous les cas cliniques.
 */
app.get('/clinical_cases', (req: Request, res: Response) => {
    
    dbManager.getAll((err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération des cas cliniques.' });
        }
        res.status(200).json(data);
    });
});
  
  /**
   * Rechercher des cas cliniques avec des critères.
   */
  app.post('/clinical_cases/search', (req: Request, res: Response) : any => {
    const { constraints } = req.body;
  
    // Vérifier si des contraintes sont fournies
    if (!constraints || typeof constraints !== 'object') {
      return res.status(400).json({ error: 'Les contraintes de recherche sont invalides ou manquantes.' });
    }
  
    dbManager.findByConstraints(constraints, (err: any, cases: any) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la recherche des cas cliniques.' });
      }
      res.status(200).json(cases);
    });
  });
  
  
  /**
   * Ajouter un cas clinique.
   */
  app.post('/clinical_cases', async (req: Request, res: Response) => {
    try {
      const clinicalCase = req.body;
      const newCase = await dbManager.addItem(clinicalCase);
      res.status(201).json(newCase);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de l'ajout du cas clinique." });
    }
  });
  
  /**
   * Mettre à jour un cas clinique en fonction des critères.
   */
  app.put('/clinical_cases', async (req: Request, res: Response):Promise<any> => {
    try {
      const { constraints, updates } = req.body;
  
      // Trouver les cas cliniques correspondant aux critères
      const cases = await dbManager.findByConstraints(constraints, (err: any, cases: any) => {
        if (err) {
          return res.status(500).json({ err });
        }
        return cases
      });
      if (cases.length === 0) {
        return res.status(404).json({ error: 'Aucun cas clinique trouvé.' });
      }
  
      // Appliquer les mises à jour sur chaque cas trouvé
      const updatedCases:any = [];
      for (const caseItem of cases) {
        Object.assign(caseItem, updates);  // Fusionner les mises à jour
        updatedCases.push(caseItem);
      }
  
      // Recharger et sauvegarder les données dans la base de données
      await dbManager.db.update({}, { $set: { [collectionName]: updatedCases } }, {}, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erreur lors de la mise à jour des cas cliniques.' });
        }
        res.status(200).json(updatedCases);
      });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour des cas cliniques.' });
    }
  });
  
  /**
   * Supprimer un cas clinique.
   */
  /* app.delete('/clinical_cases', async (req: Request, res: Response) => {
    try {
      const { constraints } = req.body;
      const success = await LowDBManager.removeItem(collectionName, constraints);
      if (!success) {
        return res.status(404).json({ error: 'Aucun cas clinique trouvé à supprimer.' });
      }
      res.status(200).json({ message: 'Cas clinique supprimé avec succès.' });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression du cas clinique.' });
    }
  }); */
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
