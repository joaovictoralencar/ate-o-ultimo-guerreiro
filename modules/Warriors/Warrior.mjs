export default class Warrior {
    constructor(){
        let _id = 0;
        let _name = "Joe";
        let _type = "Guerreiro";
        let _life = 20;
        let _velocity = 1;
        let _physicalDamage = 2;
        let _magicDamage = 0;
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
    }
    move(){
        console.log(this.getName() + "("+this.getId()+")["+this.getType()+"] is moving")
    }
    attack(){
        console.log(this.getName() + "("+this.getId()+")["+this.getType()+"] is attacking")
    }
}