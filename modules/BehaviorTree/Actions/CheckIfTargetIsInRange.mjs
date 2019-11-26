import { status }  from '../consts/consts.mjs'
import Monitor from '../Composites/Monitor.mjs'
export default class CheckIfTargetIsInRange extends Monitor
{
    constructor(character){
        super();
        this.character = character;
    }
    update(){
        let p1 = this.character.getPosition();
        let p2 = this.character.getTarget().getPosition();
        let t = this.character.getTarget();
        let range = this.character.getRange();
        if (p2.x >= p1.x - range && p2.x <= p1.x + range){
            console.log(t.getName() + "(" + t.getId() + ")[" + t.getType() + "] is in range")
            return status.SUCCESS;
        } else {
            console.log("Target is not in range")
            return status.FAILURE;
        }
           
    }
};