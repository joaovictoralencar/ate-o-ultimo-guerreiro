import { status }  from '../consts/consts.mjs'
import Monitor from '../Composites/Monitor.mjs'
export default class CheckIfTargetIsInRange extends Monitor
{
    constructor(warrior){
        super();
        this.warrior = warrior;
    }
    update(){
        let p1 = this.warrior.getPosition();
        let p2 = this.warrior.getTarget().getPosition();
        let t = this.warrior.getTarget();
        let range = this.warrior.getRange();
        if (p2.x >= p1.x - range && p2.x <= p1.x + range){
            console.log(t.getName() + "(" + t.getId() + ")[" + t.getType() + "] is in range")
            return status.SUCCESS;
        } else {
            console.log("Target is not in range")
            return status.FAILURE;
        }
           
    }
};