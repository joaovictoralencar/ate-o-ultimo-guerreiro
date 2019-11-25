export default class Warrior {
    constructor(id, positionX, positionY) {
        let _id = id;
        let _name = "Joe";
        let _type = "Guerreiro";
        let _life = 20;
        let _velocity = 2;
        let _physicalDamage = 2;
        let _magicDamage = 0;
        let _position = {
            x: positionX,
            y: positionY
        }
        let _range = 1;
        let _target;

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
        this.getPhysicalDamage = () => _physicalDamage;
        this.setPhysicalDamage = (physicalDamage) => {
            _physicalDamage = physicalDamage
        }
        this.getMagicDamage = () => _magicDamage;
        this.setMagicDamage = (magicDamage) => {
            _magicDamage = magicDamage
        }
        this.getPosition = () => _position;
        this.setPosition = (position) => {
            _position = position
        }
        this.getRange = () => _range;
        this.setRange = (range) => {
            _range = range
        }
        this.getTarget = () => _target;
        this.setTarget = (target) => {
            _target = target
        }
    }
    move() {
        console.log(this.getName() + "(" + this.getId() + ")[" + this.getType() + "] is moving")
        this.getPosition().x+=this.getVelocity();
    }
    attack() {
        console.log(this.getName() + "(" + this.getId() + ")[" + this.getType() + "] is attacking")
    }
}