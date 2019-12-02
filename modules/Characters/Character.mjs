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
        let _target = null;
        let _dodgeChange = 0.1;
        let _bt;
        let _path = null;
        let _scene;
        let _map;
        let _finder;

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
        this.getMap = () => _map;
        this.setMap = (map) => {
            _map = map;
        }
        this.getFinder = () => _finder;
        this.setFinder = (finder) => {
            _finder = finder;
        }
    }
    move() {
        var char = this;
        //detecta se ja existe alguma percurso sendo feito, 
        //entao cancela e chama a funcao novamente para o novo percurso
        if (char.movement && char.movement.isPlaying()) {
            const progress = char.movement.elapsed;
            const currentTweenIndex = char.movement.data.findIndex(tween => {
                return (tween.calculatedOffset + tween.duration) > progress;
            });

            const currentTween = char.movement.data[currentTweenIndex];

            if (currentTween) {
                currentTween.setCallback('onComplete', () => {
                    char.movement.destroy();
                    char.move();
                }, []);
            }
        }
        //console.log("(" + this.getId() + ")[" + this.getType() + "] is moving");
        // Sets up a list of tweens, one for each tile to walk, that will be chained by the timeline
        var tweens = [];
        var path = this.getPath();
        var scene = this.getScene();
        for (var i = 0; i < path.length - 2; i++) {
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
        char.movement = scene.tweens.timeline({
            tweens: tweens
        });
    }
    attack() {
        //console.log("(" + this.getId() + ")[" + this.getType() + "] is attacking");
        var char = this;
        var target = this.getTarget();
        if (target.getLife() > 0) {
            target.setLife(target.getLife() - this.getDamage() / 10);
        } else {
            return false;
        }
        return true;
    }
    getClosestEnemy(enemies) {
        if (enemies === null) {
            return false;
        }

        var char = this;
        var target = null;

        enemies.forEach(function (enemy) {
            if (target === null) { target = enemy; }
            if (char.getCharacterDistance(target) > char.getCharacterDistance(enemy)
                || target.getLife() <= 0) {
                target = enemy;
            }
        });
        console.log(target.getLife());
        if (target.getLife() <= 0) {
            return false;
        }
        this.setTarget(target);
        this.findPath();
        return true;
    }
    getCharacterDistance(char) {
        var x = Math.abs(this.getSprite().x - char.getSprite().x);
        var y = Math.abs(this.getSprite().y - char.getSprite().y);
        return (x * x + y * y);
    }
    findPath() {
        var map = this.getMap();
        var finder = this.getFinder();
        var char = this;
        var toX;
        var toY;
        //Caso nao tenha target, fica parado (recebendo como destino a propria posicao)
        if (char.getTarget() === null) {
            toX = map.worldToTileX(char.getSprite().x);
            toY = map.worldToTileX(char.getSprite().y);
        }
        else {
            toX = map.worldToTileX(char.getTarget().getSprite().x);
            toY = map.worldToTileX(char.getTarget().getSprite().y);
        }

        char.getTarget().prevX = char.getTarget().getSprite().x;
        char.getTarget().prevY = char.getTarget().getSprite().y;

        var fromX = map.worldToTileY(char.getSprite().x);
        var fromY = map.worldToTileY(char.getSprite().y);

        finder.findPath(fromX, fromY, toX, toY, function (path) {
            if (path === null) {
                console.warn("Path was not found.");
            } else {
                //seta path
                char.setPath(path);
            }
        });
        finder.calculate(); // don't forget, otherwise nothing happens
    }
}