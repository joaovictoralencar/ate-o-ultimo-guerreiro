import Node from '../Node.mjs'
import { status } from '../consts/consts.mjs'

export default class GetClosestEnemy extends Node {
    constructor(character, enemies) {
        super();
        this.character = character;
        this.enemies = enemies;
    }
    update() {
        this.character.getClosestEnemy(this.enemies);
        return status.SUCCESS;
    }
};