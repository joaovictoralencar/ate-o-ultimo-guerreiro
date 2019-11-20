import Node from './Node.mjs'
export default class CheckIfTargetIsInRange extends Node
{
    constructor(warrior){
        super();
        this.warrior = warrior;
    }
    run(){
        console.log("Target Is In Range");
        return true;
    }
};