class FrontCoverScene extends BaseScene {
    constructor() {
        super('FrontCoverScene');
        this.nameInput = null;
        this.playButton = null;
        this.messageBackground = null;
        this.soundInfo = null;
    }

    /**
     * Phaser-preload
     * @memberof FrontCoverScene
     */
    preload() {
        this.load.image('frontCoverBackground', 'assets/frontcover/FrontCoverBackground.png');
        this.load.spritesheet('frontCoverPlayButton', 'assets/frontcover/FrontCoverPlayButton.png', {
            frameWidth: 90,
            frameHeight: 90
        });
    }

    /**
     * Phaser-create
     * @memberof FrontCoverScene
     */
    create() {
        let self = this;
        //// create background
        this.add.image(525, 400, 'frontCoverBackground');
        //// create input text
        this.nameInput = document.getElementById('nameInput');
        this.input.on('pointerdown', function (pointer) {
            self.nameInput.blur();
        });
        //// create play button
        this.playButton = this.add.sprite(525, 740, 'frontCoverPlayButton').setInteractive();
        this.playButton.on('pointerdown', function (pointer) {
            this.setFrame(2);
        });

        this.playButton.on('pointerover', function (pointer) {
            this.setFrame(1);
        });

        this.playButton.on('pointerout', function (pointer) {
            this.setFrame(0);
        });
        this.playButton.on('pointerup', function (pointer) {
            SoundService.getInstance().onPlay('loginClick');
            self.onLogin();
        });
        //// create message background
        this.messageBackground = this.add.image(525, 400, 'messageBackground').setInteractive();
        this.messageBackground.visible = false;
        //// create sound info
        this.soundInfo = new SoundInfo(this);
        this.soundInfo.onInit();

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
                SoundService.getInstance().onPlay('frontcover', true);
                break;
            case ActionType.LOGIN_ERROR:
                this.playButton.input.enabled = true;
                break;
            case ActionType.LOADING:
                SoundService.getInstance().onStop('frontcover');
                break;
            case ActionType.JOIN_LOBBY:
                this.onSleep();
                break;
            case ActionType.JOIN_ROOM:
                this.onSleep();
                break;
            case ActionType.JOIN_GAME:
                this.onSleep();
                break;
            case ActionType.JOIN_WATCH_GAME:
                this.onSleep();
                break;
            case ActionType.SYSTEM_MESSAGE:
                this.messageBackground.visible = data[0] !== MessageType.NONE;
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

        this.nameInput.style.display = 'block';
        this.nameInput.blur();
        this.playButton.input.enabled = true;
        this.soundInfo.onUpdateVolume();
    }

    /**
     * 休眠場景
     * @memberof FrontCoverScene
     */
    onSleep() {
        if (!super.onSleep()) {
            return;
        }

        this.nameInput.style.display = 'none';
        this.playButton.input.enabled = false;
        this.soundInfo.onSwitchInfo(false);
    }

    /**
     * 執行 Login
     * @memberof FrontCoverScene
     */
    onLogin() {
        let name = this.nameInput.value.trim();
        if (name) {
            this.playButton.input.enabled = false;
            new LoginAction().action(name);
        } else {
            new MessageAction().action([MessageType.SYS_MISS_PLAYER_NAME]);
        }
    }
}