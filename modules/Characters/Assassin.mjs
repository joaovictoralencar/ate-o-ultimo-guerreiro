import Character from "./Character.mjs";

export default class Assassin extends Character {
  constructor(id, positionX, positionY) {
    super(id, positionX, positionY);
    this.setType("Assassin");
    this.setLife(25);
    this.setDamage(25);
    this.setDodgeChance(0.3);
    this.setRange(1);
  }
}
