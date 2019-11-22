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

function preload() {
    this.load.image("assassin", "../img/assassin.png");
    this.load.image("archer", "../img/archer.png");
    this.load.image("warrior", "../img/warrior.png");
    this.load.image("mage", "../img/mage.png");
    this.load.image("tileset", "../img/gridtiles.png");
    this.load.tilemapTiledJSON('map', '../img/map.json');
    this.load.image("car", "../img/car90.png");
}

function create() {

    var scene = this;

    //define o a distribuicao de tiles no mapa
    const level = new Array(16).fill(new Array(20).fill(0));
    //cria o mapa a partir de 'level' e define o tamanho em px de cada tile
    map = this.make.tilemap({ key: 'map' });
    //cria o o tileset a partir de uma imagem
    var tiles = map.addTilesetImage('tiles', 'tileset');
    //cria um objeto layer para renderizar os tiles
    var layer = map.createStaticLayer(0, tiles, 0, 0);

    // Marker that will follow the mouse
    marker = this.add.graphics();
    marker.lineStyle(3, 0xffffff, 1);
    marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);

    // ### Pathfinding stuff ###
    // Initializing the pathfinder
    this.finder = new EasyStar.js();
    var finder = this.finder;//para evitar problemas com this

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

    //numero de personagens em cada time
    var p_idx = [0, 0];
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
		p.flipX = true;
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
			if(time == 2) {
				personagens[novoPersonagemIndex - 1].flipX = true;
			}
            dragPersonagem(novoPersonagemIndex - 1, time);
            p_idx[time - 1] += 1;
        }
    }
    //configura as propriedades do drag and drop
    function dragPersonagem(index, time) {
        personagens[index].tint = time == 2 ? 0xff8888 : 0xffffff;
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
            if (!overlap && snapY <= 528) {
                this.setAlpha(1);
                if (!checkCollision(pointerTileX, pointerTileY)) {
                    if (time == 1 && pointerTileX > 0 && pointerTileX < 10) {
                        this.x = snapX;
                        this.y = snapY;
                    }
                    if (time == 2 && pointerTileX >= 10 && pointerTileX < 20) {
                        this.x = snapX;
                        this.y = snapY;
                    }
                }
            } else if (!overlap && pointer.y > 540) {
                this.setAlpha(0.3);
                this.x = pointer.x;
                this.y = pointer.y;
            }
        });
        //destroi personagens que saem da tela pela parte inferior
        personagens[index].on("pointerup", function (pointer) {
            if (pointer.y > 550) {
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

    // Handles the clicks on the map to make the character move
    this.input.on('pointerup', function(pointer){
        if(personagens[0] != undefined){
			if(finderInstanceId != undefined ||finderInstanceId != null){
				finder.cancelPath(finderInstanceId);
			}
			
            //arredonda para o tile mais proximo
            var toX = map.worldToTileX(pointer.x);
            var toY = map.worldToTileY(pointer.y);

            var fromX = map.worldToTileY(personagens[0].x);
            var fromY = map.worldToTileY(personagens[0].y);
			
            finderInstanceId = finder.findPath(fromX, fromY, toX, toY, function (path) {          
                if (path === null) {
                    console.warn("Path was not found.");
                } else {
                    console.log(path);
                    moveCharacter(path,0);
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
                targets: personagens[index],
                x: { value: ex * map.tileWidth + 16, duration: 200 },
                y: { value: ey * map.tileHeight + 16, duration: 200 }
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