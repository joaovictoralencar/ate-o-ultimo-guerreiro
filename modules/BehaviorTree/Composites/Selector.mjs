import CompositeNode from './CompositeNode.mjs'
import {
    status
} from '../consts/consts.mjs'
export default class Selector extends CompositeNode {
    constructor() {
        super();
    }
    update() {
        let children = this.getChildren();
        let s = status.FAILURE;
        for (let c = 0; c < children.length; c++) {
            let s = children[c].tick();
            if (s !== status.FAILURE) return s;
        }
        return s
    }
};