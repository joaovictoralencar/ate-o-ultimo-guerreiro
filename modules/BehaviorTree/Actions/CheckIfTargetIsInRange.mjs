import { status } from '../consts/consts.mjs'
import Monitor from '../Composites/Monitor.mjs'
export default class CheckIfTargetIsInRange extends Monitor {
    constructor(character) {
        super();
        this.character = character;
    }
    update() {
        let p1x = this.character.getSprite().x;
        let p1y = this.character.getSprite().y;
        let p2x = this.character.getTarget().getSprite().x;
        let p2y = this.character.getTarget().getSprite().y;
        let t = this.character.getTarget();
        let range = this.character.getRange();
        if (p2x >= p1x - (range * 32) && p2x <= p1x + (range * 32) &&
            p2y >= p1y - (range * 32) && p2y <= p1y + (range * 32)) {
            //console.log("(" + t.getId() + ")[" + t.getType() + "] is in range")
            return status.FAILURE;
        } else {
            //console.log("Target is not in range")
            return status.SUCCESS;
        }

    }
};