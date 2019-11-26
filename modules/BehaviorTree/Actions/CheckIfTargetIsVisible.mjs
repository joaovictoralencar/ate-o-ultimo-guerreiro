import { status }  from '../consts/consts.mjs'
import Monitor from '../Composites/Monitor.mjs'

export default class CheckIfTargetIsVisible extends Monitor
{
    constructor(character, target, isVisible){
        super();
        this.character = character;
        this.target = target;
        this.isVisible = isVisible;
    }
    update(){
        let t = this.target;
        if (t !== undefined && this.isVisible){
            console.log(t.getName() + "(" + t.getId() + ")[" + t.getType() + "] is visible")
            this.character.setTarget(t);
            return status.SUCCESS;
        } else {
            console.log("Target is not is visible")
            return status.FAILURE;
        }
           
    }
};