import Phaser from '../lib/phaser.js'

export default class Weapon extends Phaser.Physics.Arcade.Sprite{
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y 
     * @param {string} texture  
     */

    constructor(scene, x, y){
        super(scene, x, y, texture)
        //this.setScale(0.2)
    }

    fire(x,y){
        this.body.reset(x,y)
        this.setActive(true)
        this.setVisible(true)

        this.setVelocity(-300)

    }

    preUpdate(time, delta){
        super.preUpdate(time,delta)
        if (this.y<=-32){
            this.setActive(false)
            this.setVisible(false)
        }
    }
} 