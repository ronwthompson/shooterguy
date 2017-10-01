var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update })

function preload() {

    game.load.image('sky', 'assets/sky.png')
    game.load.image('ground', 'assets/platform.png')
    game.load.image('bullet', 'assets/bullet.png')
    game.load.atlasJSONHash('megaman', 'assets/characters/megaman/megamanFrames.png', 'assets/characters/megaman/megamanFrames.json')
}

var player, playerDirection, platforms, cursors, bullets, fireRate = 100, nextFire = 0, spaceKey


function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE)

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky')

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group()

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground')

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2)

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground')
    ledge.body.immovable = true

    ledge = platforms.create(-150, 250, 'ground')
    ledge.body.immovable = true

    // The player and its settings
    player = game.add.sprite(game.world.width - 150, game.world.height - 150, 'megaman', 16)
    player.anchor.setTo(0.5,0.5)
    player.scale.setTo(2,2)

    //  We need to enable physics on the player
    game.physics.arcade.enable(player)

    //  Player physics properties. 
    player.body.gravity.y = 400
    player.body.collideWorldBounds = true

    //  Our two animations, walking left and right.
    player.animations.add('left', [17,18,19,18], 7, true)
    player.animations.add('right', [17,18,19,18], 7, true)
    player.animations.add('jump', [6], 7, true)

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys()

    // add bullets
    bullets = game.add.group()
    bullets.enableBody = true
    bullets.physicsBodyType = Phaser.Physics.ARCADE

    bullets.createMultiple(3, 'bullet')
    bullets.setAll('checkWorldBounds', true)
    bullets.setAll('outOfBoundsKill', true)

    // create space key
    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

    // stop space from propogating to browser
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ])

    // // set workd bounds to allow camera to follow the player
    // game.world.setBounds(0, 0, 1920, 1440)

    // // making the camera follow the player
    // game.camera.bounds = null
    // game.camera.follow(this.hero, Phaser.Camera.FOLLOW_PLATFORMER, 0.1, 0.1)
    
}

function update() {

    //  Collide the player with the platforms
    var hitPlatform = game.physics.arcade.collide(player, platforms)
    game.physics.arcade.collide(platforms)

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150
        player.animations.play('left')
        player.scale.setTo(-2,2)
        playerDirection = 'left'
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150
        player.animations.play('right')
        player.scale.setTo(2,2)
        playerDirection = 'right'
    }
    else
    {
        //  Stand still
        player.animations.stop()
        player.frame = 16
        
    }

    if (!player.body.touching.down){
        player.animations.play('jump')
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && hitPlatform)
    {
        player.body.velocity.y = -350
    }

    // fire a bullet if space is pressed
    if (this.spaceKey.isDown){
        fire()
    }

}

function fire(){
    if (game.time.now > nextFire && bullets.countDead() > 0){
        nextFire = game.time.now + fireRate
        var bullet = bullets.getFirstDead()
        bullet.reset(player.x - 8, player.y- 8)
        if (playerDirection == 'left'){
            bullet.body.velocity.x = -200
        } else{
            bullet.body.velocity.x = 200
        }
    }
}

// function render(){
//     game.debug.body(player)
// }