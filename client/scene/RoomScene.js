const MAX_OF_PLAYER = 7;
class RoomScene extends BaseScene {
    constructor() {
        super('RoomScene');
        this.roomNameTxt = null;
        this.countdownTxt = null;
        this.roomChat = null;
        this.playerInfos = null;
        this.robotButton = null;
        this.goButton = null;
        this.readyButton = null;
        this.exitButton = null;
        this.enableMask = null;
        this.messageBackground = null;
    }

    /**
     * Phaser-preload
     * @memberof RoomScene
     */
    preload() {
        this.load.image('roomBackground', 'assets/room/RoomBackground.png');
        this.load.image('roomRobotButton', 'assets/room/RoomRobotButton.png');
        this.load.image('roomChatBar', 'assets/room/RoomChatBar.png');
        this.load.image('roomChatSlider', 'assets/room/RoomChatSlider.png');
        this.load.image('roomChatPictureButton', 'assets/room/RoomChatPictureButton.png');
        this.load.image('roomChatPictureFrame', 'assets/room/RoomChatPictureFrame.png');
        this.load.image('roomSendButton', 'assets/room/RoomSendButton.png');
        this.load.image('roomEnableMask', 'assets/room/RoomEnableMask.png');
        this.load.image('roomMessageBackground', 'assets/room/RoomMessageBackground.png');
        this.load.spritesheet('roomExitButton', 'assets/room/RoomExitButton.png', {
            frameWidth: 34,
            frameHeight: 34
        });
        this.load.spritesheet('roomChatPicture', 'assets/room/RoomChatPicture.png', {
            frameWidth: 100,
            frameHeight: 100
        });
        this.load.spritesheet('roomChatPictureSelect', 'assets/room/RoomChatPictureSelect.png', {
            frameWidth: 25,
            frameHeight: 30
        });
        this.load.spritesheet('roomGoButton', 'assets/room/RoomGoButton.png', {
            frameWidth: 90,
            frameHeight: 90
        });
        this.load.spritesheet('roomReadyButton', 'assets/room/RoomReadyButton.png', {
            frameWidth: 90,
            frameHeight: 90
        });
        this.load.spritesheet('roomPlayerInfo', 'assets/room/RoomPlayerInfo.png', {
            frameWidth: 135,
            frameHeight: 170
        });
        this.load.spritesheet('roomKickButton', 'assets/room/RoomKickButton.png', {
            frameWidth: 45,
            frameHeight: 45
        });
    }

    /**
     * Phaser-create
     * @memberof RoomScene
     */
    create() {
        //// create background
        this.add.image(525, 400, 'roomBackground');
        //// create exit button
        this.onCreateExitButton();
        //// create room info txt
        this.onCreateRoomInfoTxt();
        //// create chat elements
        this.onCreateChatElements();
        //// create robot button
        this.onCreateRobotButton();
        //// create go button
        this.onCreateGoButton();
        //// create ready Button
        this.onCreateReadyButton();
        //// create player info
        this.onCreatePlayerInfo();
        //// create message background
        this.enableMask = this.add.image(525, 400, 'roomEnableMask').setInteractive();
        this.enableMask.visible = false;
        //// create message background
        this.messageBackground = this.add.image(525, 400, 'roomMessageBackground').setInteractive();
        this.messageBackground.visible = false;

        super.create();
    }

    /**
     * 執行動作事件
     * @param {string} type
     * @param {object} data
     * @memberof RoomScene
     */
    action(type, data) {
        if (!super.action(type, data)) {
            return;
        }

        switch (type) {
            case ActionType.GAME_INIT:
                this.roomChat.onDisable(true);
                this.onSleep();
                break;
            case ActionType.JOIN_LOBBY:
                this.roomChat.onDisable(true);
                this.onSleep();
                break;
            case ActionType.JOIN_ROOM:
                this.onWake();
                SoundService.getInstance().onPlay('joinRoom');
                this.roomChat.onEnable();
                break;
            case ActionType.UPDATE_ROOM_INFO:
                this.onUpdateRoomInfo(data);
                break;
            case ActionType.ROOM_CHAT:
                this.onReceiveGameChat(data);
                break;
            case ActionType.CREATE_GAME:
                this.onSwitchActionButton(false);
                break;
            case ActionType.CREATE_GAME_ERROR:
                this.onSwitchActionButton(true);
                break;
            case ActionType.JOIN_GAME:
                this.roomChat.onDisable(false);
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
     * @memberof RoomScene
     */
    onWake() {
        if (!super.onWake()) {
            return;
        }

        this.onSwitchActionButton(true);
    }

    /**
     * 休眠場景
     * @memberof RoomScene
     */
    onSleep() {
        if (!super.onSleep()) {
            return;
        }

        this.onSwitchActionButton(false);
    }

    /**
     * 創建離開遊戲元件
     * @memberof GameScene
     */
    onCreateExitButton() {
        let self = this;
        this.exitButton = this.add.sprite(1025, 25, 'roomExitButton').setInteractive();
        this.exitButton.on('pointerover', function (pointer) {
            this.setFrame(1);
        });
        this.exitButton.on('pointerout', function (pointer) {
            this.setFrame(0);
        });
        this.exitButton.on('pointerup', function (pointer) {
            self.onSwitchActionButton(false);
            new LeaveRoomAction().action();
        });
    }

    /**
     * 創建房間資訊文字欄
     * @memberof RoomScene
     */
    onCreateRoomInfoTxt() {
        //// create name txt
        this.roomNameTxt = this.add.text(605, 80, '', {
            fontFamily: 'Microsoft JhengHei',
            fontSize: 20,
            color: '#FFFFFF'
        });
        //// create countdown txt
        this.countdownTxt = this.add.text(475, 80, '', {
            fontFamily: 'Microsoft JhengHei',
            fontSize: 20,
            color: '#FFFFFF'
        });
    }

    /**
     * 創建房間聊天室元件
     * @memberof RoomScene
     */
    onCreateChatElements() {
        this.roomChat = new RoomChat(this);
        this.roomChat.onInit();
    }

    /**
     * 創建加入 Robot 元件
     * @memberof RoomScene
     */
    onCreateRobotButton() {
        this.robotButton = this.add.image(70, 425, 'roomRobotButton').setInteractive();
        this.robotButton.on('pointerup', function (pointer) {
            new AddRobotAction().action();
        });
    }

    /**
     * 創建開啟遊戲元件
     * @memberof RoomScene
     */
    onCreateGoButton() {
        let self = this;
        this.goButton = this.add.sprite(70, 505, 'roomGoButton').setInteractive();
        this.goButton.on('pointerup', function (pointer) {
            this.setFrame(1);
            self.onSwitchActionButton(false);
            SoundService.getInstance().onPlay('onReady');
            new CreateGameAction().action();
        });
    }

    /**
     * 創建準備遊戲元件
     * @memberof RoomScene
     */
    onCreateReadyButton() {
        this.readyButton = this.add.sprite(70, 505, 'roomReadyButton').setInteractive();
        this.readyButton.on('pointerup', function (pointer) {
            SoundService.getInstance().onPlay(this.frame.name === 1 ? 'unReady' : 'onReady');
            new UpdateReadyGameAction().action(this.frame.name === 1 ? 0 : 1);
        });
    }

    /**
     * 創建玩家資訊元件
     * @memberof RoomScene
     */
    onCreatePlayerInfo() {
        this.playerInfos = [];
        for (let i = 0; i < MAX_OF_PLAYER; i++) {
            let playerInfo = new RoomPlayerInfo(this);
            playerInfo.onInit();
            playerInfo.onUpdatePosition(i * 135, 0);
            this.playerInfos.push(playerInfo);
        }
    }

    /**
     * 執行更新房間資訊
     * @param {object} data
     * @memberof RoomScene
     */
    onUpdateRoomInfo(data) {
        //// update info
        let roomName = data.name;
        this.roomNameTxt.setText(InputService.onReduceTxtInput(this.roomNameTxt, roomName, 290));
        let countdownTime = data.countdown;
        this.countdownTxt.setText(countdownTime + 's');
        //// update player
        let playerName = PlayerData.getInstance().nickname;
        let isMaster = playerName === data.master;
        let playerInfoDatas = data.clients;
        let isGameRunning = data.isGameRunning === 1;
        let isGameReady = data.isGameReady;
        let isPlay = false;
        for (let i = 0; i < MAX_OF_PLAYER; i++) {
            let playerInfoData = playerInfoDatas[i];
            let playerInfo = this.playerInfos[i];
            if (playerInfoData) {
                if (playerName === playerInfoData.nickname) {
                    isPlay = playerInfoData.isReadyGame;
                }

                playerInfo.onUpdateData(playerInfoData, isMaster);
            } else {
                playerInfo.onUpdateData(null, isMaster);
            }
        }

        //// update button status
        if (isMaster) {
            if (isGameReady) {
                this.onUpdateGoButtonStatus(true, !isGameRunning);
            } else {
                this.onUpdateGoButtonStatus(true, false);
            }

            this.onUpdateReadyButtonStatus(false, false, false);
        } else {
            this.onUpdateGoButtonStatus(false, false);
            this.onUpdateReadyButtonStatus(true, !isGameRunning, isPlay);
        }
    }

    /**
     * 執行更新創建遊戲按鈕狀態
     * @param {bool} isShow
     * @param {bool} isEnable
     * @memberof RoomScene
     */
    onUpdateGoButtonStatus(isShow, isEnable) {
        if (isShow) {
            this.goButton.input.enabled = isEnable;
            if (isEnable) {
                this.goButton.setFrame(0);
            } else {
                this.goButton.setFrame(1);
            }

            this.goButton.value = true;
            this.robotButton.visible = true;
        } else {
            this.goButton.input.enabled = false;
            this.goButton.value = false;
            this.robotButton.visible = false;
        }
    }

    /**
     * 執行更新遊戲準備按鈕狀態
     * @param {bool} isShow
     * @param {bool} isEnable
     * @param {bool} isReady
     * @memberof RoomScene
     */
    onUpdateReadyButtonStatus(isShow, isEnable, isReady) {
        if (isShow) {
            this.readyButton.input.enabled = isEnable;
            if (isEnable) {
                this.readyButton.setFrame(isReady ? 1 : 0);
            } else {
                this.readyButton.setFrame(1);
            }
            this.readyButton.visible = true;
        } else {
            this.readyButton.input.enabled = false;
            this.readyButton.visible = false;
        }
    }

    /**
     * 執行按鈕禁能開關
     * @param {bool} isEnable
     * @memberof RoomScene
     */
    onSwitchActionButton(isEnable) {
        this.enableMask.visible = !isEnable;
    }

    /**
     * 請求踢除玩家
     * @param {string}} nickname
     * @memberof RoomScene
     */
    onRequestKickPlayer(nickname) {
        new KickAction().action(nickname);
    }

    /**
     * 執行發送房間聊天訊息
     * @param {string} message
     * @memberof RoomScene
     */
    onSendRoomChat(message) {
        new RoomChatAction().action(message);
    }

    /**
     * 執行接收房間聊天訊息
     * @param {array} data
     * @memberof GameScene
     */
    onReceiveGameChat(data) {
        let sender = data[0];
        let message = data[1];
        let isMain = PlayerData.getInstance().nickname === sender;
        this.roomChat.onReceiveChat(sender, message, isMain);

        if (!sender) {
            SoundService.getInstance().onPlay('gameCountDown');
        }
    }
}