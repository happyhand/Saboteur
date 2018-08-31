const BASE_GAME_WIDTH = 1050;
const BASE_GAME_HEIGHT = 800;
const GAME = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'Saboteur',
    width: BASE_GAME_WIDTH,
    height: BASE_GAME_HEIGHT,
    scene: {
        preload: onPreLoadSound,
        create: onStart
    },
    callbacks: {
        postBoot: onInit
    }
});

/**
 * 程式初始化
 */
function onInit() {
    console.log('Welcome to Saboteur Game - version.1.2.0');
    console.log('＊此遊戲參考於 Saboteur 桌游製作');
    console.log('＊僅供於學術研究，請勿任意轉載或用於營利用途');
    console.log('＊遊戲中音效引用魔王魂 https://maoudamashii.jokersounds.com/ 音效製作');
    GAME.sound.pauseOnBlur = false;
}

/**
 * 預先載入音效資源
 */
function onPreLoadSound() {
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

/**
 * 程式起始端
 */
function onStart() {
    //// Put GAME
    let gameContent = document.getElementById("gameContent");
    gameContent.appendChild(GAME.canvas);
    //// Resize Game
    onResize();
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
    //// register scene
    onRegisterScene();
    //// init game
    new InitGameAction().action();
}

/**
 * 註冊場景
 */
function onRegisterScene() {
    GAME.scene.add('FrontCoverScene', new FrontCoverScene());
    GAME.scene.add('LobbyScene', new LobbyScene());
    GAME.scene.add('RoomScene', new RoomScene());
    GAME.scene.add('GameScene', new GameScene());
    GAME.scene.add('WatchGameScene', new WatchGameScene());
    GAME.scene.add('MessageScene', new MessageScene());
    GAME.scene.add('SoundScene', new SoundScene());
    GAME.scene.add('LoadScene', new LoadScene());
}

function onResize() {
    let gameContent = document.getElementById("gameContent");
    let countWidth = window.innerWidth - 50;
    if (countWidth >= BASE_GAME_WIDTH) {
        gameContent.style.width = BASE_GAME_WIDTH + "px";
        gameContent.style.width = BASE_GAME_HEIGHT + "px";
        gameContent.style.transform = 'scale(1)';
    } else {
        let perc = countWidth / BASE_GAME_WIDTH;
        gameContent.style.transform = 'scale('+perc+')';
    }
}