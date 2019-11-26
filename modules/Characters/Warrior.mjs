import Character from "./Character.mjs";
export default class Warrior extends Character {
  constructor(id, positionX, positionY) {
    super(id, positionX, positionY);
    this.setType("Warrior");
    this.setLife(100);
    this.setDamage(10);
    this.setDodgeChance(0.1);
    this.setRange(1);
  }
}
