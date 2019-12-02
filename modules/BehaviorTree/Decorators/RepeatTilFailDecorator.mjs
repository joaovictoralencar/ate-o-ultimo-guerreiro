import DecoratorNode from './DecoratorNode.mjs';
import { status as statusNode } from '../consts/consts.mjs';
export default class RepeatTilFailNode extends DecoratorNode {
    constructor(newChild) {
        super(newChild);
    }
    update() {
        let child = this.getChild();
        var interval = setInterval(() => {
            let status = child.tick();
            if (status === statusNode.FAILURE) {
                clearInterval(interval);
                return statusNode.SUCCESS;
            }
        }, 100);
        return statusNode.SUCCESS;
    }
};
