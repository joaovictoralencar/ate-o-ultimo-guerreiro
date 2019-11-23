import DecoratorNode from './DecoratorNode.mjs'
import status from '../consts/consts.mjs'
export default class Root extends DecoratorNode {
    constructor() {
        super();
    }
    update() {
        if (this.getChild().tick() === status.SUCCESS) {
            console.log("Behavior succeeded")
            return status.SUCCESS;
        } else{
            console.log("Behavior failed")
            return status.FAILURE;
        }
    }
};