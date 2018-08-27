const MAX_OF_JOIN_ROOM = 7;
class RoomInfo extends BaseModule {
    constructor(scene) {
        super(scene);
        this.roomTxt = null;
        this.countdownTxt = null;
        this.playerTxt = null;
        this.roomButton = null;
    }

    /**
     * 初始元件
     * @memberof RoomInfo
     */
    onInit() {
        this.group = this.scene.add.group();
        this.onCreateInfoTxt();
        this.onCreateRoomButton();
        this.onUpdateData(null);
    }

    onCreateInfoTxt() {
        //// create room txt
        this.roomTxt = this.scene.add.text(55, 180, '', {
            fontFamily: 'Microsoft JhengHei',
            fontSize: 24,
            color: '#ffffff'
        });
        this.group.add(this.roomTxt);
        //// create countdown txt
        this.countdownTxt = this.scene.add.text(480, 180, '', {
            fontFamily: 'Microsoft JhengHei',
            fontSize: 24,
            color: '#ffffff'
        });
        this.group.add(this.countdownTxt);
        //// create player txt
        this.playerTxt = this.scene.add.text(575, 180, '', {
            fontFamily: 'Microsoft JhengHei',
            fontSize: 24,
            color: '#ffffff'
        });
        this.group.add(this.playerTxt);
    }

    /**
     * 創建動作按鈕元件
     * @memberof RoomInfo
     */
    onCreateRoomButton() {
        let self = this;
        this.roomButton = this.scene.add.sprite(700, 193.5, 'lobbyRoomButton').setInteractive();
        this.roomButton.on('pointerup', function (pointer) {
            let isPlaying = this.frame.name === 1;
            if (isPlaying) {
                new MessageAction().action(MessageType.SYS_THE_GAME_IS_RUNNING);
            } else {
                self.scene.onSwitchActionButton(false);
                new JoinRoomAction().action(this.value);
            }
        });
        this.group.add(this.roomButton);
    }

    /**
     * 更新位置
     * @param {number} x
     * @param {number} y
     * @memberof RoomInfo
     */
    onUpdatePosition(x, y) {
        Phaser.Actions.Call(this.group.getChildren(), function (element) {
            element.x += x;
            element.y += y;
        });
    }

    /**
     * 更新房間資訊
     * @param {object} data
     * @memberof RoomInfo
     */
    onUpdateData(data) {
        if (data) {
            this.roomTxt.setText(InputService.onReduceTxtInput(this.roomTxt, data.name, 385)); //// max widht of room txt is 385
            this.countdownTxt.setText(data.countdown + 's');
            this.playerTxt.setText(data.clients.length + ' / ' + MAX_OF_JOIN_ROOM);
            this.roomButton.setFrame(data.isGameRunning === 1 ? 1 : 0);
            this.roomButton.value = data.id;
            Phaser.Actions.Call(this.group.getChildren(), function (element) {
                element.visible = true;
            });
        } else {
            this.roomTxt.setText('');
            this.countdownTxt.setText('');
            this.playerTxt.setText('');
            Phaser.Actions.Call(this.group.getChildren(), function (element) {
                element.visible = false;
            });
        }
    }
}