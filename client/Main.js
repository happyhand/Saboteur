const BASE_GAME_WIDTH = 1050;
const BASE_GAME_HEIGHT = 800;
const GAME = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'Saboteur',
    width: BASE_GAME_WIDTH,
    height: BASE_GAME_HEIGHT,
    callbacks: {
        preBoot: onInit,
        postBoot: onStart
    }
});

/**
 * 程式初始化
 */
function onInit() {
    console.log('Welcome to Saboteur Game - version.1.2.2');
    console.log('＊此遊戲參考於 Saboteur 桌游製作');
    console.log('＊僅供於學術研究，請勿任意轉載或用於營利用途');
    console.log('＊遊戲中音效引用魔王魂 https://maoudamashii.jokersounds.com/ 音效製作');
    GAME.sound.pauseOnBlur = false;
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
    //// register scene
    GAME.scene.add('InitGameScene', new InitGameScene(), true);
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