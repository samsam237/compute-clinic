import {EntityAbstract} from './EntityAbstract'

export abstract class ObserverAbstract {
    private subjects : EntityAbstract[];

    constructor (){
        this.subjects = [];
    };

    public observe (e : EntityAbstract){
        this.subjects.push(e);
        e.attach(this);
    }

    abstract update (data : any) : void;
}