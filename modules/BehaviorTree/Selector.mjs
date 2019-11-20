import CompositeNode from './CompositeNode.mjs'
export default class Selector extends CompositeNode {
    constructor(){
        super();
    }
    run (){
        this.getChildren.forEach(child => {
            if (child.run()){
                console.log("Selector succeeded")
                return true
            }
        });
        console.log("Selector failed")
        return false
    }
};