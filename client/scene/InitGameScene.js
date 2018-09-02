class InitGameScene extends Phaser.Scene {
    constructor() {
        super('InitGameScene');
    }

    /**
     * Phaser-preload
     * @memberof InitGameScene
     */
    preload() {
        this.onPreloadCommonElements();
        this.onPreloadChatCommonElements();
        this.onPreloadSoundCommonElements();
        this.onPreloadGameCommonElements();
    }

    /**
     * 預載共用資源
     * @memberof InitGameScene
     */
    onPreloadCommonElements() {
        this.load.image('messageBackground', 'assets/common/MessageBackground.png');
        this.load.image('enableMask', 'assets/common/EnableMask.png');
        this.load.spritesheet('exitButton', 'assets/common/ExitButton.png', {
            frameWidth: 34,
            frameHeight: 34
        });
    }

    onPreloadChatCommonElements()
    {
        this.load.spritesheet('chatPicture', 'assets/common/chat/ChatPicture.png', {
            frameWidth: 100,
            frameHeight: 100
        });
    }

    onPreloadSoundCommonElements() {
        //// sound elements
        this.load.image('soundBar', 'assets/sound/SoundBar.png');
        this.load.image('soundSlider', 'assets/sound/SoundSlider.png');
        this.load.spritesheet('soundButton', 'assets/sound/SoundButton.png', {
            frameWidth: 40,
            frameHeight: 40
        });
        //// fronetcover sound
        this.load.audio('frontcover', 'assets/sound/Frontcover.mp3');
        this.load.audio('loginClick', 'assets/sound/LoginClick.mp3');
        //// lobby sound
        this.load.audio('idle', 'assets/sound/Idle.mp3');
        //// room sound
        this.load.audio('joinRoom', 'assets/sound/JoinRoom.mp3');
        this.load.audio('gameCountDown', 'assets/sound/GameCountDown.mp3');
        this.load.audio('onReady', 'assets/sound/OnReady.mp3');
        this.load.audio('unReady', 'assets/sound/UnReady.mp3');
        //// game sound
        this.load.audio('game', 'assets/sound/Game.mp3');
        this.load.audio('actionCountDown', 'assets/sound/ActionCountDown.mp3');
        this.load.audio('putCard', 'assets/sound/PutCard.mp3');
        this.load.audio('goodManWin', 'assets/sound/GoodManWin.mp3');
        this.load.audio('badManWin', 'assets/sound/BadManWin.mp3');
    }

    onPreloadGameCommonElements() {
        this.load.image('gameFinishBackground', 'assets/common/game/GameFinishBackground.png');
        this.load.image('gameGoodManWinMark', 'assets/common/game/GameGoodManWinMark.png');
        this.load.image('gameBadManWinMark', 'assets/common/game/GameBadManWinMark.png');
        this.load.image('gameFinishInfoFrame', 'assets/common/game/GameFinishInfoFrame.png');
        this.load.image('gameFinishExitButton', 'assets/common/game/GameFinishExitButton.png');
        this.load.spritesheet('gameCard', 'assets/common/game/GameCard.png', {
            frameWidth: 90,
            frameHeight: 125
        });
        this.load.spritesheet('gameCollapseAnims', 'assets/common/game/GameCollapseAnims.png', {
            frameWidth: 72,
            frameHeight: 100
        });
        this.load.spritesheet('gameDigAnims', 'assets/common/game/GameDigAnims.png', {
            frameWidth: 72,
            frameHeight: 100
        });
        this.load.spritesheet('gameCardNo', 'assets/common/game/GameCardNo.png', {
            frameWidth: 40,
            frameHeight: 40
        });
        this.load.spritesheet('gameLocks', 'assets/common/game/GameLocks.png', {
            frameWidth: 30,
            frameHeight: 30
        });
        this.load.spritesheet('gamePlayerInfo', 'assets/common/game/GamePlayerInfo.png', {
            frameWidth: 100,
            frameHeight: 115
        });
        this.load.spritesheet('gameGoodManWinAnims', 'assets/common/game/GameGoodManWinAnims.png', {
            frameWidth: 450,
            frameHeight: 350
        });
        this.load.spritesheet('gameBadManWinAnims', 'assets/common/game/GameBadManWinAnims.png', {
            frameWidth: 450,
            frameHeight: 350
        });
    }

    /**
     * Phaser-create
     * @memberof InitGameScene
     */
    create() {
        //// register
        this.onRegisterScene();
        this.onRegisterSound();
        //// action
        new InitGameAction().action();
    }

    /**
     * 註冊場景
     * @memberof InitGameScene
     */
    onRegisterScene() {
        this.scene.add('FrontCoverScene', new FrontCoverScene());
        this.scene.add('LobbyScene', new LobbyScene());
        this.scene.add('RoomScene', new RoomScene());
        this.scene.add('GameScene', new GameScene());
        this.scene.add('WatchGameScene', new WatchGameScene());
        this.scene.add('MessageScene', new MessageScene());
        this.scene.add('LoadScene', new LoadScene());
    }

    /**
     * 註冊音效
     * @memberof InitGameScene
     */
    onRegisterSound() {
        //// create fronetcover sound
        SoundService.getInstance().onRegister('frontcover', this.sound.add('frontcover'));
        SoundService.getInstance().onRegister('loginClick', this.sound.add('loginClick'));
        //// create lobby sound
        SoundService.getInstance().onRegister('idle', this.sound.add('idle'));
        //// create room sound
        SoundService.getInstance().onRegister('joinRoom', this.sound.add('joinRoom'));
        SoundService.getInstance().onRegister('gameCountDown', this.sound.add('gameCountDown'));
        SoundService.getInstance().onRegister('onReady', this.sound.add('onReady'));
        SoundService.getInstance().onRegister('unReady', this.sound.add('unReady'));
        //// create game sound
        SoundService.getInstance().onRegister('game', this.sound.add('game'));
        SoundService.getInstance().onRegister('actionCountDown', this.sound.add('actionCountDown'));
        SoundService.getInstance().onRegister('putCard', this.sound.add('putCard'));
        SoundService.getInstance().onRegister('goodManWin', this.sound.add('goodManWin'));
        SoundService.getInstance().onRegister('badManWin', this.sound.add('badManWin'));
    }
}