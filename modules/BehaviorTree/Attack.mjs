import Node from './Node.mjs'
export default class Attack extends Node
{
    constructor(warrior){
        super();
        this.warrior = warrior;
    }
    run(){
        this.warrior.attack();
        return true;
    }
};