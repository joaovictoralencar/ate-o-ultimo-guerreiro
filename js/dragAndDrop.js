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

    //cria uma linha que separa os times
    var line = new Phaser.Geom.Line(320, 0, 320, 640); // cria uma linha
    var graphics = this.add.graphics({
        lineStyle: {
            width: 4,
            color: 0xaa00aa
        }
    }); //cria uma variável gráfico para desenhar coisas na tela
    graphics.strokeLineShape(line); //adiciona o stroke a linha
    graphics.lineStyle(2, 0x00aa00); //cor de grossura

    //cria botoes para adicionar os personagens de cada time
    var time1 = [
        //adicionei física ao bonecos da interface da loja para que eles pudessem ser arrastados
        this.physics.add.image(80, 592, "warrior"),
        this.physics.add.image(112, 592, "mage"),
        this.physics.add.image(144, 592, "assassin"),
        this.physics.add.image(176, 592, "archer"),
    ];
    var time2 = [
        //adicionei física ao bonecos da interface da loja para que eles pudessem ser arrastados
        this.physics.add.image(464, 592, "warrior"),
        this.physics.add.image(496, 592, "mage"),
        this.physics.add.image(528, 592, "assassin"),
        this.physics.add.image(560, 592, "archer"),
    ];
    //vetor de personagens
    var personagenst1 = [];
    var personagenst2 = [];

    //maximo de personagens por time
    var MAX_PERSONAGENS = 4;
    //Deixa as imagens interativas
    time1.forEach(function (p) {
        p.time = 1;
        p.setInteractive({
            useHandCursor: true,
            draggable: true //deixa o personagens do time 1 da loja draggables
        });
        p.on("pointerdown", function () {
            dragPersonagem(this, p)
        });
    });
    //Deixa as imagens interativas
    time2.forEach(function (p) {
        p.time = 2;
        p.setInteractive({
            useHandCursor: true,
            draggable: true //deixa o personagens do time 2 da loja draggables
        });
        p.on("pointerdown", function () {
            dragPersonagem(this, p);
        });
    });
    //configura as propriedades do drag and drop
    function dragPersonagem(contexto, person) {
        // adiciona um personagem na loja para ficar no lugar dele
        if (person.y > 500) {
            var novoPersonLoja = contexto.scene.physics.add.image(person.x, person.y, person.texture.key, ).setInteractive({
                useHandCursor: true,
                draggable: true //deixa o novo personagem da loja draggable
            });
            novoPersonLoja.time = person.time;
            novoPersonLoja.on("pointerdown", function () {
                dragPersonagem(this, novoPersonLoja)
            });

        }
        // se o personagem for do time 2, já pinta ele, se não, vai normal
        person.tint = person.time == 2 ? 0xdd0000 : 0xffffff;

        //o que acontece quando o personagem é movido
        person.on("drag", function (pointer, dragX, dragY) {
            var canPlace = canPlacePersonOnBoard(pointer, this)
            var snapX = getSnapX(pointer)
            var snapY = getSnapY(pointer)
            // Se não tiver em cima de outro personagem, for colocando dentro da área do tabuleiro e o número de personagens for menor que o máximo
            if (canPlace) {
                this.setAlpha(1);
                this.x = snapX;
                this.y = snapY;
            } else if (!canPlace && pointer.y > 515) {
                this.setAlpha(0.3);
                this.x = pointer.x;
                this.y = pointer.y;
            }
        });

        person.on("pointerup", function (pointer) {
            if (pointer.y > 500) {
                this.destroy();
                personagenst1 = personagenst1.filter(e => {
                    return e != this
                })
                personagenst2 = personagenst2.filter(e => {
                    return e != this
                })
            } else {
                if (canPlacePersonOnBoard(pointer, this)) {
                    if (this.time === 1) personagenst1.push(person)
                    else personagenst2.push(person)
                }
            }
        });
        //faz colisao com as bordas
        person.setCollideWorldBounds(true);
    }

    function canPlacePersonOnBoard(pointer, person) {
        //faz o snap para as coordenadas do tile, transformando para coordenadas de mundo
        var snapX = getSnapX(pointer)
        var snapY = getSnapY(pointer)
        var overlap = false;
        var numPerson = 0;
        //verifica sobreposicao
        if (person.time === 1) {
            numPerson = personagenst1.length; //checa quantos personagens o jogador tem
            personagenst1.forEach(p => {
                if (p != null && snapX == p.x && snapY == p.y) {
                    overlap = true;
                }
            });
        } else if (person.time === 2) {
            numPerson = personagenst2.length; //checa quantos personagens o jogador tem
            personagenst2.forEach(p => {
                if (p != null && snapX == p.x && snapY == p.y) {
                    overlap = true;
                }
            });
        }
        if (!overlap && snapY <= 496 && numPerson < MAX_PERSONAGENS) {
            return true;
        } else {
            return false;
        }
    }

    function getSnapX(pointer) {
        //arredonda para o tile mais proximo
        var pointerTileX = map.worldToTileX(pointer.x);
        //faz o snap para as coordenadas do tile, transformando para coordenadas de mundo
        var snapX = map.tileToWorldX(pointerTileX) + 16;
        return snapX
    }

    function getSnapY(pointer) {
        //arredonda para o tile mais proximo
        var pointerTileY = map.worldToTileY(pointer.y);
        //faz o snap para as coordenadas do tile, transformando para coordenadas de mundo
        var snapY = map.tileToWorldY(pointerTileY) + 16;
        return snapY
    }
}

function update(time, delta) {}