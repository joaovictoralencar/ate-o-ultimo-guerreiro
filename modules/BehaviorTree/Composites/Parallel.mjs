import CompositeNode from './CompositeNode.mjs'
import {
    policy,
    status
} from '../consts/consts.mjs'

export default class Parallel extends CompositeNode {
    constructor(forSuccess, forFailure) {
        super();
        let success = forSuccess;
        let failure = forFailure;

        this.getSuccess = () => success;
        this.setSuccss = (newPolicy) => {
            success = newPolicy;
        }
        this.getFailure = () => failure;
        this.setFailure = (newPolicy) => {
            failure = newPolicy;
        }
    }
    update() {
        let iSuccessCount = 0;
        let iFailureCount = 0;
        let failure = this.getFailure();
        let success = this.getSuccess();
        let children = this.getChildren();
        for (let c = 0; c < children.length; c++) {
            let node = children[c];
            if (!node.isTerminated()) node.tick();
            if (node.getStatus() === status.SUCCESS) {
                ++iSuccessCount;
                if (success === policy.REQUIRE_ONE) return status.SUCCESS;
            }
            if (node.getStatus() === status.FAILURE) {
                ++iFailureCount;
                if (failure === policy.REQUIRE_ONE) return status.FAILURE;
            }
        }
        if (this.failure === policy.REQUIRE_ALL && iFailureCount === children.length) return status.FAILURE;
        if (this.success === policy.REQUIRE_ALL && iSuccessCount === children.length) return status.SUCCESS;
        return status.RUNNING;
    }
    onTerminate(status) {
        let children = this.getChildren();
        for (let c = 0; c < children.length; c++) {
            let node = children[c];
            if (node.isRunning()) node.abort();
        }
    }
}
/*

Like other composites, it’s made up of multiple
behaviors; however, these are all executed at the same time! This allows multiple behaviors
(including conditions) to be executed in parallel and for those behaviors to be aborted if
some or all of them fail.
A parallel node is not about multithreading or optimizations, though. Logically
speaking, all child behaviors are run at the same time. If you trace the code, their update
functions would be called sequentially one after another in the same frame.


It’s important for the parallel to be extremely precisely specified, so that it can be understood intuitively and relied upon without trying to second-guess the implementation.
In  this case, there are two parameters; one specifies the conditions under which the
parallel succeeds and the other for failure. Does it require all child nodes to fail/succeed or
just one before failing/succeeding? Instead of enumerations, you could also add counters
to allow a specific number of behaviors to terminate the parallel, but that complicates
the everyday use of the parallel without any additional power. Most useful BT structures
can be expressed with these parameters, using decorators on child nodes if necessary to
modify their return statuses.

The implementation of the parallel iterates through each child behavior, and updates it.
Counters are kept for all terminated behaviors, so the failure policy and success policy
can be checked afterwards. Note that failure takes priority over success since the BT itself
should assume the worst case and deal with it rather than proceed regardless. Also, in this
implementation the parallel terminates as soon as any policy is satisfied, even if there are
behaviors not yet run.
When a parallel terminates early because its termination criteria are fulfilled, all other
running behaviors must be terminated. This is done during the onTerminate() function that iterates through all the child nodes and handles their termination.

*/