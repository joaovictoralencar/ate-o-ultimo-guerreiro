var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 640,
    parent: "game", //id da div que está o exemplo
    physics: {
        default: "arcade"
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var game = new Phaser.Game(config);
var logo;
var map;

function preload() {
    this.load.image("assassin", "../img/assassin.png");
    this.load.image("archer", "../img/archer.png");
    this.load.image("warrior", "../img/warrior.png");
    this.load.image("mage", "../img/mage.png");
    this.load.image("tiles", "../img/gridtiles.png");
    this.load.image("car", "../img/car90.png");
}

function create() {
    //this.add.image(400, 300, 'sky');
    //cria 32 arrays de 32 com o valor 0
    //define o a distribuicao de tiles no mapa
    const level = new Array(16).fill(new Array(20).fill(0));
    //cria o mapa a partir de 'level' e define o tamanho em px de cada tile
    map = this.make.tilemap({
        data: level,
        tileWidth: 32,
        tileHeight: 32
    });
    //cria o o tileset a partir de uma imagem
    var tileset = map.addTilesetImage("tiles");
    //cria um objeto layer para renderizar os tiles
    var layer = map.createStaticLayer(0, tileset, 0, 0);
    //cria botoes para adicionar os personagens de cada time
    var time1 = [
        this.add.image(80, 592, "warrior"),
        this.add.image(112, 592, "mage"),
        this.add.image(144, 592, "assassin"),
        this.add.image(176, 592, "archer"),
    ];
    var time2 = [
        this.add.image(464, 592, "warrior"),
        this.add.image(496, 592, "mage"),
        this.add.image(528, 592, "assassin"),
        this.add.image(560, 592, "archer"),
    ];
    //vetor de personagens
    var personagens = [];
    //numero de personagens em cada time
    var p_idx = [0, 0];
    //maximo de personagens por time
    var p_max = 4;
    //Deixa as imagens interativas
    time1.forEach(function (p) {
        p.setInteractive({
            useHandCursor: true
        });
    });
    //Deixa as imagens interativas
    time2.forEach(function (p) {
        p.setInteractive({
            useHandCursor: true
        });
    });
    //Adiciona personagens no campo on click 
    //personagens dos times
    var p_times = ["warrior", "mage", "assassin", "archer"];
    //adicionar em time 1
    p_times.forEach(function (nome, idx) {
        time1[idx].on("pointerdown", function () {
            addPersonagem(nome, this, 1);
        });
    });
    //adicionar em time 2
    p_times.forEach(function (nome, idx) {
        time2[idx].on("pointerdown", function () {
            addPersonagem(nome, this, 2);
        });
    });
    //adiciona personagem. Recebe nome da imagem e contexto(this) e o time
    function addPersonagem(role, ctx, time) {
        if (p_idx[time - 1] < p_max) {
            //adiciona fisica e determina item como draggable
            var novoPersonagemIndex =
                personagens.push(ctx.scene.physics.add
                    .image(time == 1 ? 16 : 624, 16 + (p_idx[time - 1] * 32), role)
                    .setInteractive({
                        draggable: true,
                        useHandCursor: true
                    }));
            dragPersonagem(novoPersonagemIndex - 1, time);
            p_idx[time - 1] += 1;
        }
    }
    //configura as propriedades do drag and drop
    function dragPersonagem(index, time) {
        personagens[index].tint = time == 2 ? 0xdd0000 : 0xffffff;
        //listener para drag
        personagens[index].on("drag", function (pointer, dragX, dragY) {
            //arredonda para o tile mais proximo
            var pointerTileX = map.worldToTileX(pointer.x);
            var pointerTileY = map.worldToTileY(pointer.y);
            //faz o snap para as coordenadas do tile, transformando para coordenadas de mundo
            var snapX = map.tileToWorldX(pointerTileX) + 16;
            var snapY = map.tileToWorldY(pointerTileY) + 16;
            var overlap = false;
            //verifica sobreposicao
            personagens.forEach((p, idx) => {
                if (p != null && snapX == p.x && snapY == p.y) {
                    overlap = true;
                }
            });
            if (!overlap && snapY <= 496) {
                this.setAlpha(1);
                this.x = snapX;
                this.y = snapY;
            } else if (!overlap && pointer.y > 500) {
                this.setAlpha(0.3);
                this.x = pointer.x;
                this.y = pointer.y;
            }
        });
        personagens[index].on("pointerup", function (pointer) {
            if (pointer.y > 500) {
                this.destroy();
                personagens[index] = null;
                p_idx[time - 1]--;
            }
        });
        //faz colisao com as bordas
        personagens[index].setCollideWorldBounds(true);
    }
}

function update(time, delta) {}