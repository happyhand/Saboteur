class CreateRoom extends BaseModule {
    constructor(scene) {
        super(scene);
        this.roomInput = null;
        this.frame = null;
        this.radioButtons = null;
        this.appointCountdownTime = null;
    }

    /**
     * 初始元件
     * @memberof CreateRoom
     */
    onInit() {
        this.onCreateFrame();
        this.onCreateInput();
        this.onCreateButton();
        this.onUpdateAppointCountdownTime(1);
    }

    /**
     * 創建背景框元件
     * @memberof CreateRoom
     */
    onCreateFrame() {
        this.frame = this.scene.add.image(911.5, 252.5, 'lobbyCreateRoomFrame').setInteractive(); //// 設定 interactive，防止底下 Game 元件 MouseEvent 觸發
    }

    /**
     * 創建輸入文字欄
     * @memberof CreateRoom
     */
    onCreateInput() {
        let self = this;
        this.roomInput = document.getElementById('roomInput');
        this.scene.input.on('pointerdown', function (pointer) {
            self.roomInput.blur();
        });
    }

    /**
     * 創建按鈕
     * @memberof CreateRoom
     */
    onCreateButton() {
        let self = this;
        //// create radio button
        this.radioButtons = [];
        for (let i = 0; i < 3; i++) {
            let radioButton = this.scene.add.sprite(839.5 + i * 70, 215, 'lobbyCountdownRadioButton').setInteractive();
            radioButton.on('pointerup', function (pointer) {
                self.onUpdateAppointCountdownTime(i);
            });
            this.radioButtons.push(radioButton);
        }
        //// create create button
        let createButton = this.scene.add.sprite(909.5, 367, 'lobbyCreateButton').setInteractive();
        createButton.on('pointerdown', function (pointer) {
            this.setFrame(2);
        });

        createButton.on('pointerover', function (pointer) {
            this.setFrame(1);
        });

        createButton.on('pointerout', function (pointer) {
            this.setFrame(0);
        });
        createButton.on('pointerup', function (pointer) {
            self.scene.onRequestCreateNewRoom(self.roomInput.value.trim(), self.appointCountdownTime);
        });
    }

    /**
     * 更新指定倒數時間
     * @param {int} index
     * @memberof CreateRoom
     */
    onUpdateAppointCountdownTime(index) {
        for (let i = 0; i < 3; i++) {
            let radioButton = this.radioButtons[i]
            radioButton.setFrame(0);
        }

        let targetRadioButton = this.radioButtons[index];
        targetRadioButton.setFrame(1);
        this.appointCountdownTime = 10 * (index + 1);
    }
}