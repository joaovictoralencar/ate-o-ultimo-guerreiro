import * as BT from "../modules/BehaviorTree/index.mjs"
let a = new BT.CompositeNode()
a.addChild('oi')
console.log(a.getChildren())
a.run()