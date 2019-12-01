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
        let _bt;
        let _path;
        let _scene;

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

        this.getBt = () => _bt;
        this.setBt = (bt) => {
            _bt = bt;
        }
        this.getPath = () => _path;
        this.setPath = (path) => {
            _path = path;
        }
        this.getScene = () => _scene;
        this.setScene = (scene) => {
            _scene = scene;
        }
    }
    move() {
        console.log("(" + this.getId() + ")[" + this.getType() + "] is moving");
        // Sets up a list of tweens, one for each tile to walk, that will be chained by the timeline
        var tweens = [];
        var path = this.getPath();
        var scene = this.getScene();
        for (var i = 0; i < path.length - 1; i++) {
            var ex = path[i + 1].x;
            var ey = path[i + 1].y;
            tweens.push({
                targets: this.getSprite(),
                x: {
                    value: ex * 32 + 16,
                    duration: 200
                },
                y: {
                    value: ey * 32 + 16,
                    duration: 200
                }
            });
        }

        scene.tweens.timeline({
            tweens: tweens
        });
    }
    attack() {
        console.log("(" + this.getId() + ")[" + this.getType() + "] is attacking")
    }
}