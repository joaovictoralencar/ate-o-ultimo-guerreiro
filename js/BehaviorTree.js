import * as BT from "../modules/BehaviorTree/index.mjs"
import { Warrior } from "../modules/Warriors/index.mjs"
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
let tick = 0;

do {
    console.log("-------------" + tick + "--------------")
} while(!root.run());
console.log("End of the BT")
