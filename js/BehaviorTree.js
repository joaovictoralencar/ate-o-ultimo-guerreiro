import * as BT from "../modules/BehaviorTree/index.mjs"
import {
    Warrior
} from "../modules/Warriors/index.mjs"
import {
    policy
} from "../modules/BehaviorTree/consts/consts.mjs"

document.getElementById("goNext").onclick = tickTurn
let tick = 0;
function tickTurn(){
    console.log("--------------"+tick+"----------------")
    root.tick();
    tick++;
}

let w1 = new Warrior(1, 0, 0);
let w2 = new Warrior(2, 2, 0);
let activeSelector1 = new BT.ActiveSelector();
let sequence1 = new BT.Sequence();
// let monitor1 = new BT.Monitor(policy.REQUIRE_ONE, policy.REQUIRE_ONE);
let checkIfTargetIsVisible = new BT.CheckIfTargetIsVisible(w1, w2, true);
let activeSelector2 = new BT.ActiveSelector();
let sequence2 = new BT.Sequence();
// let monitor2 = new BT.Monitor(policy.REQUIRE_ONE, policy.REQUIRE_ONE);
let checkIfTargetIsInRange = new BT.CheckIfTargetIsInRange(w1);
let filter1 = new BT.Filter();
let attack = new BT.Attack(w1);
let repeater1 = new BT.RepeaterDecorator(attack);
let move = new BT.Move(w1);

let root = new BT.Root(activeSelector1);
activeSelector1.addChild(sequence1);
sequence1.addChild(checkIfTargetIsVisible);
sequence1.addChild(activeSelector2);
activeSelector2.addChild(sequence2);
sequence2.addChild(checkIfTargetIsInRange);
sequence2.addChild(filter1);
activeSelector2.addChild(move);

// monitor1.addCondition(checkIfTargetIsVisible);
// monitor2.addCondition(checkIfTargetIsInRange);
// monitor2.addAction(filter1)
filter1.addAction(repeater1);
repeater1.setILimit(3);

// requestAnimationFrame(mainLoop);

// var delta = 0;
// var lastFrameTimeMs = 0;
// var timeStep = 1000 / 60;
// function mainLoop(timeStamp) {
//     if (timeStamp < lastFrameTimeMs + timeStep) {
//         requestAnimationFrame(mainLoop);
//         return;
//     }
//     delta += timeStamp - lastFrameTimeMs;
//     lastFrameTimeMs = timeStamp;
//     while (delta >= timeStep) {
//         root.tick();
//         delta -= timeStep;
//     }
//     requestAnimationFrame(mainLoop);
// }

/*
root()
    .activeSelector()
    .sequence() //Attack the player if seen!
        .condition(IsPlayerVisible)
        .activeSelector()
            .sequence()
                .condition(IsPlayerInRange)
                .filter(Repeat, 3)
                    .action(FireAtPlayer)
            .action(MoveTowardsPlayer)
    .sequence() //Search near last known position.
        .condition(HaveWeGotASuspectedLocation)
        .action(MoveToPlayersLastKnownPosition)
        .action(LookAround)
    .sequence() //Randomly scanning nearby.
        .action(MoveToRandomPosition)
        .action(LookAround)
    .end();
*/