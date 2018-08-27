const SPACE_NAME_TXT = '\n　　　　　   '; //// 4個全形空白 + 2個半形空白
class RoomPlayerInfo extends BaseModule {
    constructor(scene) {
        super(scene);
        this.info = null;
        this.txt = null;
        this.kickButton = null;
    }

    /**
     * 初始元件
     * @memberof RoomPlayerInfo
     */
    onInit() {
        this.group = this.scene.add.group();
        this.onCreateInfo();
        this.onCreateTxt();
        this.onCreateKickButton();
    }

    /**
     * 創建面板
     * @memberof RoomPlayerInfo
     */
    onCreateInfo() {
        this.info = this.scene.add.sprite(157.5, 695, 'roomPlayerInfo').setInteractive(); // 75 680
        this.group.add(this.info);
    }

    /**
     * 創建暱稱文字欄
     * @memberof RoomPlayerInfo
     */
    onCreateTxt() {
        this.txt = this.scene.add.text(105.5, 612, '', {
            fontFamily: 'Microsoft JhengHei',
            fontSize: 18,
            color: '#000000',
            align: 'center'
        });
        this.group.add(this.txt);
    }

    /**
     * 創建踢除按鈕
     * @memberof RoomPlayerInfo
     */
    onCreateKickButton() {
        let self = this;
        this.kickButton = this.scene.add.sprite(157.5, 580.5, 'roomKickButton').setInteractive();
        this.kickButton.on('pointerdown', function (pointer) {
            this.setFrame(2);
        });
        this.kickButton.on('pointerover', function (pointer) {
            this.setFrame(1);
        });
        this.kickButton.on('pointerout', function (pointer) {
            this.setFrame(0);
        });
        this.kickButton.on('pointerup', function (pointer) {
            self.scene.onRequestKickPlayer(this.value);
        });
    }

    /**
     * 更新位置
     * @param {number} x
     * @param {number} y
     * @memberof RoomPlayerInfo
     */
    onUpdatePosition(x, y) {
        Phaser.Actions.Call(this.group.getChildren(), function (element) {
            element.x += x;
            element.y += y;
        });

        this.kickButton.x += x;
    }

    /**
     * 更新玩家資訊
     * @param {object} data
     * @param {bool} isMaster
     * @memberof RoomPlayerInfo
     */
    onUpdateData(data, isMaster) {
        if (data) {
            this.info.setFrame(data.isMaster ? 2 : data.isReadyGame ? 1 : 0);
            this.txt.setText(InputService.onReduceTxtInput(this.txt, data.nickname, 100) + SPACE_NAME_TXT); //// max widht of name txt is 100
            this.kickButton.visible = !data.isMaster && isMaster;
            this.kickButton.value = data.nickname;
            Phaser.Actions.Call(this.group.getChildren(), function (element) {
                element.visible = true;
            });
        } else {
            this.txt.setText('');
            this.kickButton.visible = false;
            Phaser.Actions.Call(this.group.getChildren(), function (element) {
                element.visible = false;
            });
        }
    }
}