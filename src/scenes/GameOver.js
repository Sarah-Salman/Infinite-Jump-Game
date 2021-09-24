import Phaser from '../lib/phaser.js'

export default class GameOver extends Phaser.Scene {

    constructor(){
        super('game-over')
    }

    init (data){
        console.log('init', data)
        this.finalScore = data.score
    }
    create(){
        const width = this.scale.width
        const height = this.scale.height

        this.add.text(width*0.5, height*0.5, 'Game Over', {
            color: '#ffffff', fontSize: 48
        }).setOrigin(0.5)
        
        const value = this.finalScore
        console.log(value)
        if (value===0){
            this.add.text(width*0.5, height*0.2, 'Score: 0', {
                color: '#ffffff', fontSize: 30
            }).setOrigin(0.5)
        }
        else{
            this.add.text(width*0.5, height*0.2, `Score: ${value}`, {
            color: '#ffffff', fontSize: 30
            }).setOrigin(0.5)
        }

        this.input.keyboard.on('keydown-SPACE', ()=> {
            this.scene.start('game')
        })
    }
}