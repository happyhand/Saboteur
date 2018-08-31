const SPACE_WATCH_GAME_NAME_TXT = '\n　　　　  '; //// 4個全形空白 + 2個半形空白
class WatchPlayerInfo extends PlayerInfo {
    constructor(scene) {
        super(scene);
        this.group = null;
        this.info = null;
        this.nameTxt = null;
    }

    /**
     * 初始元件
     * @memberof WatchPlayerInfo
     */
    onInit() {
        this.group = this.scene.add.group();
        this.onCreateInfo();
        this.onCreateNameTxt();
        this.onCreateLocks();
    }

    /**
     * 創建資訊元件
     * @memberof WatchPlayerInfo
     */
    onCreateInfo() {
        this.info = this.scene.add.sprite(155, 714.5, 'watchGamePlayerInfo');
        this.group.add(this.info);
    }

    /**
     * 創建暱稱文字欄元件
     * @memberof WatchPlayerInfo
     */
    onCreateNameTxt() {
        this.nameTxt = this.scene.add.text(113, 748, '', {
            fontFamily: 'Microsoft JhengHei',
            fontSize: 18,
            color: '#000000',
            align: 'center'
        });
        this.group.add(this.nameTxt);
    }

    /**
     * 創建狀態元件
     * @memberof WatchPlayerInfo
     */
    onCreateLocks() {
        this.locks = [];
        for (let i = 0; i < 3; i++) {
            let lock = this.scene.add.sprite(125 + i * 30, 637, 'watchGameLocks');
            lock.setFrame(i + 3);
            this.group.add(lock);
            this.locks.push(lock);
        }
    }

    /**
     * 更新位置
     * @param {number} x
     * @param {number} y
     * @memberof WatchPlayerInfo
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
     * @memberof WatchPlayerInfo
     */
    onUpdateData(data) {
        if (data) {
            super.onUpdateData(data);
            //// update nickname
            this.nickname = data.nickname;
            this.nameTxt.setText(InputService.onReduceTxtInput(this.nameTxt, data.nickname, 90) + SPACE_WATCH_GAME_NAME_TXT); //// max width 90
            //// update elements visible
            Phaser.Actions.Call(this.group.getChildren(), function (element) {
                element.visible = true;
            });
        } else {
            //// update elements visible
            Phaser.Actions.Call(this.group.getChildren(), function (element) {
                element.visible = false;
            });
        }
    }

    /**
     * 執行遊戲動作
     * @memberof WatchPlayerInfo
     */
    onAction() {
        this.info.anims.play('WatchPlayerAction');
        super.onAction();
    }

    /**
     * 禁止執行遊戲動作
     * @memberof WatchPlayerInfo
     */
    unAction() {
        this.info.anims.stop();
        this.info.setFrame(2);
        super.unAction();
    }
}