export interface PhysicalDiagnosis {
    name: string;
    result: string;
}
  
export interface CurrentTreatment {
    treatment: string;
}
  
export interface Lifestyle {
    addictions: { name: string; frequency: string; duration: string }[];
    physicalActivity: { name: string; frequency: string };
    travel: { location: string; frequency: string; duration: string };
    companionAnimal: boolean;
    mosquitoNet: boolean;
    waterIntake: number;
}
  
export interface PersonalData {
    age: number;
    sex: string;
    maritalStatus: string;
    profession: string;
    numberOfChildren: number;
    bloodGroup: string;
}
  
export interface ComplementaryExams {
    name: string;
    result: string;
    anatomy: string;
}
  
export interface MedicalHistory {
    familyHistory: string[];
    allergies: { manifestation: string; trigger: string }[];
    diseases: {
      name: string;
      startDate: string;
      endDate: string;
      observation: string;
      treatment: { duration: string; dosage: string };
    }[];
    surgeries: { name: string; date: string }[];
    obstetrical: { numberOfPregnancies: number; dates: string[] };
}
  
export interface Symptom {
    name: string;
    location: string;
    startDate: string;
    frequency: string;
    duration: string;
    evolution: string;
    triggeringActivity: string;
    severity: string;
}
  
export interface ClinicalCase {
    id: string;
    personalData: PersonalData;
    physicalDiagnosis: PhysicalDiagnosis[];
    currentTreatment: CurrentTreatment;
    lifestyle: Lifestyle;
    consultationReason: string;
    complementaryExams: ComplementaryExams[];
    medicalHistory: MedicalHistory;
    symptoms: Symptom[];
}
  