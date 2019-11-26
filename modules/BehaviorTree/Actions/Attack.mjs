import Node from '../Node.mjs'
import { status }  from '../consts/consts.mjs'

export default class Attack extends Node
{
    constructor(character){
        super();
        this.character = character;
    }
    update(){
        this.character.attack();
        return status.SUCCESS;
    }
};