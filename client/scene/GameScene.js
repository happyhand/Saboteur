const MAX_OF_GAME_PLAYER = 7;
class GameScene extends BaseScene {
    constructor() {
        super('GameScene');
        this.mapCards = null;
        this.collapseAnims = null;
        this.digAnims = null;
        this.gameChat = null;
        this.otherPlayerInfos = null;
        this.gameCardNo = null;
        this.mainPlayerInfo = null;
        this.watchCardAnims = null;
        this.gameFinishAnims = null;
        this.gameDescription = null;
        this.enableMask = null;
        this.messageBackground = null;
    }

    /**
     * Phaser-preload
     * @memberof GameScene
     */
    preload() {
        let self = this;
        this.load.image('gameBackground', 'assets/game/GameBackground.png');
        this.load.image('gameAppointMark', 'assets/game/GameAppointMark.png');
        this.load.image('gameFixMark', 'assets/game/GameFixMark.png');
        this.load.image('gameCardDisable', 'assets/game/GameCardDisable.png');
        this.load.image('gameTransformButton', 'assets/game/GameTransformButton.png');
        this.load.image('gameWatchCardFrame', 'assets/game/GameWatchCardFrame.png');
        this.load.image('gameChatBar', 'assets/game/GameChatBar.png');
        this.load.image('gameChatSlider', 'assets/game/GameChatSlider.png');
        this.load.image('gameChatPictureButton', 'assets/game/GameChatPictureButton.png');
        this.load.image('gameChatPictureFrame', 'assets/game/GameChatPictureFrame.png');
        this.load.image('gameSendButton', 'assets/game/GameSendButton.png');
        this.load.image('gameFinishBackground', 'assets/game/GameFinishBackground.png');
        this.load.image('gameGoodManWinMark', 'assets/game/GameGoodManWinMark.png');
        this.load.image('gameBadManWinMark', 'assets/game/GameBadManWinMark.png');
        this.load.image('gameFinishInfoFrame', 'assets/game/GameFinishInfoFrame.png');
        this.load.image('gameFinishReJoinButton', 'assets/game/GameFinishReJoinButton.png');
        this.load.image('gameFinishExitButton', 'assets/game/GameFinishExitButton.png');
        this.load.image('gameDescriptionButton', 'assets/game/GameDescriptionButton.png');
        this.load.image('gameDescriptionBackground', 'assets/game/GameDescriptionBackground.png');
        this.load.image('gameEnableMask', 'assets/game/GameEnableMask.png');
        this.load.image('gameMessageBackground', 'assets/game/GameMessageBackground.png');
        this.load.spritesheet('gameCard', 'assets/game/GameCard.png', {
            frameWidth: 90,
            frameHeight: 125
        });
        this.load.spritesheet('gameMapActionCard', 'assets/game/GameMapActionCard.png', {
            frameWidth: 72,
            frameHeight: 100
        });
        this.load.spritesheet('gameCollapseAnims', 'assets/game/GameCollapseAnims.png', {
            frameWidth: 72,
            frameHeight: 100
        });
        this.load.spritesheet('gameDigAnims', 'assets/game/GameDigAnims.png', {
            frameWidth: 72,
            frameHeight: 100
        });
        this.load.spritesheet('gameRole', 'assets/game/GameRole.png', {
            frameWidth: 121,
            frameHeight: 186
        });
        this.load.spritesheet('gamePlayerInfo', 'assets/game/GamePlayerInfo.png', {
            frameWidth: 100,
            frameHeight: 115
        });
        this.load.spritesheet('gameExitButton', 'assets/game/GameExitButton.png', {
            frameWidth: 34,
            frameHeight: 34
        });
        this.load.spritesheet('gameChatPicture', 'assets/game/GameChatPicture.png', {
            frameWidth: 100,
            frameHeight: 100
        });
        this.load.spritesheet('gameChatPictureSelect', 'assets/game/GameChatPictureSelect.png', {
            frameWidth: 25,
            frameHeight: 30
        });
        this.load.spritesheet('gameLocks', 'assets/game/GameLocks.png', {
            frameWidth: 30,
            frameHeight: 30
        });
        this.load.spritesheet('gameAppointAction', 'assets/game/GameAppointAction.png', {
            frameWidth: 40,
            frameHeight: 104
        });
        this.load.spritesheet('gameCountDown', 'assets/game/GameCountDown.png', {
            frameWidth: 45,
            frameHeight: 45
        });
        this.load.spritesheet('gameActionMark', 'assets/game/GameActionMark.png', {
            frameWidth: 126,
            frameHeight: 50
        });
        this.load.spritesheet('gameGiveUpButton', 'assets/game/GameGiveUpButton.png', {
            frameWidth: 60,
            frameHeight: 60
        });
        this.load.spritesheet('gameCardNo', 'assets/game/GameCardNo.png', {
            frameWidth: 40,
            frameHeight: 40
        });
        this.load.spritesheet('gameMainLocks', 'assets/game/GameMainLocks.png', {
            frameWidth: 45,
            frameHeight: 45
        });
        let loadActionAnims = function (key, url) {
            self.load.spritesheet(key, url, {
                frameWidth: 380,
                frameHeight: 190
            });
        }
        loadActionAnims('gameActionAnimsA1', 'assets/game/GameActionAnimsA1.png');
        loadActionAnims('gameActionAnimsA2', 'assets/game/GameActionAnimsA2.png');
        loadActionAnims('gameActionAnimsA3', 'assets/game/GameActionAnimsA3.png');
        loadActionAnims('gameActionAnimsF1', 'assets/game/GameActionAnimsF1.png');
        loadActionAnims('gameActionAnimsF2', 'assets/game/GameActionAnimsF2.png');
        loadActionAnims('gameActionAnimsF3', 'assets/game/GameActionAnimsF3.png');
        this.load.spritesheet('gameGoodManWinAnims', 'assets/game/GameGoodManWinAnims.png', {
            frameWidth: 450,
            frameHeight: 350
        });
        this.load.spritesheet('gameBadManWinAnims', 'assets/game/GameBadManWinAnims.png', {
            frameWidth: 450,
            frameHeight: 350
        });
        this.load.spritesheet('gameDescription', 'assets/game/GameDescription.png', {
            frameWidth: 650,
            frameHeight: 600
        });
        this.load.spritesheet('gameDescriptionSelect', 'assets/game/GameDescriptionSelect.png', {
            frameWidth: 50,
            frameHeight: 60
        });
        this.load.spritesheet('gameDescriptionExitButton', 'assets/game/GameDescriptionExitButton.png', {
            frameWidth: 34,
            frameHeight: 34
        });
    }

    /**
     * Phaser-create
     * @memberof GameScene
     */
    create() {
        //// create background
        this.add.image(525, 400, 'gameBackground');
        //// create map elements
        this.onCreateMap();
        //// create exit button
        this.onCreateExitButton();
        //// create player info
        this.onCreatePlayerInfo();
        //// create game round info
        this.onCreateGameRoundInfo();
        //// create chat elements
        this.onCreateChatElements();
        //// create game description button elements
        this.onCreateGameDescriptionButton();
        //// create watch card anims
        this.watchCardAnims = new WatchCardAnims(this);
        this.watchCardAnims.onInit();
        //// create game finish anims
        this.gameFinishAnims = new GameFinishAnims(this);
        this.gameFinishAnims.onInit();
        //// create game description
        this.onCreateGameDescription();
        //// create message background
        this.enableMask = this.add.image(525, 400, 'gameEnableMask').setInteractive();
        this.enableMask.visible = false;
        //// create message background
        this.messageBackground = this.add.image(525, 400, 'gameMessageBackground').setInteractive();
        this.messageBackground.visible = false;

        super.create();
    }

    /**
     * 執行動作事件
     * @param {string} type
     * @param {object} data
     * @memberof GameScene
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
                this.onWake();
                this.mainPlayerInfo.onInitGameData(data);
                SoundService.getInstance().onPlay('game', true);
                break;
            case ActionType.JOIN_WATCH_GAME:
                this.onSleep();
                break;
            case ActionType.UPDATE_GAME_INFO:
                if (this.scene.isSleeping()) return;
                this.onUpdateGameInfo(data);
                break;
            case ActionType.ACTION_PLAYER:
                if (this.scene.isSleeping()) return;
                this.onUpdateAction(data);
                break;
            case ActionType.UPDATE_COUNTDOWN:
                if (this.scene.isSleeping()) return;
                this.mainPlayerInfo.onUpdateCountdown(data);
                break;
            case ActionType.PUT_CARD:
                if (this.scene.isSleeping()) return;
                this.mainPlayerInfo.onPutCard(data);
                break;
            case ActionType.TAKE_CARD:
                if (this.scene.isSleeping()) return;
                this.mainPlayerInfo.onTakeCard(data);
                break;
            case ActionType.DIG_ANIMS:
                if (this.scene.isSleeping()) return;
                this.onPlayDigAnims(data);
                break;
            case ActionType.COLLAPSE_ANIMS:
                if (this.scene.isSleeping()) return;
                this.onPlayCollapseAnims(data);
                break;
            case ActionType.WATCH_CARD:
                if (this.scene.isSleeping()) return;
                this.watchCardAnims.onPlay(data);
                break;
            case ActionType.ACTION_ANIMS:
                if (this.scene.isSleeping()) return;
                this.mainPlayerInfo.onPlayActionAnims(data);
                break;
            case ActionType.GAME_OVER:
                if (this.scene.isSleeping()) return;
                this.onGameFinishAnims(data);
                break;
            case ActionType.GAME_CHAT:
                if (this.scene.isSleeping()) return;
                this.onReceiveGameChat(data);
                break;
            case ActionType.SYSTEM_MESSAGE:
                this.messageBackground.visible = data[0] !== MessageType.NONE;
                break;
        }
    }

    /**
     * 喚醒場景
     * @memberof GameScene
     */
    onWake() {
        if (!super.onWake()) {
            return;
        }

        this.gameChat.onEnable();
        this.gameDescription.onCloseGameDescription();
        this.onSwitchActionButton(true);
    }

    /**
     * 休眠場景
     * @memberof GameScene
     */
    onSleep() {
        if (!super.onSleep()) {
            return;
        }

        this.gameChat.onDisable(true);
        this.mainPlayerInfo.unAction();
        this.gameFinishAnims.unPlay();
        this.gameDescription.onCloseGameDescription();
        this.onSwitchActionButton(false);
    }

    /**
     * 創建地圖元件
     * @memberof GameScene
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
            key: 'CollapseAnims',
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
            key: 'DigAnims',
            frames: this.anims.generateFrameNumbers('gameDigAnims', {
                start: 0,
                end: 3
            }),
            frameRate: 5,
            showOnStart: true,
            hideOnComplete: true
        });

        this.digAnims = this.add.sprite(64, 101, 'gameDigAnims');
        this.digAnims.visible = false;
    }

    /**
     * 創建離開遊戲元件
     * @memberof GameScene
     */
    onCreateExitButton() {
        let self = this;
        let exitButton = this.add.sprite(1025, 25, 'gameExitButton').setInteractive();
        exitButton.on('pointerover', function (pointer) {
            this.setFrame(1);
        });
        exitButton.on('pointerout', function (pointer) {
            this.setFrame(0);
        });
        exitButton.on('pointerup', function (pointer) {
            self.onRequestExitGame();
        });
    }

    /**
     * 創建玩家資訊元件
     * @memberof GameScene
     */
    onCreatePlayerInfo() {
        //// anims
        this.anims.create({
            key: 'OtherAction',
            frames: this.anims.generateFrameNumbers('gamePlayerInfo', {
                start: 0,
                end: 1
            }),
            frameRate: 3,
            repeat: -1
        });
        //// main info
        this.mainPlayerInfo = new MainPlayerInfo(this);
        this.mainPlayerInfo.onInit();
        //// other info
        this.otherPlayerInfos = [];
        for (let i = 0; i < MAX_OF_GAME_PLAYER - 1; i++) {
            let otherPlayerInfo = new OtherPlayerInfo(this);
            otherPlayerInfo.onInit();
            otherPlayerInfo.onUpdatePosition((i % 2) * 170, Math.floor(i / 2) * 182.5);
            this.otherPlayerInfos.push(otherPlayerInfo);
        }
    }

    /**
     * 創建遊戲回合資訊元件
     * @memberof GameScene
     */
    onCreateGameRoundInfo() {
        this.gameCardNo = this.add.sprite(903, 633, 'gameCardNo');
    }

    /**
     * 創建遊戲聊天室元件
     * @memberof GameScene
     */
    onCreateChatElements() {
        this.gameChat = new GameChat(this);
        this.gameChat.onInit();
    }

    /**
     * 創建遊戲說明按鈕元件
     * @memberof GameScene
     */
    onCreateGameDescriptionButton() {
        let self = this;
        let gameDescriptionButton = this.add.image(1025, 585, 'gameDescriptionButton').setInteractive();
        gameDescriptionButton.on('pointerup', function (pointer) {
            self.gameDescription.onShowGameDescription();
        });
    }

    /**
     * 創建遊戲說明元件
     * @memberof GameScene
     */
    onCreateGameDescription() {
        this.gameDescription = new GameDescription(this);
        this.gameDescription.onInit();
    }

    /**
     * 更新遊戲資訊
     * @param {object}} data 
     * @memberof GameScene
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
        this.gameCardNo.setFrame(data.noOfRemainCard);
        //// update data
        let playerDatas = data.players;
        let mainPlayerName = PlayerData.getInstance().nickname;
        let otherPlayerIndex = 0;
        for (let i = 0; i < MAX_OF_GAME_PLAYER; i++) {
            let playerData = playerDatas[i];
            if (playerData && playerData.nickname === mainPlayerName) {
                this.mainPlayerInfo.onUpdateData({
                    possibleRoads: data.possibleRoads,
                    canCollapseRoads: data.canCollapseRoads,
                    canWatchRoads: data.canWatchRoads,
                    locks: playerData.locks
                });
            } else {
                let otherPlayerInfo = this.otherPlayerInfos[otherPlayerIndex];
                otherPlayerInfo.onUpdateData(playerData);
                otherPlayerIndex++;
            }
        }
    }

    /**
     * 更新遊戲執行動作者
     * @param {object} data
     * @memberof GameScene
     */
    onUpdateAction(data) {
        let action = data[0];
        let countdown = data[1];
        let nickname = PlayerData.getInstance().nickname;
        //// update countdown
        if (nickname === action) {
            this.mainPlayerInfo.onUpdateCountdown(countdown);
        }
        //// update players
        let players = this.otherPlayerInfos.concat(this.mainPlayerInfo);
        for (let player of players) {
            if (player.nickname === action) {
                player.onAction();
            } else {
                player.unAction();
            }
        }
    }

    /**
     * 播放挖掘動畫
     * @param {string} key
     * @memberof GameScene
     */
    onPlayDigAnims(key) {
        let col = parseInt(key.split('_')[0]);
        let row = parseInt(key.split('_')[1]);
        this.digAnims.x = 64 + col * 72;
        this.digAnims.y = 101 + row * 100;
        this.digAnims.visible = true;
        this.digAnims.anims.play('DigAnims');
    }

    /**
     * 播放崩塌動畫
     * @param {string} key
     * @memberof GameScene
     */
    onPlayCollapseAnims(key) {
        let col = parseInt(key.split('_')[0]);
        let row = parseInt(key.split('_')[1]);
        this.collapseAnims.x = 64 + col * 72;
        this.collapseAnims.y = 101 + row * 100;
        this.collapseAnims.visible = true;
        this.collapseAnims.anims.play('CollapseAnims');
    }

    /**
     * 顯示可指定動作的其他玩家
     * @param {array} lockDatas
     * @memberof GameScene
     */
    onShowCanAppointAction(lockDatas) {
        for (let otherPlayerInfo of this.otherPlayerInfos) {
            otherPlayerInfo.onAppointAction(lockDatas);
        }
    }

    /**
     * 對其他玩家指定動作
     * @param {string} nickname
     * @memberof GameScene
     */
    onAppointAction(nickname) {
        this.mainPlayerInfo.onPutActionCard(nickname);
    }

    /**
     * 執行發送遊戲聊天訊息
     * @param {string} message
     * @memberof GameScene
     */
    onSendGameChat(message) {
        new GameChatAction().action(message);
    }

    /**
     * 執行接收遊戲聊天訊息
     * @param {array} data
     * @memberof GameScene
     */
    onReceiveGameChat(data) {
        let sender = data[0];
        let message = data[1];
        let isMain = PlayerData.getInstance().nickname === sender;
        this.gameChat.onReceiveChat(sender, message, isMain);
    }

    /**
     * Main Player 請求放置卡牌
     * @param {array} data
     * @memberof GameScene
     */
    onRequestPutCard(data) {
        for (let otherPlayerInfo of this.otherPlayerInfos) {
            otherPlayerInfo.onAppointAction(null);
        }

        new PutCardAction().action(data);
    }

    /**
     * 播放遊戲結束動畫
     * @param {object} data
     * @memberof GameScene
     */
    onGameFinishAnims(data) {
        //// update mainPlayer
        this.mainPlayerInfo.unAction();
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
     * Main Player 請求重新遊戲
     * @memberof GameScene
     */
    onRequestReGame() {
        this.gameFinishAnims.unPlay();
        new ReGameAction().action();
    }

    /**
     * Main Player 請求離開遊戲
     * @memberof GameScene
     */
    onRequestExitGame() {
        this.gameFinishAnims.unPlay();
        this.onSwitchActionButton(false);
        new LeaveGameAction().action();
    }

    /**
     * 執行按鈕禁能開關
     * @param {bool} isEnable
     * @memberof GameScene
     */
    onSwitchActionButton(isEnable) {
        this.enableMask.visible = !isEnable;
    }
}