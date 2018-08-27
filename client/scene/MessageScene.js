class MessageScene extends BaseScene {
    constructor() {
        super('MessageScene');
        this.txt = null;
        this.messageButton = null;
    }

    /**
     * Phaser-preload
     * @memberof MessageScene
     */
    preload() {
        this.load.image('messageFrame', 'assets/message/MessageFrame.png');
        this.load.image('messageButton', 'assets/message/MessageButton.png');
    }

    /**
     * Phaser-create
     * @memberof MessageScene
     */
    create() {
        //// create messageFrame
        this.add.image(525, 345, 'messageFrame');
        //// create messgae txt
        this.txt = this.add.text(0, 0, '', {
            fontFamily: 'Arial',
            fontSize: 24,
            color: '#ffffff',
            align: 'center'
        });
        //// create messgae button
        let self = this;
        this.messageButton = this.add.image(525, 452, 'messageButton').setInteractive();
        this.messageButton.on('pointerup', function (pointer) {
            self.onConfirmMessage();
        });

        super.create();
    }

    /**
     * 執行動作事件
     * @param {string} type
     * @param {object} data
     * @memberof MessageScene
     */
    action(type, data) {
        if (!super.action(type, data)) {
            return;
        }

        switch (type) {
            case ActionType.SYSTEM_MESSAGE:
                this.onReceiveMessage(data);
                break;
        }
    }

    /**
     * 執行訊息命令
     * @param {string} type
     * @memberof MessageScene
     */
    onReceiveMessage(type) {
        switch (type) {
            case MessageType.SYS_LOGIN_FAIL:
                this.onShowMessagee([470, 300], 'Login Fail.', true);
                break;
            case MessageType.SYS_MISS_PLAYER_NAME:
                this.onShowMessagee([400, 300], 'Please enter your name.', true);
                break;
            case MessageType.SYS_MISS_ROOM_NAME:
                this.onShowMessagee([365, 300], 'Please enter new room name.', true);
                break;
            case MessageType.SYS_FULL_ROOM:
                this.onShowMessagee([380, 300], 'The number of rooms is full.', true);
                break;
            case MessageType.SYS_CREATE_REPEAT_ROOM:
                this.onShowMessagee([390, 300], 'The room name is repeat.', true);
                break;
            case MessageType.SYS_JOIN_MULTIPLE_ROOM:
                this.onShowMessagee([400, 300], 'Already join other room.', true);
                break;
            case MessageType.SYS_ROOM_NOT_EXIST:
                this.onShowMessagee([400, 300], 'The room does not exist.', true);
                break;
            case MessageType.SYS_FULL_CLIENT_OF_ROOM:
                this.onShowMessagee([408, 275], 'The number of people\n\nin the room is full.', true);
                break;
            case MessageType.SYS_CLIENT_ALREADY_JOIN:
                this.onShowMessagee([400, 300], 'The client already join.', true);
                break;
            case MessageType.SYS_THE_GAME_IS_RUNNING:
                this.onShowMessagee([415, 300], 'The game is running.', true);
                break;
            case MessageType.SYS_LEAVE_ROOM_KICKED:
                this.onShowMessagee([385, 300], 'You are kick out the room.', true);
                break;
            case MessageType.SYS_CREATE_GAME_ERROR_FOR_PLAYER_NOT_READY:
                this.onShowMessagee([420, 300], 'Someone not ready.', true);
                break;
            case MessageType.SYS_ADD_ROBOT_FAIL:
                this.onShowMessagee([449, 300], 'Add Robot Fail.', true);
                break;
            case MessageType.SYS_NOT_APPOINT_PUT_CARD:
                this.onShowMessagee([400, 300], 'Please appoint the card.', true);
                break;
            case MessageType.SYS_THE_GAME_HAS_BEEN_CLOSED:
                this.onShowMessagee([379, 300], 'The game has been closed.', true);
                break;
            case MessageType.SYS_RE_GAME_ERROR:
                this.onShowMessagee([420, 300], 'Can not rejoin room.', true);
                break;
            case MessageType.SYS_FORCE_DISCONNECTED:
                this.onShowMessagee([400, 300], 'Server refused connect.', true);
                break;
        }

        if (type !== MessageType.NONE) {
            this.onWake();
        } else {
            this.onSleep();
        }
    }

    /**
     * 執行顯示訊息
     * @param {array} position
     * @param {string} message
     * @param {bool} isConfirm
     * @memberof MessageScene
     */
    onShowMessagee(position, message, isConfirm) {
        this.txt.setPosition(position[0], position[1]);
        this.txt.setText(message);
        this.messageButton.visible = isConfirm;
    }

    /**
     * 執行訊息確認
     * @memberof MessageScene
     */
    onConfirmMessage() {
        new MessageAction().action(MessageType.NONE);
    }
}