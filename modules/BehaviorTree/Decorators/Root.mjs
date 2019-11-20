import DecoratorNode from './DecoratorNode.mjs'
export default class Root extends DecoratorNode {
    constructor() {
        super();
    }
    run() {
        if (this.getChild().run()) {
            console.log("Behavior succeeded")
            return true;
        } else
            return false;
    }
};