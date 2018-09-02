const LEFT_OF_SOUND_SLIDER = {
    x: 62.5,
    y: 25
};
const RIGHT_OF_SOUND_SLIDER = {
    x: 162.5,
    y: 25
};
class SoundInfo extends BaseModule {
    constructor(scene) {
        super(scene);
        this.soundBar = null;
        this.soundSlider = null;
        this.soundButton = null;
    }

    /**
     * 初始化
     * @memberof SoundInfo
     */
    onInit() {
        this.onCreateElements();
        this.onSwitchInfo(false);
    }

    /**
     * 創建元件
     * @memberof SoundInfo
     */
    onCreateElements() {
        let self = this;
        //// create sound bar
        this.soundBar = this.scene.add.image(113, 25, 'soundBar');
        //// create sound slider
        this.soundSlider = this.scene.add.image(RIGHT_OF_SOUND_SLIDER.x, RIGHT_OF_SOUND_SLIDER.y, 'soundSlider').setInteractive({
            draggable: true,
        });
        this.soundSlider.on('drag', function (pointer, slider, dragX, dragY) {
            self.onDragSlider(pointer.x);
        });
        //// create sound button
        this.soundButton = this.scene.add.sprite(25, 25, 'soundButton').setInteractive();
        this.soundButton.on('pointerup', function (pointer) {
            self.onSwitchInfo(!self.soundSlider.visible);
        });
    }

    /**
     * 介面顯示或隱藏
     * @param {bool} isShow
     * @memberof SoundInfo
     */
    onSwitchInfo(isShow) {
        this.soundBar.visible = isShow;
        this.soundSlider.visible = isShow;
        this.scene.input.setDraggable(this.soundSlider, isShow);
    }

    /**
     * 拖曳捲軸塊
     * @param {number} dragX
     * @memberof SoundInfo
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
     * 更新音量
     * @memberof SoundInfo
     */
    onUpdateVolume() {
        let currentVolume = SoundService.getInstance().getCurrentVolume();
        this.soundSlider.x = currentVolume * (RIGHT_OF_SOUND_SLIDER.x - LEFT_OF_SOUND_SLIDER.x) + LEFT_OF_SOUND_SLIDER.x;
        this.onHandleVolume();
    }

    /**
     * 調整音量
     * @memberof SoundInfo
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