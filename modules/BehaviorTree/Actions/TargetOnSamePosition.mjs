import Node from '../Node.mjs'
import { status } from '../consts/consts.mjs'

export default class TargetOnSamePosition extends Node {
    constructor(character) {
        super();
        this.character = character;
    }
    update() {
        var prevX = this.character.getTarget().prevX;
        var prevY = this.character.getTarget().prevY;
        var targetX = this.character.getTarget().getSprite().x;
        var targetY = this.character.getTarget().getSprite().y;

        if (prevX === targetX && prevY === targetY) {
            return status.SUCCESS;
        } else {
            return status.FAILURE;
        }
    }
};