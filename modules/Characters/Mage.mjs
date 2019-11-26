import Character from "./Character.mjs";
export default class Mage extends Character {
  constructor(id, positionX, positionY) {
    super(id, positionX, positionY);
    this.setType("Mage");
    this.setLife(50);
    this.setDamage(5);
    this.setDodgeChance(0.15);
    this.setRange(2);
  }
}
