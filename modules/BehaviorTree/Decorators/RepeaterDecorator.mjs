import DecoratorNode from './DecoratorNode.mjs';
import { status as statusNode } from '../consts/consts.mjs';
export default class RepeaterNode extends DecoratorNode {
    constructor(newChild) {
        super(newChild);
        let iLimit;

        this.getILimit = () => iLimit;
        this.setILimit = (newILimit) => {
            iLimit = newILimit;
        }
    }
    update() {
        let child = this.getChild();
        let iCounter = 0;
        while (true) {
            let status = child.tick();
            iCounter++;
            if (status === statusNode.RUNNING) break;
            if (status === statusNode.FAILURE) return statusNode.FAILURE;
            if (iCounter === this.getILimit()) return statusNode.SUCCESS;
        }
    }
};
