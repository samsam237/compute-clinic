export interface Config {
    dataSource: "api" | "db";  
    exportFormat: "json" | "csv";  
    path: string; 
}
  
export const config: Config = {
    dataSource: "api", 
    exportFormat: "json", 
    path: "http://127.0.0.1:8000/api/casCliniques/getPatientsRecords", 
};  