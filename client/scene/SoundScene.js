const LEFT_OF_SOUND_SLIDER = {
    x: 62.5,
    y: 25
};
const RIGHT_OF_SOUND_SLIDER = {
    x: 162.5,
    y: 25
};
class SoundScene extends BaseScene {
    constructor() {
        super('SoundScene');
        this.soundSlider = null;
        this.soundButton = null;
    }

    /**
     * Phaser-preload
     * @memberof LoadScene
     */
    preload() {
        this.load.image('soundBar', 'assets/sound/SoundBar.png');
        this.load.image('soundSlider', 'assets/sound/SoundSlider.png');
        this.load.spritesheet('soundButton', 'assets/sound/SoundButton.png', {
            frameWidth: 40,
            frameHeight: 40
        });


    }

    /**
     * Phaser-create
     * @memberof LoadScene
     */
    create() {
        let self = this;
        //// create sound bar
        let soundBar = this.add.image(113, 25, 'soundBar');
        soundBar.visible = false;
        //// create sound slider
        this.soundSlider = this.add.image(RIGHT_OF_SOUND_SLIDER.x, RIGHT_OF_SOUND_SLIDER.y, 'soundSlider').setInteractive();
        this.soundSlider.visible = false;
        this.input.setDraggable(this.soundSlider);
        this.input.on('drag', function (pointer, slider, dragX, dragY) {
            self.onDragSlider(dragX);
        });
        //// create sound button
        this.soundButton = this.add.sprite(25, 25, 'soundButton').setInteractive();
        this.soundButton.on('pointerup', function (pointer) {
            soundBar.visible = !soundBar.visible;
            self.soundSlider.visible = !self.soundSlider.visible;
        });
        
        super.create();
    }

    /**
     * 執行動作事件
     * @param {string} type
     * @param {object} data
     * @memberof FrontCoverScene
     */
    action(type, data) {
        if (!super.action(type, data)) {
            return;
        }

        switch (type) {
            case ActionType.GAME_INIT:
                this.onWake();
                this.onHandleVolume();
                break;
        }
    }

    /**
     * 拖曳捲軸塊
     * @param {number} dragX
     * @memberof WatchGameLog
     */
    onDragSlider(dragX) {
        this.soundSlider.x = dragX;
        if (this.soundSlider.x < LEFT_OF_SOUND_SLIDER.x) {
            this.soundSlider.x = LEFT_OF_SOUND_SLIDER.x;
        } else if (this.soundSlider.x > RIGHT_OF_SOUND_SLIDER.x) {
            this.soundSlider.x = RIGHT_OF_SOUND_SLIDER.x;
        }

        this.onHandleVolume();
    }

    /**
     * 調整音量
     * @memberof SoundScene
     */
    onHandleVolume() {
        let perc = (this.soundSlider.x - LEFT_OF_SOUND_SLIDER.x) / (RIGHT_OF_SOUND_SLIDER.x - LEFT_OF_SOUND_SLIDER.x);
        SoundService.getInstance().onHandleVolume(perc);
        if (perc > 0) {
            this.soundButton.setFrame(0);
        } else {
            this.soundButton.setFrame(1);
        }
    }
}