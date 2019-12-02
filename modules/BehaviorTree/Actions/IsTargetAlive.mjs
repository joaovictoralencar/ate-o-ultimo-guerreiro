import Node from '../Node.mjs'
import { status } from '../consts/consts.mjs'

export default class IsTargetAlive extends Node {
    constructor(character) {
        super();
        this.character = character;
    }
    update() {
        if (this.character.getTarget().getLife() > 0) { return status.SUCCESS; }
        else { return status.FAILURE; }
    }
};