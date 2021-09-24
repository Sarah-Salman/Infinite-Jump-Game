import Phaser from '../lib/phaser.js'

import Carrot from '../game/Carrot.js'

import Enemy from '../game/Enemy.js' 

import Bullets from '../game/Bullets.js' 

import Bullet from '../game/Bullets.js'

//import Weapon from '../game/Weapon.js'

//import Weapons from '../game/moreWeapons.js'

export default class Game extends Phaser.Scene {
    carrotsCollected = 0
    
    check=0
    //weapon

    /**@type {Physics.GameObjects.Text} */
    carrotsCollectedText

    /** @type {Phaser.Physics.Arcade.Sprite} */
    player

    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    platforms

    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors

    /**@type {Phaser.Physics.Arcade.Group}*/
    carrots

    constructor()
    {
        super('game')
    }

    init(){
        this.carrotsCollected = 0
    }

    preload()
    {
        //loading bg
        this.load.image('background', 'assets/bg_layer1.png')

        //loading platforms
        this.load.image('platform', 'assets/ground_grass.png')

        //loading character
        this.load.image('bunny-stand', 'assets/bunny2_stand.png')
        this.load.image('bunny-jump', 'assets/bunny2_jump.png')

        //loading enemy
        this.load.image('enemy-stand', 'assets/flyMan_still_stand.png')
        

        this.load.image('carrot', 'assets/carrot.png')

        this.cursors = this.input.keyboard.createCursorKeys()

        this.load.audio('jump', 'assets/sfx/phaseJump1.ogg')
        this.load.audio('jump2', 'assets/sfx/zapThreeToneDown.ogg')
    }

    create()
    {
        this.add.image(240, 320, 'background').setScrollFactor(1,0)

        this.platforms = this.physics.add.staticGroup()
        for(let i=0; i<5; i++){
            const x = Phaser.Math.Between(80, 400)
            const y = 160 * i

            const platform = this.platforms.create(x, y, 'platform')
            platform.scale=0.5

            const body = platform.body
            body.updateFromGameObject()
        }
        this.player = this.physics.add.sprite(240, 320,  'bunny-stand').setScale(0.5)
        this.physics.add.collider(this.platforms, this.player)

        this.player.body.checkCollision.up = false
        this.player.body.checkCollision.right = false
        this.player.body.checkCollision.left = false

        this.cameras.main.startFollow(this.player)

        this.cameras.main.setDeadzone(this.scale.width*1.5)

        this.carrots = this.physics.add.group({
            classType: Carrot
        })
        this.carrots.get(50, -600, 'carrot')
        this.physics.add.collider(this.platforms, this.carrots)

        this.physics.add.overlap(this.player, this.carrots, this.handleCollectCarrot, undefined, this)

        

        const style = {color: 'red', fontSize: 24}
        this.carrotsCollectedText = this.add.text(240, 10, 'Carrots: 0', style).setScrollFactor(0).setOrigin(0.5, 0)

        this.enemy = this.physics.add.group({
            classType: Enemy
        })
        this.enemy.get(50, -600, 'enemy-stand')
        this.physics.add.collider(this.platforms, this.enemy)
        this.physics.add.overlap(this.player, this.enemy, this.enemyGameOver, undefined, this)

        //this.weapon = this.physics.add.group({
        //    classType: Weapon
        //})

        //this.weapons = new Weapons(this)
    }

    

    update()
    {
        const touchingDown = this.player.body.touching.down
        if (touchingDown){
            this.player.setVelocityY(-300)
            this.player.setTexture('bunny-jump')
            this.sound.play('jump')
        }

        const vy = this.player.body.velocity.y
        if (vy>0 && this.player.texture.key !=='bunny-stand'){
            this.player.setTexture('bunny-stand')
        }

        if(this.cursors.left.isDown && !touchingDown){
            this.player.setVelocityX(-200)
        }

        else if(this.cursors.right.isDown && !touchingDown){
            this.player.setVelocityX(200)
        }

        else{
            this.player.setVelocityX(0)
        }

        this.platforms.children.iterate(child =>{
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = child
            const scrollY = this.cameras.main.scrollY
            if (platform.y >= scrollY+700){
                platform.y = scrollY - Phaser.Math.Between(60, 100)
                platform.body.updateFromGameObject()

                this.addCarrotAbove(platform)
                this.check++
                if((this.check)%4===0){
                    this.addEnemyAbove(platform)
                }  
            }
        })

        this.horizontalWrap(this.player)

        const bottomPlatform = this.findBottomMostPlatform()
        if(this.player.y > bottomPlatform.y +200){
            this.scene.start('game-over')
        }
    }
    /*** @param {Phaser.GameObjects.Sprite} sprite*/
    horizontalWrap(sprite){
        const halfWidth = sprite.displayWidth *0.5
        const gameWidth = this.scale.width
        if(sprite.x < -halfWidth){
            sprite.x = gameWidth + halfWidth
        }
        else if (sprite.x > gameWidth + halfWidth){
            sprite.x = -halfWidth
        }
    }

    /**
    * @param {Phaser.GameObjects.Sprite} sprite*/
    addCarrotAbove(sprite){
        const y = sprite.y - sprite.displayHeight
        /** @type {Phaser.Physics.Arcade.Sprite} */
        const carrot = this.carrots.get(sprite.x, y, 'carrot')
        
        carrot.setActive(true)
        carrot.setVisible(true)
        
        this.add.existing(carrot)

        carrot.body.setSize(carrot.width, carrot.height)
        this.physics.world.enable(carrot)
        return carrot
    }

    /**
    * @param {Phaser.Physics.Arcade.Sprite} player
    * @param {Carrot} carrot
    */
    handleCollectCarrot(player, carrot){
        this.carrots.killAndHide(carrot)
        this.physics.world.disableBody(carrot.body)
        this.carrotsCollected++
        const value = `Carrots: ${this.carrotsCollected}`
        this.carrotsCollectedText.text = value
    }

    findBottomMostPlatform(){
        const platforms = this.platforms.getChildren()
        let bottomPlatform = 0

        for (let i=1; i<platforms.length; i++){
            const platform = platforms[i]
            if (platform.y < bottomPlatform.y){
                continue
            }
            bottomPlatform=platform
        }
        return bottomPlatform
    }

    /**
     * @param {Phaser.GameObjects.Sprite} sprite */
    addEnemyAbove(sprite){
        const y = sprite.y - sprite.displayHeight
        /** @type {Phaser.Physics.Arcade.Sprite} */
        const enemy = this.enemy.get(sprite.x, y, 'enemy-stand')
        
        enemy.setActive(true)
        enemy.setVisible(true)
        
        this.add.existing(enemy)

        enemy.body.setSize(enemy.width, enemy.height)
        this.physics.world.enable(enemy)

            //this.weapons.fireBullet(this.enemy.x,this.enemy.y)
        
        return enemy
    }
    
    enemyGameOver(player, enemy){
       
        this.scene.start('game-over', {score: this.carrotsCollected})
    }
}