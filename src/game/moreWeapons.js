import Phaser from '../lib/phaser.js'

import Weapon from '../game/Weapon.js'

export default class Weapons extends Phaser.Physics.Arcade.Group{
    /**
     * @param {Phaser.Scene} scene  
     */

    constructor(scene){
        super(scene.physics.world, scene)
        this.weapon.createMutiple({
            frameQuantity: 3,
            key: 'weapon',
            active: false,
            visible: false,
            classType: Weapon
        })
    }
    create(){
    this.weapon = this.physics.add.group({
        classType: Weapon
    })}

    fireWeapon(x,y){
        let weapon = this.getFirstDead(false)
        if(weapon){
            weapon.fire(x,y)
        }
    }
} 