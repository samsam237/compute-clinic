

import { GeneratorEntityInterface } from "./../interfaces/GeneratorEntityInterface";
import fetch from "node-fetch";  

export class GeneratorFromAPI implements GeneratorEntityInterface {
  path: string;

  constructor(apiPath: string) {
    this.path = apiPath;
  }

  public async generate(): Promise<any> {
    const response = await fetch(this.path);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return response.json();
  }
}
