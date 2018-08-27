const BASE_GAME_WIDTH = 1050;
const BASE_GAME_HEIGHT= 800;
const GAME = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'Saboteur',
    width: BASE_GAME_WIDTH,
    height: BASE_GAME_HEIGHT,
    callbacks: {
        preBoot:onInit,
        postBoot: onStart
    }
});


function onInit()
{
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
    //// Start Game
    console.log('Welcome to Saboteur Game - version.1.1.0');
    onRegisterScene();
    new InitGameAction().action();
}

/**
 * 註冊場景
 */
function onRegisterScene()
{
    GAME.scene.add('FrontCoverScene', new FrontCoverScene());
    GAME.scene.add('LobbyScene', new LobbyScene());
    GAME.scene.add('RoomScene', new RoomScene());
    GAME.scene.add('GameScene', new GameScene());
    GAME.scene.add('MessageScene', new MessageScene());
    GAME.scene.add('LoadScene', new LoadScene());
}

function onResize ()
{
    let gameContent = document.getElementById("gameContent");
    let widthPerc = window.innerWidth / BASE_GAME_WIDTH;
    let heightPerc = window.innerHeight / BASE_GAME_HEIGHT;
    let minPerc = Math.min(widthPerc, heightPerc);
    gameContent.style.transform = 'scale('+minPerc+')';
    console.log(gameContent.clientWidth);
    console.log(gameContent.style.left);
}