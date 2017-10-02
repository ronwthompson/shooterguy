var game = new Phaser.Game(256, 240, Phaser.AUTO, '', { preload: preload, create: create, update: update },'',false)

function preload() {
    game.load.image('bullet', 'assets/bullet.png')
    game.load.tilemap('elecmanStage', 'assets/stages/elecman/elecmanTileMap.json', null, Phaser.Tilemap.TILED_JSON)
    game.load.image('elecmanTiles', 'assets/stages/elecman/elecmanTiles.png')
    game.load.atlasJSONHash('megaman', 'assets/characters/megaman/megamanFrames.png', 'assets/characters/megaman/megamanFrames.json')
}

var player, playerDirection, platforms, cursors, bullets, fireRate = 150, nextFire = 0, spaceKey, elecBackTiles, elecPlatTiles

var backs = [6,9,10,11,12,13,14,15,17,18,19,20,21,22,23]
var plats = [1,2,3,4,5,7,8,16,25,26,27,28,29,31,32,33,34,35,36,37,38]
var ladds = [24]

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE) //enable the Arcade Physics system
    
    var map = game.add.tilemap('elecmanStage')
    map.addTilesetImage('elecman', 'elecmanTiles')

    elecBackTiles = map.createLayer('Background')
    //elecBackTiles.scale.set(3.125)
    elecPlatTiles = map.createLayer('Platforms')
    //elecPlatTiles.scale.set(3.125)

    // var newScale = 3.125;
    // this.world.scale.setTo(newScale,newScale);

    map.setCollision(plats, true, 'Platforms')
    elecPlatTiles.debug = true

    player = game.add.sprite(128, 0, 'megaman', 16) // player and its settings
    player.anchor.setTo(0.5,0.5)
    //player.scale.setTo(3.125,3.125)
    game.physics.arcade.enable(player) //enable physics on the player

    player.body.gravity.y = 1500 //player physics properties 
    player.body.collideWorldBounds = true

    player.animations.add('left', [17,18,19,18], 7, true) //player animations
    player.animations.add('right', [17,18,19,18], 7, true)
    player.animations.add('standShoot', [11], 1, true)
    player.animations.add('jump', [6], 7, true)

    cursors = game.input.keyboard.createCursorKeys() //game controls
    
    bullets = game.add.group() //add bullets
    bullets.enableBody = true
    bullets.physicsBodyType = Phaser.Physics.ARCADE

    bullets.createMultiple(3, 'bullet') //max 3 bullets on screen at a time
    bullets.setAll('checkWorldBounds', true)
    bullets.setAll('outOfBoundsKill', true)

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    
    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR) //create space key
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]) //stop space from propogating to browser

    // making the camera follow the player
    game.world.setBounds(0,0,256,480)
    //game.camera.bounds = (0,0,256,480)
    // game.camera.x = 0
    // game.camera.y = 240
    game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER, 0.1, 0.1)    
}

function update() {
    var hitPlatform = game.physics.arcade.collide(player, elecPlatTiles, function(){console.log()}) //collide the player with the platforms
    player.body.velocity.x = 0 //reset the players velocity

    if (cursors.left.isDown){ //move to the left
        player.body.velocity.x = -150
        player.animations.play('left')
        player.scale.setTo(-1,1)
        playerDirection = 'left'
    } else if (cursors.right.isDown){ //move to the right
        player.body.velocity.x = 150
        player.animations.play('right')
        player.scale.setTo(1,1)
        playerDirection = 'right'
    } else{ //stand still
        player.animations.stop()
        player.frame = 16
    }
    if (cursors.up.isDown && player.body.onFloor() && hitPlatform){ //allow the player to jump if they are touching the ground
        player.body.velocity.y = -550
    }
    if (!player.body.onFloor()){ //jumping animation
        player.animations.play('jump')
    }

    if (this.spaceKey.isDown){ //fire a bullet if space is pressed
        if (game.time.now > nextFire && bullets.countDead() > 0){
            player.animations.play('standShoot')
            fire()
        }
    }
    game.debug.body(player)
}

function fire(){ //function to fire a bullet
    nextFire = game.time.now + fireRate
    var bullet = bullets.getFirstDead()
    bullet.reset(player.x - 8, player.y- 8)
    if (playerDirection == 'left'){
        bullet.body.velocity.x = -500
    } else{
        bullet.body.velocity.x = 500
    }
}

// function render(){
//     game.debug.body(player)
//     elecPlatTiles.debug = true
// }