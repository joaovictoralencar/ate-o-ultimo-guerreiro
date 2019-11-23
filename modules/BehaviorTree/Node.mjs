import nodeStatus from './consts/consts.mjs'
export default class Node {
    constructor() {
        let status = nodeStatus.INVALID;
        this.getStatus = () => status;
        this.setStatus = (newStatus) => {
            status = newStatus;
        }
    }
    onInitialize() {
        console.log('This node started');
    }
    update() {
        return this.getStatus();
    }
    tick() {
        if (this.getStatus() != status.RUNNING) this.onInitialize();
        this.setStatus(this.update());
        if (this.getStatus() != status.RUNNING) this.onTerminate(this.getStatus());
        return this.getStatus();
    }
    onTerminate(status) {
        this.setStatus(status);
    }
    reset() {
        this.setStatus(status.INVALID);
    }
    abort() {
        this.onTerminate(status.ABORTED);
        this.setStatus(status.ABORTED);
    }
    isTerminated() {
        return this.getStatus() == status.SUCCESS || this.getStatus() == status.FAILURE;
    }
    isRunning() {
        return this.getStatus() == status.RUNNING;
    }
}