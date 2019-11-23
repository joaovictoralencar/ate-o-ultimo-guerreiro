import Node from '../Node.mjs'
import status from '../consts/consts.mjs'

export default class Move extends Node
{
    constructor(warrior){
        super();
        this.warrior = warrior;
    }
    update(){
        this.warrior.move();
        return status.SUCCESS;
    }
};