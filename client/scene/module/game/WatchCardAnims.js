class WatchCardAnims extends BaseModule {
    constructor(scene) {
        super(scene);
        this.watchCard = null;
        this.watchCardFrame = null;
        this.watchCardTween = null;
    }

    /**
     * 初始元件
     * @memberof WatchCardAnims
     */
    onInit() {
        this.onCreateElements();
        this.watchCard.visible = false;
        this.watchCardFrame.visible = false;
    }

    /**
     * 創建元件
     * @memberof WatchCardAnims
     */
    onCreateElements() {
        this.watchCard = this.scene.add.image(632, 114.5, 'gameCard');
        this.watchCardFrame = this.scene.add.image(607, 104.5, 'gameWatchCardFrame');
    }

    /**
     * 播放查看牌動畫
     * @param {array} data
     * @memberof WatchCardAnims
     */
    onPlay(data) {
        let self = this;
        let key = data[0];
        let card = data[1];
        let position = parseInt(key.split('_')[1]) / 2;
        this.watchCardFrame.y = 104.5 + position * 186;
        this.watchCardFrame.alpha = 1;
        this.watchCardFrame.visible = true;
        this.watchCard.setFrame(card.typeIndex);
        this.watchCard.y = 114.5 + position * 186;
        this.watchCard.angle = card.isReverse ? 180 : 0;
        this.watchCard.alpha = 1;
        this.watchCard.visible = true;

        if (this.watchCardTween) {
            this.watchCardTween.restart();
        } else {
            this.watchCardTween = this.scene.tweens.add({
                targets: [this.watchCardFrame, this.watchCard],
                alpha: 0,
                duration: MIN_OF_WATCH_TIME,
                delay: 1000,
                onStart: function () {

                },
                onComplete: function () {
                    self.watchCardFrame.visible = false;
                    self.watchCard.visible = false;
                },
            });
        }
    }
}