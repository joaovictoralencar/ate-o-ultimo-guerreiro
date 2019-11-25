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
            if (node.isRunning()) {
                node.abort();
            }
        }
    }
}
/*

The Parallel task acts in a similar way to the Sequence task. It has a set of child tasks, and it runs them until one of them fails. 
At that point, the Parallel task as a whole fails. If all of the child tasks complete successfully, 
the Parallel task returns with success. In this way, it is identical to the Sequence task and its non-deterministic variations.
The difference is the way it runs those tasks. Rather than running them one at a time, it runs them all simultaneously. 
We can think of it as creating a bunch of new threads, one per child, and setting the child tasks off together.
When one of the child tasks ends in failure, Parallel will terminate all of the other child threads that are still running.
Just unilaterally terminating the threads could cause problems, leaving the game inconsistent or failing to free resources 
(such as acquired semaphores). The termination procedure is usually implemented as a request rather than a direct termination
of the thread. In order for this to work, all the tasks in the behavior tree also need to be able to receive a termination 
request and clean up after themselves accordingly.
*/