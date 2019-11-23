import Node from '../Node.mjs'

export default class DecoratorNode extends Node {
    constructor(newChild){
        super();
        let child = newChild;
        this.getChild = () => child;
        this.setChild = (childNode) => {
           child = childNode
        }
    }
};
