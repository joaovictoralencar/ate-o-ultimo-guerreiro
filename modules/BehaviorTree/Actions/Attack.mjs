import Node from '../Node.mjs'
import { status }  from '../consts/consts.mjs'

export default class Attack extends Node
{
    constructor(warrior){
        super();
        this.warrior = warrior;
    }
    update(){
        this.warrior.attack();
        return status.SUCCESS;
    }
};