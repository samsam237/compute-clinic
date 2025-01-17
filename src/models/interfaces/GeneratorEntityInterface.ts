
export interface GeneratorEntityInterface {
    path : string;
    generate (constraint : any | null):Promise<any>;
}