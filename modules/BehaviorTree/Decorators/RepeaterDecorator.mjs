import DecoratorNode from './DecoratorNode.mjs';

export default class RepeaterNode extends DecoratorNode {
    constructor(newChild){
        super(newChild);
        let iLimit;
        let iCounter;

        this.getICounter = () => iCounter;
        this.setICounter = (newICounter) => {
            iCounter = newICounter;
        }
        this.getILimit = () => iLimit;
        this.setILimit = (newILimit) => {
            iLimit = newILimit;
        }
    }
    onInitialize(){
        this.setICounter(0);
    }
    update(){
        let child = this.getChild();
        while(true){
            let status = child.tick();
            if (status === status.RUNNING) break;
            if (status === status.FAILURE) return status.FAILURE;
            if (++this.numRepetitions === this.getILimit()) return status.SUCCESS;
        }
    }
};
