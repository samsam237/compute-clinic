

import { GeneratorEntityInterface } from "./../interfaces/GeneratorEntityInterface";
import fetch from "node-fetch";  

export class GeneratorFromAPI implements GeneratorEntityInterface {
  path: string;

  constructor(apiPath: string) {
    this.path = apiPath;
  }

  public async generate(constraint: any): Promise<any> {
    // Récupérer les données des consultations via la requête POST
    const response = await fetch(this.path, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date1: constraint.startDate,
        date2: constraint.endDate
      })
    });
  
    // Vérifier si la requête a réussi
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
  
    const data:any = await response.json();
  
    const patients:any = {};
  
    data.forEach((consultation: any) => {
      const matricule = consultation.matricule;
  
      if (!patients[matricule]) {
        patients[matricule] = {
          consultations: [],
          validated: false 
        };
      }
  
      patients[matricule].consultations.push(consultation);
    });
  
    for (let matricule in patients) {
      const patient = patients[matricule];
      let isValid = true;
  
      patient.consultations.forEach((consultation: any) => {
        if (constraint.symptoms && !consultation.symptomes.includes(constraint.symptoms)) {
          isValid = false;  
        }
        if (constraint.diagnosis && !consultation.diagnostique.includes(constraint.diagnosis)) {
          isValid = false;  
        }
        if (constraint.age && consultation.age !== constraint.age) {
          isValid = false;  
        }
      });
  
      if (isValid) {
        patient.validated = true;
      } else {
        delete patients[matricule];  
      }
    }

    const validPatients = Object.values(patients) as any[]; 
    
    const filteredPatients = validPatients.filter(patient => patient.validated);
  
    return filteredPatients;
  }
  
}
