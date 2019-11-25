import Node from '../Node.mjs'
export default class CompositeNode extends Node {
    constructor() {
        super();
        let children = [];
        this.getChildren = () => children;
        this.addChild = (childNode) => {
            children.push(childNode)
        }
        this.setChildren = (newChildren) => {
            children = newChildren;
        }
    }
    addChildInFront(child) {
        this.getChildren().splice(0, 0, child)
    }
}