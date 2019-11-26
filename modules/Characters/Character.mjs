export default class Character {
    constructor(id) {
        let _id = id;
        let _sprite;
        let _name = "Joe";
        let _type = "Character";
        let _life = 20;
        let _damage = 2;
        let _velocity = 1;
        let _atkSpeed = 1000; //em ms
        let _range = 1;
        let _target;
        let _dodgeChange = 0.1;


        this.getId = () => _id;
        this.setId = (id) => {
            _id = id
        }
        this.getId = () => _id;
        this.setId = (id) => {
            _id = id
        }
        this.getName = () => _name;
        this.setName = (name) => {
            _name = name
        }
        this.getType = () => _type;
        this.setType = (type) => {
            _type = type
        }
        this.getLife = () => _life;
        this.setLife = (life) => {
            _life = life
        }
        this.getVelocity = () => _velocity;
        this.setVelocity = (velocity) => {
            _velocity = velocity
        }
        this.getDamage = () => _damage;
        this.setDamage = (damage) => {
            _damage = damage
        }
        this.getSprite = () => _sprite;
        this.setSprite = (sprite) => {
            _sprite = sprite
        }
        this.getRange = () => _range;
        this.setRange = (range) => {
            _range = range
        }
        this.getTarget = () => _target;
        this.setTarget = (target) => {
            _target = target
        }
        this.getDodgeChance = () => _dodgeChange;
        this.setDodgeChance = (dodgeChange) => {
            _dodgeChange = dodgeChange
        }
        this.getAtkSpeed = () => _atkSpeed;
    }
    move() {
        console.log("(" + this.getId() + ")[" + this.getType() + "] is moving")
    }
    attack() {
        console.log("(" + this.getId() + ")[" + this.getType() + "] is attacking")
    }
}