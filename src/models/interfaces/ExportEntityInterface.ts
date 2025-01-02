
export interface ExportEntityInterface {
    export (data : string): Promise<Buffer>;
}