const MAX_OF_WATCH_GAME_CHAT = 100;
const SPCAE_OF_WATCH_GAME_MESSAGE = 10;
const BOTTOM_OF_WATCH_GAME_CHAT = {
    x: 720,
    y: 550
};
const TOP_OF_WATCH_GAME_CHAT_SLIDER = {
    x: 1011,
    y: 269.5
};
const BOTTOM_OF_WATCH_GAME_CHAT_SLIDER = {
    x: 1011,
    y: 529.5
};
class WatchGameLog extends BaseModule {
    constructor(scene) {
        super(scene);
        this.mask = null;
        this.bar = null;
        this.container = null;
    }

    /**
     * 初始元件
     * @memberof WatchGameLog
     */
    onInit() {
        this.pictureGroup = this.scene.add.group();
        this.container = this.scene.add.container(BOTTOM_OF_WATCH_GAME_CHAT.x, BOTTOM_OF_WATCH_GAME_CHAT.y);
        this.onCreateMask();
        this.onCreateDrag();
    }

    /**
     * 創建訊息遮色片
     * @memberof WatchGameLog
     */
    onCreateMask() {
        this.mask = this.scene.make.graphics();
        this.mask.fillStyle(0x000000);
        this.mask.beginPath();
        this.mask.fillRect(720, 257, 280, 288);
        this.mask.width = 280;
        this.mask.height = 288;
        this.container.setMask(this.mask.createGeometryMask());
    }

    /**
     * 創建捲軸
     * @memberof WatchGameLog
     */
    onCreateDrag() {
        let self = this;
        this.bar = this.scene.add.image(1011, 400, 'watchGameLogBar').setInteractive();
        this.slider = this.scene.add.image(BOTTOM_OF_WATCH_GAME_CHAT_SLIDER.x, BOTTOM_OF_WATCH_GAME_CHAT_SLIDER.y, 'watchGameLogSlider').setInteractive({
            draggable: true
        });
        this.slider.on('drag', function (pointer, slider, dragX, dragY) {
            self.onDragSlider(pointer.y);
        });
    }

    /**
     * 創建聊天訊息
     * @param {string} sender
     * @param {string} message
     * @memberof WatchGameLog
     */
    onCreateMessage(sender, message) {
        if (!message) {
            return;
        }

        //// create sender
        if (sender) {
            let senderTxt = this.scene.add.text(0, 0, '', {
                fontFamily: 'Microsoft JhengHei',
                fontStyle: 'Bold',
                fontSize: 12,
                color: '#000000'
            });

            senderTxt.setText(InputService.onReduceTxtInput(senderTxt, sender, 140)); //// max widht of sender txt is 140
            this.container.add(senderTxt);
        }
        //// create message
        let subContainer = this.scene.add.container();
        let pictureIndex = message.indexOf(ChatPictureType.ChatPicture_NO);
        let messageObject = null;
        if (pictureIndex === -1) {
            messageObject = this.scene.add.text(10, 0, '', {
                fontFamily: 'Microsoft JhengHei',
                fontSize: 16,
                color: '#FFFFFF'
            });
            messageObject.setText(InputService.onBreakTxtInput(messageObject, message, this.mask.width - 10)); //// max widht of sender txt is mask width
        } else {
            messageObject = this.scene.add.sprite(60, 55, 'chatPicture');
            messageObject.setFrame(message.replace(ChatPictureType.ChatPicture_NO, ''));
        }

        let messageBackground = this.scene.add.graphics();
        messageBackground.fillStyle(0x66473D, 0.3);
        messageBackground.moveTo(0, messageObject.height * 0.5);
        messageBackground.lineTo(5, messageObject.height * 0.5 + 5);
        messageBackground.lineTo(5, messageObject.height * 0.5 - 5);
        messageBackground.closePath();
        messageBackground.fillPath();
        messageBackground.fillRoundedRect(5, 0, messageObject.width + 10, pictureIndex === -1 ? messageObject.height : messageObject.height + 10, 6);
        subContainer.add(messageBackground);
        subContainer.add(messageObject);
        subContainer.height = pictureIndex === -1 ? messageObject.height : messageObject.height + 10;
        this.container.add(subContainer);
        //// create space
        let spaceContainer = this.scene.add.container();
        spaceContainer.height = SPCAE_OF_WATCH_GAME_MESSAGE;
        this.container.add(spaceContainer);
        //// reduce message list
        let reduceCount = this.container.length - MAX_OF_WATCH_GAME_CHAT;
        this.container.removeBetween(0, reduceCount, true);
        //// update all text position
        this.container.height = 0;
        for (let i = 0; i < this.container.length; i++) {
            let text = this.container.getAt(i);
            text.y = this.container.height;
            this.container.height += text.height;
        }
        //// update bar's visible、slider's visible and wheel event
        if (this.container.height > this.mask.height) {
            this.bar.visible = true;
            this.slider.visible = true;
            if (!document.onmousewheel) {
                let self = this;
                document.onmousewheel = function (evt) {
                    if (evt.wheelDelta) { //IE/Opera/Chrome 
                        self.onWheelSlider(evt.wheelDelta / 5);
                    } else if (evt.detail) { //Firefox 
                        self.onWheelSlider(evt.detail);
                    }
                };
            }
        }
    }

    /**
     * 執行接收房間聊天訊息
     * @param {string} sender
     * @param {string} message
     * @memberof WatchGameLog
     */
    onReceiveLog(sender, message) {
        this.onCreateMessage(sender, message);
        this.onHandleMessage();
    }

    /**
     * 聊天室啟用
     * @memberof WatchGameLog
     */
    onEnable() {
        let self = this;
        //// update bar
        this.bar.visible = false;
        //// update slider
        this.slider.y = BOTTOM_OF_WATCH_GAME_CHAT_SLIDER.y;
        this.slider.visible = false;
        this.scene.input.setDraggable(this.slider, true);
        //// update message
        this.onHandleMessage();
    }

    /**
     * 聊天室禁能
     * @memberof WatchGameLog
     */
    onDisable() {
        //// update bar
        this.bar.visible = false;
        //// update slider
        this.slider.y = BOTTOM_OF_WATCH_GAME_CHAT_SLIDER.y;
        this.slider.visible = false;
        this.scene.input.setDraggable(this.slider, false);
        //// update wheel event
        document.onmousewheel = null;
        //// update message
        this.container.removeBetween(0, this.container.length);
    }

    /**
     * 拖曳捲軸塊
     * @param {number} dragY
     * @memberof WatchGameLog
     */
    onDragSlider(dragY) {
        this.slider.y = dragY;
        if (this.slider.y < TOP_OF_WATCH_GAME_CHAT_SLIDER.y) {
            this.slider.y = TOP_OF_WATCH_GAME_CHAT_SLIDER.y;
        } else if (this.slider.y > BOTTOM_OF_WATCH_GAME_CHAT_SLIDER.y) {
            this.slider.y = BOTTOM_OF_WATCH_GAME_CHAT_SLIDER.y;
        }

        this.onHandleMessage();
    }

    /**
     * 滾動捲軸塊
     * @param {number} delta
     * @memberof WatchGameLog
     */
    onWheelSlider(delta) {
        this.slider.y -= delta;
        if (this.slider.y < TOP_OF_WATCH_GAME_CHAT_SLIDER.y) {
            this.slider.y = TOP_OF_WATCH_GAME_CHAT_SLIDER.y;
        } else if (this.slider.y > BOTTOM_OF_WATCH_GAME_CHAT_SLIDER.y) {
            this.slider.y = BOTTOM_OF_WATCH_GAME_CHAT_SLIDER.y;
        }

        this.onHandleMessage();
    }

    /**
     * 整理訊息
     * @memberof WatchGameLog
     */
    onHandleMessage() {
        let perc = (this.slider.y - TOP_OF_WATCH_GAME_CHAT_SLIDER.y) / (BOTTOM_OF_WATCH_GAME_CHAT_SLIDER.y - TOP_OF_WATCH_GAME_CHAT_SLIDER.y);
        this.container.y = BOTTOM_OF_WATCH_GAME_CHAT.y - this.container.height + (this.container.height - this.mask.height) * (1 - perc);
    }
}