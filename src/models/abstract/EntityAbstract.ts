import '../enum/EntityState'
import {ObserverAbstract} from './ObserverAbstract'

export abstract class EntityAbstract{
    observers: ObserverAbstract[] | undefined;

    constructor () {
        this.observers = [];
    }

    abstract getState () : any;

    
    attach (o:ObserverAbstract):void{
        this.observers?.push(o);
    }
    
    detach (o:ObserverAbstract):void{
        this.observers = this.observers?.filter(obs => obs !== o);
    }
    
    notify (data:any) : void{
        this.observers?.forEach(o => {
            o.update(data)
        });
    }
}