import Node from './Node.mjs'
export default class Move extends Node
{
    constructor(warrior){
        super();
        this.warrior = warrior;
    }
    run(){
        this.warrior.move();
        return true;
    }
};