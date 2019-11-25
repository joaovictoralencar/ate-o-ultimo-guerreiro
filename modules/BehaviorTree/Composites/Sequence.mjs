import CompositeNode from './CompositeNode.mjs'
import { status }  from '../consts/consts.mjs'

export default class Sequence extends CompositeNode {
    constructor() {
        super();
    }
    update() {
        let s = status.SUCCESS;
        let children = this.getChildren();
        for (let c = 0; c < children.length; c++) {
            s = children[c].tick();
            if (s !== status.SUCCESS) return s
        }
        return s
    }
};