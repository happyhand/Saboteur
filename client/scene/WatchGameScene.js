const MAX_OF_WATCH_GAME_PLAYER = 7;
class WatchGameScene extends BaseScene {
    constructor() {
        super('WatchGameScene');
        this.mapCards = null;
        this.collapseAnims = null;
        this.digAnims = null;
        this.exitButton = null;
        this.gameLog = null;
        this.playerInfos = null;
        this.watchGameCardNo = null;
        this.gameFinishAnims = null;
        this.enableMask = null;
        this.messageBackground = null;
        this.soundInfo = null;
    }

    /**
     * Phaser-preload
     * @memberof WatchGameScene
     */
    preload() {
        this.load.image('watchGameBackground', 'assets/watchgame/WatchGameBackground.png');
        this.load.image('watchGameLogBar', 'assets/watchgame/WatchGameLogBar.png');
        this.load.image('watchGameLogSlider', 'assets/watchgame/WatchGameLogSlider.png');
    }

    /**
     * Phaser-create
     * @memberof WatchGameScene
     */
    create() {
        //// create background
        this.add.image(525, 400, 'watchGameBackground');
        //// create map elements
        this.onCreateMap();
        //// create exit button
        this.onCreateExitButton();
        //// create player info
        this.onCreatePlayerInfo();
        //// create game round info
        this.onCreateGameRoundInfo();
        //// create game log elements
        this.onCreateLogElements();
        //// create game finish anims
        this.gameFinishAnims = new WatchGameFinishAnims(this);
        this.gameFinishAnims.onInit();
        //// create message background
        this.enableMask = this.add.image(525, 400, 'enableMask').setInteractive();
        this.enableMask.visible = false;
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
     * @memberof WatchGameScene
     */
    action(type, data) {
        if (!super.action(type, data)) {
            return;
        }

        switch (type) {
            case ActionType.GAME_INIT:
                this.onSleep();
                break;
            case ActionType.LOADING:
                SoundService.getInstance().onStop('game');
                SoundService.getInstance().onStop('goodManWin');
                SoundService.getInstance().onStop('badManWin');
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
                this.onWake();
                let gameInfo = data[0];
                let action = data[1];
                this.onUpdateGameInfo(gameInfo);
                this.onUpdateAction([action]);
                SoundService.getInstance().onPlay('game', true);
                break;
            case ActionType.UPDATE_GAME_INFO:
                if (this.scene.isSleeping()) return;
                this.onUpdateGameInfo(data);
                break;
            case ActionType.ACTION_PLAYER:
                if (this.scene.isSleeping()) return;
                this.onUpdateAction(data);
                break;
            case ActionType.DIG_ANIMS:
                if (this.scene.isSleeping()) return;
                this.onPlayDigAnims(data);
                break;
            case ActionType.COLLAPSE_ANIMS:
                if (this.scene.isSleeping()) return;
                this.onPlayCollapseAnims(data);
                break;
            case ActionType.GAME_OVER:
                if (this.scene.isSleeping()) return;
                this.onGameFinishAnims(data);
                break;
            case ActionType.GAME_CHAT:
                if (this.scene.isSleeping()) return;
                this.onReceiveGameLog(data);
                break;
            case ActionType.SYSTEM_MESSAGE:
                this.messageBackground.visible = data[0] !== MessageType.NONE;
                break;
        }
    }

    /**
     * 喚醒場景
     * @memberof WatchGameScene
     */
    onWake() {
        if (!super.onWake()) {
            return;
        }

        this.gameLog.onEnable();
        this.soundInfo.onUpdateVolume();
        this.onSwitchActionButton(true);
    }

    /**
     * 休眠場景
     * @memberof WatchGameScene
     */
    onSleep() {
        if (!super.onSleep()) {
            return;
        }

        this.gameLog.onDisable(true);
        this.gameFinishAnims.unPlay();
        this.soundInfo.onSwitchInfo(false);
        this.onSwitchActionButton(false);
    }

    /**
     * 創建地圖元件
     * @memberof WatchGameScene
     */
    onCreateMap() {
        //// create map
        this.mapCards = {};
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 5; j++) {
                let key = i + '_' + j;
                let mapCard = this.add.sprite(64 + i * 72, 101 + j * 100, 'gameCard');
                mapCard.setScale(0.8);
                mapCard.visible = false;
                this.mapCards[key] = mapCard;
            }
        }
        //// create collapse anims
        this.anims.create({
            key: 'WatchGameCollapseAnims',
            frames: this.anims.generateFrameNumbers('gameCollapseAnims', {
                start: 0,
                end: 3
            }),
            frameRate: 5,
            showOnStart: true,
            hideOnComplete: true
        });

        this.collapseAnims = this.add.sprite(64, 101, 'gameCollapseAnims');
        this.collapseAnims.visible = false;
        //// create dig anims
        this.anims.create({
            key: 'WatchGameDigAnims',
            frames: this.anims.generateFrameNumbers('gameDigAnims', {
                start: 0,
                end: 3
            }),
            frameRate: 5,
            showOnStart: true,
            hideOnComplete: true
        });

        this.digAnims = this.add.sprite(64, 101, 'gameameDigAnims');
        this.digAnims.visible = false;
    }

    /**
     * 創建離開遊戲元件
     * @memberof WatchGameScene
     */
    onCreateExitButton() {
        let self = this;
        this.exitButton = this.add.sprite(1025, 25, 'exitButton').setInteractive();
        this.exitButton.on('pointerover', function (pointer) {
            this.setFrame(1);
        });
        this.exitButton.on('pointerout', function (pointer) {
            this.setFrame(0);
        });
        this.exitButton.on('pointerup', function (pointer) {
            self.onRequestExitGame();
        });
    }

    /**
     * 創建玩家資訊元件
     * @memberof WatchGameScene
     */
    onCreatePlayerInfo() {
        //// anims
        this.anims.create({
            key: 'WatchPlayerAction',
            frames: this.anims.generateFrameNumbers('gamePlayerInfo', {
                start: 0,
                end: 1
            }),
            frameRate: 3,
            repeat: -1
        });
        //// other info
        this.playerInfos = [];
        for (let i = 0; i < MAX_OF_WATCH_GAME_PLAYER; i++) {
            let playerInfo = new WatchPlayerInfo(this);
            playerInfo.onInit();
            playerInfo.onUpdatePosition(i * 140, 0);
            this.playerInfos.push(playerInfo);
        }
    }

    /**
     * 創建遊戲回合資訊元件
     * @memberof WatchGameScene
     */
    onCreateGameRoundInfo() {
        this.watchGameCardNo = this.add.sprite(67, 633, 'gameCardNo');
    }

    /**
     * 創建遊戲歷史訊息元件
     * @memberof WatchGameScene
     */
    onCreateLogElements() {
        this.gameLog = new WatchGameLog(this);
        this.gameLog.onInit();
    }

    /**
     * 更新遊戲資訊
     * @param {object}} data 
     * @memberof WatchGameScene
     */
    onUpdateGameInfo(data) {
        //// update map
        let mapDatas = data.map;
        for (let key in this.mapCards) {
            let mapData = mapDatas[key];
            let mapCard = this.mapCards[key];
            if (mapData) {
                mapCard.setFrame(mapData.typeIndex);
                mapCard.angle = mapData.isReverse ? 180 : 0;
                mapCard.visible = true;
            } else {
                mapCard.visible = false;
            }
        }
        //// update no of remain card
        this.watchGameCardNo.setFrame(data.noOfRemainCard);
        //// update data
        let playerDatas = data.players;
        for (let i = 0; i < MAX_OF_WATCH_GAME_PLAYER; i++) {
            let playerData = playerDatas[i];
            let playerInfo = this.playerInfos[i]
            playerInfo.onUpdateData(playerData);
        }
    }

    /**
     * 更新遊戲執行動作者
     * @param {array} data
     * @memberof WatchGameScene
     */
    onUpdateAction(data) {
        let action = data[0];
        //// update players
        for (let playerInfo of this.playerInfos) {
            if (playerInfo.nickname === action) {
                playerInfo.onAction();
            } else {
                playerInfo.unAction();
            }
        }
    }

    /**
     * 播放挖掘動畫
     * @param {string} key
     * @memberof WatchGameScene
     */
    onPlayDigAnims(key) {
        let col = parseInt(key.split('_')[0]);
        let row = parseInt(key.split('_')[1]);
        this.digAnims.x = 64 + col * 72;
        this.digAnims.y = 101 + row * 100;
        this.digAnims.visible = true;
        this.digAnims.anims.play('WatchGameDigAnims');
    }

    /**
     * 播放崩塌動畫
     * @param {string} key
     * @memberof WatchGameScene
     */
    onPlayCollapseAnims(key) {
        let col = parseInt(key.split('_')[0]);
        let row = parseInt(key.split('_')[1]);
        this.collapseAnims.x = 64 + col * 72;
        this.collapseAnims.y = 101 + row * 100;
        this.collapseAnims.visible = true;
        this.collapseAnims.anims.play('WatchGameCollapseAnims');
    }

    /**
     * 執行接收遊戲聊天訊息
     * @param {array} data
     * @memberof WatchGameScene
     */
    onReceiveGameLog(data) {
        let sender = data[0];
        let message = data[1];
        this.gameLog.onReceiveLog(sender, message);
    }

    /**
     * 播放遊戲結束動畫
     * @param {object} data
     * @memberof WatchGameScene
     */
    onGameFinishAnims(data) {
        //// play anims
        let self = this;
        let type = data[0];
        let teamData = data[1];
        setTimeout(function () {
            if (type === 1) {
                self.gameFinishAnims.onPlayGoodMan(teamData);
                SoundService.getInstance().onPlay('goodManWin', false, function () {
                    SoundService.getInstance().onPlay('game');
                });
                SoundService.getInstance().onStop('game');
            } else {
                self.gameFinishAnims.onPlayBadMan(teamData);
                SoundService.getInstance().onPlay('badManWin', false, function () {
                    SoundService.getInstance().onPlay('game');
                });
                SoundService.getInstance().onStop('game');
            }
        }, 1500);
    }

    /**
     * 請求離開遊戲
     * @memberof WatchGameScene
     */
    onRequestExitGame() {
        this.gameFinishAnims.unPlay();
        this.onSwitchActionButton();
        new LeaveWatchGameAction().action();
    }

    /**
     * 執行按鈕禁能開關
     * @param {bool} isEnable
     * @memberof WatchGameScene
     */
    onSwitchActionButton(isEnable) {
        this.enableMask.visible = !isEnable;
    }
}