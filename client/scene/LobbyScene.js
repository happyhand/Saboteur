const MAX_OF_ROOM = 10;
class LobbyScene extends BaseScene {
    constructor() {
        super('LobbyScene');
        this.roomInput = null;
        this.rooms = null;
        this.createRoom = null;
        this.createButton = null;
        this.enableMask = null;
        this.messageBackground = null;
    }

    /**
     * Phaser-preload
     * @memberof LobbyScene
     */
    preload() {
        this.load.image('lobbyBackground', 'assets/lobby/LobbyBackground.png');
        this.load.image('lobbyCreateRoomFrame', 'assets/lobby/LobbyCreateRoomFrame.png');
        this.load.image('lobbyEnableMask', 'assets/lobby/LobbyEnableMask.png');
        this.load.image('lobbyMessageBackground', 'assets/lobby/LobbyMessageBackground.png');
        this.load.spritesheet('lobbyRoomButton', 'assets/lobby/LobbyRoomButton.png', {
            frameWidth: 70,
            frameHeight: 35
        });
        this.load.spritesheet('lobbyCountdownRadioButton', 'assets/lobby/LobbyCountdownRadioButton.png', {
            frameWidth: 20,
            frameHeight: 20
        });
        this.load.spritesheet('lobbyCreateButton', 'assets/lobby/LobbyCreateButton.png', {
            frameWidth: 105,
            frameHeight: 54
        });
        this.load.audio('idle', 'assets/sound/Idle.mp3');
    }

    /**
     * Phaser-create
     * @memberof LobbyScene
     */
    create() {
        let self = this;
        //// create background
        this.add.image(525, 400, 'lobbyBackground');
        //// create room
        this.onCreateRoom();
        //// create create room
        this.createRoom = new CreateRoom(this);
        this.createRoom.onInit();
        //// create message background
        this.enableMask = this.add.image(525, 400, 'lobbyEnableMask').setInteractive();
        this.enableMask.visible = false;
        //// create message background
        this.messageBackground = this.add.image(525, 400, 'lobbyMessageBackground').setInteractive();
        this.messageBackground.visible = false;
        //// create sound
        SoundService.getInstance().onRegister('idle', this.sound.add('idle'));

        super.create();
    }

    /**
     * 執行動作事件
     * @param {string} type
     * @param {object} data
     * @memberof LobbyScene
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
                SoundService.getInstance().onStop('idle');
                break;
            case ActionType.JOIN_LOBBY:
                this.onWake();
                SoundService.getInstance().onPlay('idle', true);
                break;
            case ActionType.UPDATE_ROOM_LIST:
                this.onUpdateRoomList(data);
                break;
            case ActionType.CREATE_ROOM_ERROR:
                this.onSwitchActionButton(true);
                break;
            case ActionType.JOIN_ROOM:
                this.onSleep();
                SoundService.getInstance().onPlay('idle', true);
                break;
            case ActionType.JOIN_ROOM_ERROR:
                this.onSwitchActionButton(true);
                break;
            case ActionType.JOIN_GAME:
                this.onSleep();
                break;
            case ActionType.SYSTEM_MESSAGE:
                this.messageBackground.visible = data !== MessageType.NONE;
                break;
        }
    }

    /**
     * 喚醒場景
     * @memberof LobbyScene
     */
    onWake() {
        if (!super.onWake()) {
            return;
        }

        let roomInput = document.getElementById('roomInput');
        roomInput.style.display = 'block';
        roomInput.blur();
        roomInput.value = '';
        this.onSwitchActionButton(true);
    }

    /**
     * 休眠場景
     * @memberof LobbyScene
     */
    onSleep() {
        if (!super.onSleep()) {
            return;
        }

        let roomInput = document.getElementById('roomInput');
        roomInput.style.display = 'none';
        this.onSwitchActionButton(false);
    }

    /**
     * 創建房間資訊元件
     * @memberof LobbyScene
     */
    onCreateRoom() {
        this.rooms = [];
        for (let i = 0; i < MAX_OF_ROOM; i++) {
            let room = new RoomInfo(this);
            room.onInit();
            room.onUpdatePosition(0, i * 55);
            this.rooms.push(room);
        }
    }

    /**
     * 執行更新房間列表
     * @param {array} roomDatas
     * @memberof LobbyScene
     */
    onUpdateRoomList(roomDatas) {
        for (let i = 0; i < MAX_OF_ROOM; i++) {
            let roomData = roomDatas[i];
            let room = this.rooms[i];
            room.onUpdateData(roomData);
        }
    }

    /**
     * 執行按鈕禁能開關
     * @param {bool} isEnable
     * @memberof LobbyScene
     */
    onSwitchActionButton(isEnable) {
        this.enableMask.visible = !isEnable;
    }

    /**
     * 執行創建房間
     * @param {string} roomName
     * @param {int} countdownTime
     * @memberof LobbyScene
     */
    onRequestCreateNewRoom(roomName, countdownTime) {
        if (roomName) {
            this.onSwitchActionButton(false);
            new CreateRoomAction().action([roomName, countdownTime]);
        } else {
            new MessageAction().action(MessageType.SYS_MISS_ROOM_NAME);
        }
    }
}