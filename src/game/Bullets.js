import Phaser from '../lib/phaser.js'

export default class Bullet extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y)
    {
        super(scene, x, y, 'weapon');
    }

    fire (x, y)
    {
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);

        this.setVelocityY(-300);
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

        if (this.y <= -32)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

class Bullets extends Phaser.Physics.Arcade.Group
{
    constructor (scene)
    {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 5,
            key: 'bullet',
            active: false,
            visible: false,
            classType: Bullet
        });
    }

    fireBullet (x, y)
    {
        let weapon = this.getFirstDead(false);

        if (weapon)
        {
            weapon.fire(x, y);
        }
    }
}

class Example extends Phaser.Scene
{
    constructor ()
    {
        super();

        this.weapon;
        this.enemy;
    }

    preload ()
    {
        this.load.image('weapon', 'assets/spikeBall_2.png');
        this.load.image('enemy-stand', 'assets/flyMan_still_stand.png');
    }

    create ()
    {
        this.weapon = new Bullets(this);

        this.enemy = this.add.image(400, 500, 'enemy');

        //this.input.on('pointermove', (pointer) => {

         //   this.enemy.x = this.enemy.x;

        //});

        this.setInterval(function (){this.weapon.fireBullet(this.enemy.x, this.enemy.y)}, 2000)

            ;

        ;
    }
}
