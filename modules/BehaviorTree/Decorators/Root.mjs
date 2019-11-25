import DecoratorNode from './DecoratorNode.mjs'
import { status }  from '../consts/consts.mjs'
export default class Root extends DecoratorNode {
    constructor(newRoot) {
        super();
        let root = newRoot;
        this.getRoot = () => root;
    }
    update(){
        let childStatus = this.getRoot().tick();
        if (childStatus == status.SUCCESS) console.log("BT has succeeded");
        if (childStatus == status.FAILURE) console.log("BT has failed");
        return childStatus;
    }
};