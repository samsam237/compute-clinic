export interface Config {
    dataSource: "api" | "db";  
    exportFormat: "json" | "csv";  
    path: string; 
}
  
export const config: Config = {
    dataSource: "api", 
    exportFormat: "json", 
    path: "", 
};  