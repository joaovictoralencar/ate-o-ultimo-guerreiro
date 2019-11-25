import Parallel from './Parallel.mjs'

export default class Monitor extends Parallel {
    constructor(forSuccess, forFailure) {
        super(forSuccess, forFailure);
    }
    addCondition(condition) {
        this.addChildInFront(condition);
    }
    addAction(action) {
        this.addChild(action)
    }
};

/*
The easiest way to set this up is to reuse the parallel node implementation, as a Monitor
node can be thought of as a parallel behavior with two sub-trees; one containing conditions
which express the assumptions to be monitored (read-only), and the other tree of
behaviors (read–write). Separating the conditions in one branch from the behaviors in the
other prevents synchronization and contention problems, since only one sub-tree will be
running actions that make changes in the world

*/