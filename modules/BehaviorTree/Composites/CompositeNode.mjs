import Node from '../Node.mjs'
export default class CompositeNode extends Node {
    constructor(){
        super();
        let children = new Array();
        this.getChildren = () => children;
        this.addChild = (childNode) => {
            children.push(childNode)
        }
        this.addChildInFront = (child) => {
            children = children.slice(0, 0, child)
        }
    }
}