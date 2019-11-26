export default class Assassin extends Character {
    constructor(id, positionX, positionY){
        super(id, positionX, positionY)
        this.setType("Assassin");
    }
}