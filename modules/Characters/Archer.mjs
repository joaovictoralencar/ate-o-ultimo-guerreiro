import Character from "./Character.mjs";

export default class Mage extends Character {
  constructor(id, positionX, positionY) {
    super(id, positionX, positionY);
    this.setType("Archer");
    this.setType("Mage");
    this.setLife(40);
    this.setDamage(15);
    this.setDodgeChance(0.2);
    this.setRange(4);
  }
}
