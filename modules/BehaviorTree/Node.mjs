import { status } from './consts/consts.mjs'
export default class Node {
    constructor() {
        let _nodeStatus = status.INVALID;
        this.getStatus = () => _nodeStatus;
        this.setStatus = (newStatus) => {
            _nodeStatus = newStatus;
        }
    }
    onInitialize() {
    }
    update() {
        return this.getStatus();
    }
    tick() {
        // console.log(this)
        if (this.getStatus() !== status.RUNNING) this.onInitialize();
        this.setStatus(this.update());
        if (this.getStatus() !== status.RUNNING) this.onTerminate(this.getStatus());
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
        return this.getStatus() === status.SUCCESS || this.getStatus() === status.FAILURE;
    }
    isRunning() {
        return this.getStatus() === status.RUNNING;
    }
}