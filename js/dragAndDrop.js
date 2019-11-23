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
//vetor de personagens
var personagens = [];
//tilemap
var map;
//marcador do tile
var marker;
//propriedades dos tiles
var properties;
//instancia do finder do A*
var finderInstanceId;
//vetor de personagens
var personagenst1 = [];
var personagenst2 = [];
//maximo de personagens por time
var MAX_PERSONAGENS = 4;
//Determina se os times estão prontos
var Ready = {};
Ready.time1 = false;
Ready.time2 = false;

function preload() {
    this.load.image("assassin", "../img/assassin.png");
    this.load.image("archer", "../img/archer.png");
    this.load.image("warrior", "../img/warrior.png");
    this.load.image("mage", "../img/mage.png");
    this.load.image("tileset", "../img/gridtiles.png");
    this.load.spritesheet('readyBtn', "../img/readyBtn.png", { frameWidth: 96, frameHeight: 32 });
    this.load.tilemapTiledJSON('map', '../img/map.json');
    this.load.image("car", "../img/car90.png");
}

function create() {

    var scene = this;

    //define o a distribuicao de tiles no mapa
    const level = new Array(16).fill(new Array(20).fill(0));
    //cria o mapa a partir de 'level' e define o tamanho em px de cada tile
    map = this.make.tilemap({
        key: 'map'
    });
    //cria o o tileset a partir de uma imagem
    var tiles = map.addTilesetImage('tiles', 'tileset');
    //cria um objeto layer para renderizar os tiles
    var layer = map.createStaticLayer(0, tiles, 0, 0);

    // Marker that will follow the mouse
    marker = this.add.graphics();
    marker.lineStyle(3, 0xffffff, 1);
    marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);

    //Botoes de pronto para os times
    Ready.spritet1 = this.add.sprite(256,592,'readyBtn',3).setInteractive({useHandCursor: true});
    Ready.spritet2 = this.add.sprite(384,592,'readyBtn',3).setInteractive({useHandCursor: true});
    setReadyButtonsEvents(scene);//faz o set dos eventos do mouse nos botões

    // ### Pathfinding stuff ###
    // Initializing the pathfinder
    this.finder = new EasyStar.js();
    var finder = this.finder; //para evitar problemas com this

    // We create the 2D array representing all the tiles of our map
    var grid = [];
    for (var y = 0; y < map.height; y++) {
        var col = [];
        for (var x = 0; x < map.width; x++) {
            // In each cell we store the ID of the tile, which corresponds
            // to its index in the tileset of the map ("ID" field in Tiled)
            col.push(getTileID(x, y));
        }
        grid.push(col);
    }
    finder.setGrid(grid);

    var tileset = map.tilesets[0];
    properties = tileset.tileProperties;
    var acceptableTiles = [];

    // We need to list all the tile IDs that can be walked on. Let's iterate over all of them
    // and see what properties have been entered in Tiled.
    for (var i = tileset.firstgid - 1; i < tiles.total; i++) { // firstgid and total are fields from Tiled that indicate the range of IDs that the tiles can take in that tileset
        if (!properties.hasOwnProperty(i)) {
            // If there is no property indicated at all, it means it's a walkable tile
            acceptableTiles.push(i + 1);
            continue;
        }
        if (!properties[i].collide) acceptableTiles.push(i + 1);
        if (properties[i].cost) this.finder.setTileCost(i + 1, properties[i].cost); // If there is a cost attached to the tile, let's register it
    }
    finder.setAcceptableTiles(acceptableTiles);


    //cria botoes para adicionar os personagens de cada time
    var time1 = [
        scene.physics.add.image(80, 592, "warrior"),
        scene.physics.add.image(112, 592, "mage"),
        scene.physics.add.image(144, 592, "assassin"),
        scene.physics.add.image(176, 592, "archer"),
    ];
    var time2 = [
        scene.physics.add.image(464, 592, "warrior"),
        scene.physics.add.image(496, 592, "mage"),
        scene.physics.add.image(528, 592, "assassin"),
        scene.physics.add.image(560, 592, "archer"),
    ];

    //Deixa as imagens interativas
    time1.forEach(function (p) {
        p.time = 1;
        p.setInteractive({
            useHandCursor: true,
            draggable: true //deixa o personagens do time 1 da loja draggables
        });
        p.on("pointerdown", function () {
            if(personagenst1.length < MAX_PERSONAGENS)
                dragPersonagem(this, p);
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
            if(personagenst2.length < MAX_PERSONAGENS)
                dragPersonagem(this, p);
        });
        p.flipX = true;
    });
    //configura as propriedades do drag and drop
    function dragPersonagem(person) {
        // adiciona um personagem na loja para ficar no lugar dele
        if (person.y > 546) {
            var novoPersonLoja = scene.physics.add.image(person.x, person.y, person.texture.key, ).setInteractive({
                useHandCursor: true,
                draggable: true //deixa o novo personagem da loja draggable
            });

                novoPersonLoja.time = person.time;
                if (novoPersonLoja.time === 2) novoPersonLoja.flipX = true;
                novoPersonLoja.on("pointerdown", function () {
                    var numPerson;
                    if(person.time === 1) numPerson = personagenst1.length; //checa quantos personagens o jogador tem
                    if(person.time === 2) numPerson = personagenst2.length; //checa quantos personagens o jogador tem
                    if(numPerson < MAX_PERSONAGENS) {
                        dragPersonagem(this, novoPersonLoja);
                    }
                });
        }
        // se o personagem for do time 2, já pinta ele, se não, vai normal
        person.tint = person.time == 2 ? 0xdd0000 : 0xffffff;

        //o que acontece quando o personagem é movido
        person.on("drag", function (pointer, dragX, dragY) {
            //Não executa a função para o time que estiver pronto
            if( (person.time === 1 && Ready.time1) || (person.time === 2 && Ready.time2)) {
                return;
            }

            //arredonda para o tile mais proximo
            var pointerTileX = map.worldToTileX(pointer.x);
            var pointerTileY = map.worldToTileY(pointer.y);
            var canPlace = canPlacePersonOnBoard(pointer, this)
            var snapX = getSnapX(pointer)
            var snapY = getSnapY(pointer)
            // Se não tiver em cima de outro personagem, for colocando dentro da área do tabuleiro e o número de personagens for menor que o máximo
            if (canPlace) {
                this.setAlpha(1);
                if (!checkCollision(pointerTileX, pointerTileY)) {
                    if (person.time == 1 && pointerTileX > 0 && pointerTileX < 10) {
                        this.x = snapX;
                        this.y = snapY;
                    }
                    if (person.time == 2 && pointerTileX >= 10 && pointerTileX < 20) {
                        this.x = snapX;
                        this.y = snapY;
                    }
                }
                //this.x = snapX;
                //this.y = snapY;
            } else if (!canPlace && pointer.y > 546) {
                this.setAlpha(0.3);
                this.x = pointer.x;
                this.y = pointer.y;
            }

            //adiciona personagem ao vetor
            if(pointer.y < 546) {
                if (canPlacePersonOnBoard(pointer, this)) {
                    if (!checkCollision(pointerTileX, pointerTileY)) {
                        if (this.time === 1 && pointerTileX > 0 && pointerTileX < 10) {
                            personagenst1.push(person)
                        }
                        if (this.time === 2 && pointerTileX >= 10 && pointerTileX < 20) {
                            personagenst2.push(person);
                        }
                    }
                }
            }

        });

        person.on("pointerup", function (pointer) {
            if (pointer.y > 546) {
                this.destroy();
                personagenst1 = personagenst1.filter(e => {
                    return e != this
                })
                personagenst2 = personagenst2.filter(e => {
                    return e != this
                })
            }
        });
        //faz colisao com as bordas
        console.log(person)
        person.setCollideWorldBounds(true);
    }

    function canPlacePersonOnBoard(pointer, person) {
        //faz o snap para as coordenadas do tile, transformando para coordenadas de mundo
        var snapX = getSnapX(pointer)
        var snapY = getSnapY(pointer)
        var overlap = false;
        //verifica sobreposicao
        if (person.time === 1) {
            personagenst1.forEach(p => {
                if (p != null && snapX == p.x && snapY == p.y) {
                    overlap = true;
                }
            });
        } else if (person.time === 2) {
            personagenst2.forEach(p => {
                if (p != null && snapX == p.x && snapY == p.y) {
                    overlap = true;
                }
            });
        }
        if (!overlap && snapY <= 546) {
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

    // Handles the clicks on the map to make the character move
    this.input.on('pointerup', function (pointer) {
        if (personagenst1[0] != undefined) {
            if (finderInstanceId != undefined || finderInstanceId != null) {
                finder.cancelPath(finderInstanceId);
            }

            //arredonda para o tile mais proximo
            var toX = map.worldToTileX(pointer.x);
            var toY = map.worldToTileY(pointer.y);

            var fromX = map.worldToTileY(personagenst1[0].x);
            var fromY = map.worldToTileY(personagenst1[0].y);

            finderInstanceId = finder.findPath(fromX, fromY, toX, toY, function (path) {
                if (path === null) {
                    console.warn("Path was not found.");
                } else {
                    console.log(path);
                    moveCharacter(path, 0);
                }
            });
            finder.calculate(); // don't forget, otherwise nothing happens
        }
    });

    function moveCharacter(path, index) {
        // Sets up a list of tweens, one for each tile to walk, that will be chained by the timeline
        var tweens = [];
        for (var i = 0; i < path.length - 1; i++) {
            var ex = path[i + 1].x;
            var ey = path[i + 1].y;
            tweens.push({
                targets: personagenst1[index],
                x: {
                    value: ex * map.tileWidth + 16,
                    duration: 200
                },
                y: {
                    value: ey * map.tileHeight + 16,
                    duration: 200
                }
            });
        }

        scene.tweens.timeline({
            tweens: tweens
        });
    };
}

function update(time, delta) {
    var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

    // Rounds down to nearest tile
    var pointerTileX = map.worldToTileX(worldPoint.x);
    var pointerTileY = map.worldToTileY(worldPoint.y);
    marker.x = map.tileToWorldX(pointerTileX);
    marker.y = map.tileToWorldY(pointerTileY);
    marker.setVisible(!checkCollision(pointerTileX, pointerTileY));
}

function getTileID(x, y) {
    var tile = map.getTileAt(x, y);
    return tile.index;
};

function checkCollision(x, y) {
    var tile = map.getTileAt(x, y);
    if (properties[tile.index] != undefined) {
        return properties[tile.index].collide == true;
    }
    return tile.properties.collide == true;
};

function setReadyButtonsEvents(scene) {
    //time 1
    Ready.spritet1.on("pointerover", function(pointer){
        this.setFrame(Ready.time1 ? 1 : 4);
    });
    Ready.spritet1.on("pointerout", function(pointer){
        this.setFrame(Ready.time1 ? 0 : 3);
    });
    Ready.spritet1.on("pointerdown", function(pointer){
        this.setFrame(Ready.time1 ? 2 : 5);
    });
    Ready.spritet1.on("pointerup", function(pointer){
        Ready.time1 = !Ready.time1; 
        this.setFrame(Ready.time1 ? 1 : 4);
        if(Ready.time1 && Ready.time2)
            startBattle(scene);
    });
    
    //time 2
    Ready.spritet2.on("pointerover", function(pointer){
        this.setFrame(Ready.time2 ? 1 : 4);
    });
    Ready.spritet2.on("pointerout", function(pointer){
        this.setFrame(Ready.time2 ? 0 : 3);
    });
    Ready.spritet2.on("pointerdown", function(pointer){
        this.setFrame(Ready.time2 ? 2 : 5);
    });
    Ready.spritet2.on("pointerup", function(pointer){
        Ready.time2 = !Ready.time2; 
        this.setFrame(Ready.time2 ? 1 : 4);
        if(Ready.time1 && Ready.time2)
            startBattle(scene);
    });
}

//faz o countdown para começar a batalha
function startBattle(scene) {
    var n = 3;
    var text = scene.add.text(320,256, n, {font: "64px Arial"});
    text.setOrigin(0.5);

    timedEvent = scene.time.addEvent({ delay: 1000, callback: function() {
        n -= 1;
        text.setText(n<1?"Batalhar!":n);
        if(n<0)text.destroy();
    }, callbackScope: scene, repeat: 3 });
}