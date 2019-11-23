import * as BT from "../modules/BehaviorTree/index.mjs"
import { Warrior } from "../modules/Warriors/index.mjs"

class BehaviorTree{
    constructor(newRoot){
        let root = newRoot;
        this.getRoot = () => root;
    }
    tick(){ 
        let tick = 0;
        do {
            tick++;
            console.log("-------------" + tick + "--------------")
        } while(root.tick() !== BT.status.SUCCESS);
        console.log("End of the BT")
    }
}


let w1 = new Warrior()
let root = new BT.Root()
let sequence1 = new BT.Sequence()
let CheckIfTargetIsInRange = new BT.CheckIfTargetIsInRange(w1)
let Move = new BT.Move(w1)
let Attack = new BT.Attack(w1)
root.setChild(sequence1)
sequence1.addChild(CheckIfTargetIsInRange)
sequence1.addChild(Move)
sequence1.addChild(Attack)

let bt = new BehaviorTree(root)
bt.tick();