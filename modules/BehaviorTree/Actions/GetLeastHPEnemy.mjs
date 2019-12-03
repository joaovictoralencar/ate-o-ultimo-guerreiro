import Node from '../Node.mjs'
import { status } from '../consts/consts.mjs'

export default class GetLeastHPEnemy extends Node {
    constructor(character, enemies) {
        super();
        this.character = character;
        this.enemies = enemies;
    }
    update() {
        if (this.character.getLeastHPEnemy(this.enemies) === true) {
            return status.SUCCESS;
        } else {
            return status.FAILURE;
        }
    }
};