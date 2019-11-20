import Node from '../Node.mjs'
export default class DecoratorNode extends Node {
    constructor(){
        super();
        let child = new Node;
        this.getChild = () => child;
        this.setChild = (childNode) => {
           child = childNode
        }
    }
};
