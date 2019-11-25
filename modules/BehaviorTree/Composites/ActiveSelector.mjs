import Selector from './Selector.mjs'
import { status }  from '../consts/consts.mjs'
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
        this.onInitialize();
        let prev = this.currentChild;
        let s = super.update();
        let children = this.getChildren();
        if (prev != children[children.length - 1] && this.currentChild !== prev){
            prev.onTerminate(status.ABORTED)
        }
        return s
    }
};

/*

This active selector implementation reuses the bulk of the underlying Selector code,
and forces it to run every tick by calling onInitialize(). Then, if a different child node is
selected the previous one is shutdown afterwards. Separately, the m_Current iterator is
initialized to the end of the children vector. Keep in mind that forcefully aborting lower-priority
behaviors can have unwanted side effects if you’re not careful;

*/