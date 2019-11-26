import Node from '../Node.mjs'
import { status }  from '../consts/consts.mjs'

export default class Move extends Node
{
    constructor(character){
        super();
        this.character = character;
    }
    update(){
        this.character.move();
        return status.SUCCESS;
    }
};