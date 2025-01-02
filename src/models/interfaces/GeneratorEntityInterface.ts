
export interface GeneratorEntityInterface {
    path : string;
    generate ():Promise<any>;
}