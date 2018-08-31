class GameDescription extends BaseModule {
    constructor(scene) {
        super(scene);
        this.group = null;
        this.description = null;
        this.leftSelect = null;
        this.rightSelect = null;
    }

    /**
     * 初始化元件
     * @memberof GameDescription
     */
    onInit() {
        let self = this;
        this.group = this.scene.add.group();
        //// create frame
        let frame = this.scene.add.image(525, 400, 'gameDescriptionBackground').setInteractive();
        this.group.add(frame);
        //// create exit button
        let exitButton = this.scene.add.sprite(1025, 25, 'gameExitButton').setInteractive();
        exitButton.on('pointerover', function (pointer) {
            this.setFrame(1);
        });
        exitButton.on('pointerout', function (pointer) {
            this.setFrame(0);
        });
        exitButton.on('pointerup', function (pointer) {
            self.onCloseGameDescription();
        });
        this.group.add(exitButton);
        //// create description
        this.description = this.scene.add.sprite(595, 373, 'gameDescription').setInteractive();
        this.group.add(this.description);
        //// create left select
        this.leftSelect = this.scene.add.sprite(50, 400, 'gameDescriptionSelect').setInteractive();
        this.leftSelect.setFrame(0);
        this.leftSelect.on('pointerup', function (pointer) {
            let leftIndex = parseInt(self.description.frame.name);
            leftIndex -= 1;
            self.onHandlePage(leftIndex);
        });
        this.group.add(this.leftSelect);
        //// create right select
        this.rightSelect = this.scene.add.sprite(1000, 400, 'gameDescriptionSelect').setInteractive();
        this.rightSelect.setFrame(1);
        this.rightSelect.on('pointerup', function (pointer) {
            let rightIndex = parseInt(self.description.frame.name);
            rightIndex += 1;
            self.onHandlePage(rightIndex);
        });
        this.group.add(this.rightSelect);
    }

    /**
     * 顯示遊戲說明
     * @memberof GameDescription
     */
    onShowGameDescription() {
        Phaser.Actions.Call(this.group.getChildren(), function (element) {
            element.visible = true;
        });

        this.onHandlePage(0);
    }

    /**
     * 關閉遊戲說明
     * @memberof GameDescription
     */
    onCloseGameDescription() {
        Phaser.Actions.Call(this.group.getChildren(), function (element) {
            element.visible = false;
        });
    }

    /**
     * 調整說明頁面
     * @memberof GameDescription
     */
    onHandlePage(index) {
        if (index < 0) {
            index = 0;
        } else if (index > 4) {
            index = 4
        }

        this.leftSelect.visible = index > 0;
        this.rightSelect.visible = index < 4;
        this.description.setFrame(index);
    }
}