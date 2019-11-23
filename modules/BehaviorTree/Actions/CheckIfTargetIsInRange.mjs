import Node from '../Node.mjs'
import status from '../consts/consts.mjs'

export default class CheckIfTargetIsInRange extends Node
{
    constructor(warrior){
        super();
        this.warrior = warrior;
    }
    update(){
        console.log("Target Is In Range");
        return status.SUCCESS;
    }
};