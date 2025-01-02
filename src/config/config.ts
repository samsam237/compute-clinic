export interface Config {
    dataSource: "api" | "db";  
    exportFormat: "json" | "csv";  
    path: string; 
}
  
export const config: Config = {
    dataSource: "db", 
    exportFormat: "json", 
    path: "./logs.db", 
};  