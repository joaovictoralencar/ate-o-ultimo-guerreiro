import Selector from './Selector.mjs'
import status from '../consts/consts.mjs'
export default class ActiveSelector extends Selector {
    constructor() {
        super();
        this.currentChild;
    }
    onInitialize() {
        let children = this.getChildren();
        this.currentChild = children[children.length - 1]
    }
    update() {
        let prev = this.currentChild;
        super.onInitialize();
        let s = super.update();
        let children = this.getChildren();
        if (prev != children[children.length - 1] && this.currentChild !== prev){
            prev.onTerminate(status.ABORTED)
        }
        return s
    }
};