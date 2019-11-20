import CompositeNode from '../Decorators/CompositeNode.mjs'
export default class Sequence extends CompositeNode {
    constructor(){
        super();
    }
    run (){
        this.getChildren().forEach(child => {
            if (!child.run()){
                console.log("Sequence failed")
                return false
            }
        });
        console.log("Sequence succeeded")
        return true
    }
};