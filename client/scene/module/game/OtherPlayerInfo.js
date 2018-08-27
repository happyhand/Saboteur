const SPACE_GAME_NAME_TXT = '\n　　　　  '; //// 4個全形空白 + 2個半形空白
class OtherPlayerInfo extends PlayerInfo {
    constructor(scene) {
        super(scene);
        this.group = null;
        this.isPlay = false;
        this.info = null;
        this.nameTxt = null;
        this.appointAction = null;
    }

    /**
     * 初始元件
     * @memberof OtherPlayerInfo
     */
    onInit() {
        this.group = this.scene.add.group();
        this.onCreateInfo();
        this.onCreateNameTxt();
        this.onCreateLocks();
        this.onCreateAppointAction();
    }

    /**
     * 創建資訊元件
     * @memberof OtherPlayerInfo
     */
    onCreateInfo() {
        this.info = this.scene.add.sprite(800, 142.5, 'gamePlayerInfo');
        this.group.add(this.info);
    }

    /**
     * 創建暱稱文字欄元件
     * @memberof OtherPlayerInfo
     */
    onCreateNameTxt() {
        this.nameTxt = this.scene.add.text(758, 176, '', {
            fontFamily: 'Microsoft JhengHei',
            fontSize: 18,
            color: '#000000',
            align: 'center'
        });
        this.group.add(this.nameTxt);
    }

    /**
     * 創建狀態元件
     * @memberof OtherPlayerInfo
     */
    onCreateLocks() {
        this.locks = [];
        for (let i = 0; i < 3; i++) {
            let lock = this.scene.add.sprite(770 + i * 30, 65, 'gameLocks');
            lock.setFrame(i + 3);
            this.group.add(lock);
            this.locks.push(lock);
        }
    }

    /**
     * 創建指定動作元件
     * @memberof OtherPlayerInfo
     */
    onCreateAppointAction() {
        let self = this;
        this.appointAction = this.scene.add.sprite(722, 125, 'gameAppointAction').setInteractive();
        this.appointAction.on('pointerup', function (pointer) {
            self.scene.onAppointAction(self.nickname);
        });
        this.group.add(this.appointAction);
    }

    /**
     * 更新位置
     * @param {number} x
     * @param {number} y
     * @memberof OtherPlayerInfo
     */
    onUpdatePosition(x, y) {
        Phaser.Actions.Call(this.group.getChildren(), function (element) {
            element.x += x;
            element.y += y;
        });
    }

    /**
     * 更新資料
     * @param {array} data
     * @memberof OtherPlayerInfo
     */
    onUpdateData(data) {
        if (data) {
            super.onUpdateData(data);
            //// update is play or not
            this.isPlay = true;
            //// update nickname
            this.nickname = data.nickname;
            this.nameTxt.setText(InputService.onReduceTxtInput(this.nameTxt, data.nickname, 90) + SPACE_GAME_NAME_TXT); //// max width 90
            ///// update appointAction
            this.appointAction.setFrame(0);
            this.appointAction.input.enabled = false;
            //// update elements visible
            Phaser.Actions.Call(this.group.getChildren(), function (element) {
                element.visible = true;
            });
        } else {
            //// update is play or not
            this.isPlay = false;
            ///// update appointAction
            this.appointAction.setFrame(0);
            this.appointAction.input.enabled = false;
            //// update elements visible
            Phaser.Actions.Call(this.group.getChildren(), function (element) {
                element.visible = false;
            });
        }
    }

    /**
     * 執行遊戲動作
     * @memberof OtherPlayerInfo
     */
    onAction() {
        this.info.anims.play('OtherAction');
        super.onAction();
    }

    /**
     * 禁止執行遊戲動作
     * @memberof OtherPlayerInfo
     */
    unAction() {
        this.info.anims.stop();
        this.info.setFrame(2);
        super.unAction();
    }

    /**
     * 指定動作
     * @param {array} lockDatas
     * @memberof OtherPlayerInfo
     */
    onAppointAction(lockDatas) {
        if (!this.isPlay) {
            return;
        }

        let actionType = this.onCanFixOrCanAtk(lockDatas);
        this.appointAction.setFrame(actionType + 1);
        this.appointAction.input.enabled = actionType !== -1;
    }
}