import Node from '../Node.mjs'
import { status } from '../consts/consts.mjs'

export default class Attack extends Node {
    constructor(character) {
        super();
        this.character = character;
    }
    update() {
        if (this.character.attack() === true) { return status.SUCCESS; }
        else { return status.FAILURE; }
    }
};