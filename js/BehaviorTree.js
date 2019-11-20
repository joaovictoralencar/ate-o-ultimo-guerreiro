import { CompositeNode } from "../modules/BehaviorTree/index.mjs"
let a = new CompositeNode()
a.addChild('oi')
console.log(a.getChildren())
a.run()