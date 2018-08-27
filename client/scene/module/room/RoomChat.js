const MAX_OF_ROOM_CHAT = 50;
const SPCAE_OF_ROOM_MESSAGE = 15;
const BOTTOM_OF_ROOM_CHAT = {
    x: 160,
    y: 505
};
const TOP_OF_ROOM_CHAT_SLIDER = {
    x: 984,
    y: 195
};
const BOTTOM_OF_ROOM_CHAT_SLIDER = {
    x: 984,
    y: 470
};
class RoomChat extends BaseModule {
    constructor(scene) {
        super(scene);
        this.mask = null;
        this.bar = null;
        this.chatInput = null;
        this.pictureButton = null;
        this.container = null;
    }

    /**
     * 初始元件
     * @memberof RoomChat
     */
    onInit() {
        this.pictureGroup = this.scene.add.group();
        this.container = this.scene.add.container(BOTTOM_OF_ROOM_CHAT.x, BOTTOM_OF_ROOM_CHAT.y);
        this.onCreateMask();
        this.onCreateDrag();
        this.onCreateChatInput();
        this.onCreatePictureElement();
        this.onCreateSendButton();
    }

    /**
     * 創建訊息遮色片
     * @memberof RoomChat
     */
    onCreateMask() {
        this.mask = this.scene.make.graphics();
        this.mask.fillStyle(0x000000);
        this.mask.beginPath();
        this.mask.fillRect(160, 170, 800, 325);
        this.mask.width = 800;
        this.mask.height = 325;
        this.container.setMask(this.mask.createGeometryMask());
    }

    /**
     * 創建捲軸
     * @memberof RoomChat
     */
    onCreateDrag() {
        let self = this;
        this.bar = this.scene.add.image(984, 332.5, 'roomChatBar').setInteractive();
        this.slider = this.scene.add.image(BOTTOM_OF_ROOM_CHAT_SLIDER.x, BOTTOM_OF_ROOM_CHAT_SLIDER.y, 'roomChatSlider').setInteractive();
        this.scene.input.setDraggable(this.slider);
        this.scene.input.on('drag', function (pointer, slider, dragX, dragY) {
            self.onDragSlider(dragY);
        });
    }

    /**
     * 創建訊息輸入欄
     * @memberof RoomChat
     */
    onCreateChatInput() {
        this.chatInput = document.getElementById('roomChatInput');
    }

    /**
     * 創建表情貼圖元件
     * @memberof RoomChat
     */
    onCreatePictureElement() {
        let self = this;
        //// create frame
        let frame = this.scene.add.image(897, 432, 'roomChatPictureFrame');
        this.pictureGroup.add(frame);
        //// create picture
        let picture = this.scene.add.sprite(897, 432, 'roomChatPicture').setInteractive();
        picture.on('pointerup', function (pointer) {
            Phaser.Actions.Call(self.pictureGroup.getChildren(), function (element) {
                element.visible = false;
            });
            self.onSendPicture(this.frame.name);
        });
        this.pictureGroup.add(picture);
        //// create left select
        let leftSelect = this.scene.add.sprite(820, 430, 'roomChatPictureSelect').setInteractive();
        leftSelect.setFrame(0);
        leftSelect.on('pointerup', function (pointer) {
            let leftFrameNo = parseInt(picture.frame.name);
            leftFrameNo -= 1;
            if (leftFrameNo < 0) {
                leftFrameNo = picture.texture.frameTotal - 2;
            }

            picture.setFrame(leftFrameNo);
        });
        this.pictureGroup.add(leftSelect);
        //// create right select
        let rightSelect = this.scene.add.sprite(970, 430, 'roomChatPictureSelect').setInteractive();
        rightSelect.setFrame(1);
        rightSelect.on('pointerup', function (pointer) {
            let rightFrameNo = parseInt(picture.frame.name);
            rightFrameNo += 1;
            if (rightFrameNo > picture.texture.frameTotal - 2) {
                rightFrameNo = 0;
            }

            picture.setFrame(rightFrameNo);
        });
        this.pictureGroup.add(rightSelect);
        //// create button
        this.pictureButton = this.scene.add.image(910, 525, 'roomChatPictureButton').setInteractive();
        this.pictureButton.on('pointerup', function (pointer) {
            Phaser.Actions.Call(self.pictureGroup.getChildren(), function (element) {
                element.visible = !element.visible;
            });
        });
    }

    /**
     * 創建發送訊息按鈕
     * @memberof RoomChat
     */
    onCreateSendButton() {
        let self = this;
        let sendButton = this.scene.add.image(960, 525, 'roomSendButton').setInteractive();
        sendButton.on('pointerup', function (pointer) {
            self.onSendChat();
        });
    }

    /**
     * 創建聊天訊息
     * @param {string} sender
     * @param {string} message
     * @param {bool} isMain
     * @memberof RoomChat
     */
    onCreateMessage(sender, message, isMain) {
        if (!message) {
            return;
        }

        //// create sender
        if (sender) {
            let senderTxt = this.scene.add.text(0, 0, '', {
                fontFamily: 'Microsoft JhengHei',
                fontStyle: 'Bold',
                fontSize: 16,
                color: isMain ? '#FFD25B' : '#000000'
            });

            senderTxt.setText(InputService.onReduceTxtInput(senderTxt, sender, 210)); //// max widht of sender txt is 200
            this.container.add(senderTxt);
        }
        //// create message
        let subContainer = this.scene.add.container();
        let pictureIndex = message.indexOf(ChatPictureType.ChatPicture_NO);
        let messageObject = null;
        if (pictureIndex === -1) {
            messageObject = this.scene.add.text(10, 0, '', {
                fontFamily: 'Microsoft JhengHei',
                fontSize: 20,
                color: '#FFFFFF'
            });
            messageObject.setText(InputService.onBreakTxtInput(messageObject, message, this.mask.width - 10)); //// max widht of sender txt is mask width
        } else {
            messageObject = this.scene.add.sprite(60, 55, 'roomChatPicture');
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
        spaceContainer.height = SPCAE_OF_ROOM_MESSAGE;
        this.container.add(spaceContainer);
        //// reduce message list
        let reduceCount = this.container.length - MAX_OF_ROOM_CHAT;
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
     * 執行發送房間聊天訊息
     * @memberof RoomChat
     */
    onSendChat() {
        let message = this.chatInput.value;
        if (message) {
            this.chatInput.value = '';
            this.scene.onSendRoomChat(message);
        }
    }

    /**
     * 執行發送房間表情貼圖
     * @param {int} no
     * @memberof RoomChat
     */
    onSendPicture(no) {
        this.scene.onSendRoomChat(ChatPictureType.ChatPicture_NO + no);
    }

    /**
     * 執行接收房間聊天訊息
     * @param {string} sender
     * @param {string} message
     * @param {bool} isMain
     * @memberof RoomChat
     */
    onReceiveChat(sender, message, isMain) {
        this.onCreateMessage(sender, message, isMain);
        this.onHandleMessage();
    }

    /**
     * 聊天室啟用
     * @memberof RoomChat
     */
    onEnable() {
        let self = this;
        //// update chatInput
        this.chatInput.onmouseup = function () {
            self.scene.input.keyboard.on('keyup', function (event) {
                if (event.keyCode === 13) {
                    self.onSendChat();
                }
            });
        }

        this.scene.input.on('pointerdown', function (pointer) {
            self.chatInput.blur();
            self.scene.input.keyboard.off('keyup');
        });

        this.chatInput.style.display = 'block';
        this.chatInput.blur();
        //// update bar
        this.bar.visible = false;
        //// update slider
        this.slider.y = BOTTOM_OF_ROOM_CHAT_SLIDER.y;
        this.slider.visible = false;
        this.scene.input.setDraggable(this.slider, true);
        //// update picture
        this.pictureButton.input.enabled = true;
        Phaser.Actions.Call(this.pictureGroup.getChildren(), function (element) {
            element.visible = false;
        });
        //// update message
        this.onHandleMessage();
    }

    /**
     * 聊天室禁能
     * @param {bool} isClearMessage
     * @memberof RoomChat
     */
    onDisable(isClearMessage) {
        //// update chatInput
        this.chatInput.onmouseup = null;
        this.chatInput.style.display = 'none';
        this.chatInput.value = '';
        //// update bar
        this.bar.visible = false;
        //// update slider
        this.slider.y = BOTTOM_OF_ROOM_CHAT_SLIDER.y;
        this.slider.visible = false;
        this.scene.input.setDraggable(this.slider, false);
        //// update wheel event
        document.onmousewheel = null;
        //// update message
        if (isClearMessage) {
            this.container.removeBetween(0, this.container.length);
        }
        //// update picture
        this.pictureButton.input.enabled = false;
        Phaser.Actions.Call(this.pictureGroup.getChildren(), function (element) {
            element.visible = false;
        });
    }

    /**
     * 拖曳捲軸塊
     * @param {number} dragY
     * @memberof RoomChat
     */
    onDragSlider(dragY) {
        this.slider.y = dragY;
        if (this.slider.y < TOP_OF_ROOM_CHAT_SLIDER.y) {
            this.slider.y = TOP_OF_ROOM_CHAT_SLIDER.y
        } else if (this.slider.y > BOTTOM_OF_ROOM_CHAT_SLIDER.y) {
            this.slider.y = BOTTOM_OF_ROOM_CHAT_SLIDER.y
        }

        this.onHandleMessage();
    }

    /**
     * 滾動捲軸塊
     * @param {number} delta
     * @memberof RoomChat
     */
    onWheelSlider(delta) {
        this.slider.y -= delta;
        if (this.slider.y < TOP_OF_ROOM_CHAT_SLIDER.y) {
            this.slider.y = TOP_OF_ROOM_CHAT_SLIDER.y
        } else if (this.slider.y > BOTTOM_OF_ROOM_CHAT_SLIDER.y) {
            this.slider.y = BOTTOM_OF_ROOM_CHAT_SLIDER.y
        }

        this.onHandleMessage();
    }

    /**
     * 整理訊息
     * @memberof RoomChat
     */
    onHandleMessage() {
        let perc = (this.slider.y - TOP_OF_ROOM_CHAT_SLIDER.y) / (BOTTOM_OF_ROOM_CHAT_SLIDER.y - TOP_OF_ROOM_CHAT_SLIDER.y);
        this.container.y = BOTTOM_OF_ROOM_CHAT.y - this.container.height + (this.container.height - this.mask.height) * (1 - perc);
    }
}