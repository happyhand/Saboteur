const MIN_OF_LOAD_TIME = 250; //// ms
class LoadScene extends BaseScene {
    constructor() {
        super('LoadScene');

        this.isTimeStop = false;
        this.isResponse = false;
        this.loadWord = null;
        this.loadRole = null;
    }

    /**
     * Phaser-preload
     * @memberof LoadScene
     */
    preload() {
        this.load.image('loadBackground', 'assets/load/LoadBackground.png');
        this.load.spritesheet('loadWord', 'assets/load/LoadWord.png', {
            frameWidth: 234,
            frameHeight: 33
        });
        this.load.spritesheet('loadRole', 'assets/load/LoadRole.png', {
            frameWidth: 60,
            frameHeight: 45
        });
    }

    /**
     * Phaser-create
     * @memberof LoadScene
     */
    create() {
        //// create background
        this.add.image(525, 400, 'loadBackground');
        //// create anim word
        this.anims.create({
            key: 'LoadWord',
            frames: this.anims.generateFrameNumbers('loadWord', {
                start: 0,
                end: 8
            }),
            frameRate: 20,
            repeat: -1,
            repeatDelay: 1000 //// 動畫重複播放延遲時間
        });
        this.loadWord = this.add.sprite(817, 766.5, 'loadWord');
        //// create anim role
        this.anims.create({
            key: 'LoadRole',
            frames: this.anims.generateFrameNumbers('loadRole', {
                start: 0,
                end: 1
            }),
            frameRate: 3,
            repeat: -1
        });
        this.loadRole = this.add.sprite(985, 760.5, 'loadRole');

        super.create();
    }

    /**
     * 執行動作事件
     * @param {string} type
     * @param {object} data
     * @memberof LoadScene
     */
    action(type, data) {
        if (!super.action(type, data)) {
            return;
        }

        switch (type) {
            case ActionType.LOADING:
                this.onWake();
                this.onStartLoad();
                break;
            case ActionType.SYSTEM_MESSAGE:
            case ActionType.GAME_INIT:
            case ActionType.JOIN_LOBBY:
            case ActionType.JOIN_ROOM:
            case ActionType.JOIN_GAME:
                this.isResponse = true;
                this.onCheckLoadComplete();
                break;
        }
    }

    /**
     * 喚醒場景
     * @memberof FrontCoverScene
     */
    onWake() {
        if (!super.onWake()) {
            return;
        }
    }

    /**
     * 休眠場景
     * @memberof FrontCoverScene
     */
    onSleep() {
        if (!super.onSleep()) {
            return;
        }
    }

    /**
     * 開始 Load
     * @memberof LoadScene
     */
    onStartLoad() {
        let self = this;
        let nameInput = document.getElementById('nameInput');
        nameInput.classList.add('hiddenInput');
        let roomInput = document.getElementById('roomInput');
        roomInput.classList.add('hiddenInput');
        let roomChatInput = document.getElementById('roomChatInput');
        roomChatInput.classList.add('hiddenInput');
        let gameChatInput = document.getElementById('gameChatInput');
        gameChatInput.classList.add('hiddenInput');

        this.isResponse = false;
        this.isTimeStop = false;
        this.loadWord.anims.play('LoadWord');
        this.loadRole.anims.play('LoadRole');

        this.time.delayedCall(MIN_OF_LOAD_TIME, function () {
            self.isTimeStop = true;
            self.onCheckLoadComplete();
        }, this);
    }

    /**
     * 完成 Load
     * @memberof LoadScene
     */
    onCompleteLoad() {
        let nameInput = document.getElementById('nameInput');
        nameInput.classList.remove('hiddenInput');
        let roomInput = document.getElementById('roomInput');
        roomInput.classList.remove('hiddenInput');
        let roomChatInput = document.getElementById('roomChatInput');
        roomChatInput.classList.remove('hiddenInput');
        let gameChatInput = document.getElementById('gameChatInput');
        gameChatInput.classList.remove('hiddenInput');

        this.loadWord.anims.stop();
        this.loadRole.anims.stop();

        this.onSleep();
    }

    /**
     * 檢查是否完成 Load
     * @memberof LoadScene
     */
    onCheckLoadComplete() {
        if (this.isResponse) {
            if (this.isTimeStop) {
                this.onCompleteLoad();
            }
        }
    }
}