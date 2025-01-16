import NeDB = require('nedb');
import { v4 as uuidv4 } from 'uuid';

export class NeDBManager {
  public db: NeDB;
  private defaultData: any;

  constructor(filePath: string = "db.json", defaultData = { clinical_case: [] }) {
    this.db = new NeDB({ filename: filePath, autoload: true });
    // this.defaultData = defaultData;
    this.db.ensureIndex({fieldName:"_id", unique:true});
    this.init();
  }

  /**
   * Initialise la base de données, en insérant les données par défaut si nécessaire.
   */
  private async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Vérifie si la base de données est vide et insère les données par défaut
      this.db.find({}, (err:any, docs:any) => {
        if (err) reject(err);
        if (docs.length === 0) {
          this.db.insert(this.defaultData, (err:any) => {
            if (err) reject(err);
            resolve();
          });
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Récupérer tous les éléments d'une collection.
   * @returns {void}
   */
  public getAll(callback: (err: any, data: any) => any): any {
    this.db.find({}, (err: any, docs: any[]) => {
      if (err) {
        return callback(err, null);
      }
      const data: { [key: string]: any } = {};
      docs.forEach((d: any) => {
        data[d._id] = { ...d };
      });
      return callback(null, data);
    });
    /* return new Promise((resolve, reject) => {
      this.db.find({}, (err:any, docs:any) => {
        if (err) reject(err);
        else resolve(docs[0][collectionName] || []);
        });
    }); */     
  }  

  /**
   * Rechercher des éléments avec des contraintes.
   * @param {Object} constraints - Clés et valeurs à filtrer.
   * @returns {void}
   */
  public findByConstraints(constraints: any, callback: (err: any, data: any) => any): any{
    this.db.find({...constraints}, function(err: any, docs: any) {
      if (err) return callback(err, null);
      const data: { [key: string]: any } = {};
      docs.forEach((d: any) => {
        data[d._id] = { ...d };
      });
      return callback(null, data);
    })
    /* return allItems.filter((item: { [key: string]: any }) =>
      Object.keys(constraints).every(key => item[key] === constraints[key])
    ); */
  }

  /**
   * Recherche avancée avec une fonction de prédicat.
   * @param {Function} predicate - Fonction qui retourne true pour les éléments correspondant.
   * @returns {void}
   */
  public findWithPredicate(constraints: any, predicate: (item: any) => boolean): any {
    this.db.find({...constraints}, function(err: any, docs: any) {
      if (err) return false;
      return docs.filter(predicate);
    })
  }

  /**
   * Ajouter un élément à une collection.
   * @param {Object} item - Objet à ajouter.
   * @returns {void}
   */
  public addItem(item: any): any {
    this.db.insert( item, function(err, document) {
        if (err) return false;

        return true;        
    });

    /* return new Promise((resolve, reject) => {
      this.db.find({}, (err:any, docs:any) => {
        if (err) reject(err);

        // Vérifier l'unicité de l'identifiant
        const existingData = docs[0][collectionName] || [];
        if (item.id && existingData.some((existingItem: any) => existingItem.id === item.id)) {
          reject(new Error(`L'élément avec l'identifiant ${item.id} existe déjà.`));
        }

        // Générer un identifiant unique si nécessaire
        item.id = item.id || uuidv4();

        // Ajouter l'élément à la collection
        docs[0][collectionName] = existingData.concat(item);
        this.db.update({}, { $set: docs[0] }, {}, (err:any) => {
          if (err) reject(err);
          resolve(item);
        });
      });
    }); */
  }

  /**
   * Supprimer un élément en fonction de critères.
   * @param {Object} constraints - Clés et valeurs pour identifier l'élément à supprimer.
   * @returns {void} - Indique si un élément a été supprimé.
   */
  public removeItem(constraints: any): any {
    this.db.insert( {...constraints}, function(err, numDeleted) {
      if (err) return false;

      return true;        
    });
    
    /* return new Promise((resolve, reject) => {
      this.db.find({}, (err:any, docs:any) => {
        if (err) reject(err);

        const allItems = docs[0][collectionName] || [];
        const initialLength = allItems.length;

        // Filtrer les éléments à supprimer
        docs[0][collectionName] = allItems.filter((item: { [key: string]: any }) =>
          !Object.keys(constraints).every(key => item[key] === constraints[key])
        );

        // Mise à jour après suppression
        this.db.update({}, { $set: docs[0] }, {}, (err:any) => {
          if (err) reject(err);
          resolve(docs[0][collectionName].length < initialLength);
        });
      });
    }); */
  }
}
