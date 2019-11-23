import Sequence from './Sequence.mjs'

export default class Filter extends Sequence {
    constructor() {
        super();
    }
    addCondition(condition) {
        this.addChildInFront(condition);
    }
    addAction() {
        this.addChild(condition)
    }
};