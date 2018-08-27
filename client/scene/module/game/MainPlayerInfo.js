const SPACE_GAME_MAIN_NAME_TXT = '\n　　　　  '; //// 4個全形空白 + 1個半形空白
const MIN_OF_WATCH_TIME = 5000; //// ms
class MainPlayerInfo extends PlayerInfo {
    constructor(scene) {
        super(scene);
        //// data
        this.identity = null;
        this.cardDatas = null;
        this.possibleRoadDatas = null;
        this.canCollapseRoadDatas = null;
        this.canWatchRoadDatas = null;
        //// elements
        this.mapActionCards = null;
        this.role = null;
        this.nicknameTxt = null;
        this.actionMark = null;
        this.countdown = null;
        this.fixMark = null;
        this.cards = null;
        this.appointMark = null;
        this.transformButtons = null;
        this.actionAnims = null;
    }

    /**
     * 初始元件
     * @memberof MainPlayerInfo
     */
    onInit() {
        this.onCreateMapActionCards();
        this.onCreateRole();
        this.onCreateNicknameTxt();
        this.onCreateCountdown();
        this.onCreateActionMark();
        this.onCreateGiveUpButton();
        this.onCreateLocks();
        this.onCreateCards();
        this.onCreateAppointMark();
        this.onCreateFixMark();
        this.onCreateActionAnims();
        this.unAction();
    }

    /**
     * 創建地圖提示元件
     * @memberof GameScene
     */
    onCreateMapActionCards() {
        let self = this;
        this.scene.anims.create({
            key: 'Dig',
            frames: this.scene.anims.generateFrameNumbers('gameMapActionCard', {
                start: 0,
                end: 1
            }),
            frameRate: 3,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'Collapse',
            frames: this.scene.anims.generateFrameNumbers('gameMapActionCard', {
                start: 2,
                end: 3
            }),
            frameRate: 3,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'Watch',
            frames: this.scene.anims.generateFrameNumbers('gameMapActionCard', {
                start: 4,
                end: 5
            }),
            frameRate: 3,
            repeat: -1
        });
        this.mapActionCards = {};
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 5; j++) {
                let key = i + '_' + j;
                let mapActionCard = this.scene.add.sprite(136 + (i - 1) * 72, 201 + (j - 1) * 100, 'gameMapActionCard').setInteractive();
                mapActionCard.on('pointerup', function (pointer) {
                    let actionType = this.actionType; //// 1:Dig, 2:Collapse, 3:Watch
                    switch (actionType) {
                        case 1:
                            self.onPutDigCard(key);
                            break;
                        case 2:
                            self.onPutCollapseCard(key);
                            break;
                        case 3:
                            self.onPutWatchCard(key);
                            break;
                    }
                });
                this.mapActionCards[key] = mapActionCard;
            }
        }
    }

    /**
     * 創建角色元件
     * @memberof MainPlayerInfo
     */
    onCreateRole() {
        let self = this;
        this.role = this.scene.add.sprite(987.5, 697, 'gameRole').setInteractive();
        this.role.on('pointerup', function (pointer) {
            this.setFrame(this.frame.name === self.identity ? 2 : self.identity);
        });
    }

    /**
     * 創建暱稱文字欄
     * @memberof MainPlayerInfo
     */
    onCreateNicknameTxt() {
        this.nicknameTxt = this.scene.add.text(356, 620, '', {
            fontFamily: 'Microsoft JhengHei',
            fontSize: 22,
            color: '#000000',
            align: 'center'
        });
    }

    /**
     * 創建倒數計時元件
     * @memberof MainPlayerInfo
     */
    onCreateCountdown() {
        this.countdown = this.scene.add.sprite(614.5, 632, 'gameCountDown');
    }

    /**
     * 創建提醒動作元件
     * @memberof MainPlayerInfo
     */
    onCreateActionMark() {
        this.scene.anims.create({
            key: 'ActionMark',
            frames: this.scene.anims.generateFrameNumbers('gameActionMark', {
                start: 0,
                end: 1
            }),
            frameRate: 3,
            repeat: -1
        });
        this.actionMark = this.scene.add.sprite(522.5, 632, 'gameActionMark')
    }

    /**
     * 創建棄牌元件
     * @memberof MainPlayerInfo
     */
    onCreateGiveUpButton() {
        let self = this;
        this.giveUpButton = this.scene.add.image(675, 632, 'gameGiveUpButton').setInteractive();
        this.giveUpButton.on('pointerdown', function (pointer) {
            this.setFrame(2);
        });
        this.giveUpButton.on('pointerover', function (pointer) {
            this.setFrame(1);
        });
        this.giveUpButton.on('pointerout', function (pointer) {
            this.setFrame(0);
        });
        this.giveUpButton.on('pointerup', function (pointer) {
            self.onGiveUpCard();
        });
    }

    /**
     * 創建狀態元件
     * @memberof MainPlayerInfo
     */
    onCreateLocks() {
        this.locks = [];
        for (let i = 0; i < 3; i++) {
            let lock = this.scene.add.sprite(732.5 + i * 45, 632, 'gameMainLocks');
            lock.setFrame(i + 3);
            this.locks.push(lock);
        }
    }

    /**
     * 創建手牌元件
     * @memberof MainPlayerInfo
     */
    onCreateCards() {
        let self = this;
        this.cards = [];
        this.transformButtons = [];
        for (let i = 0; i < 6; i++) {
            //// create card
            let card = this.scene.add.sprite(403 + i * 95, 727.5, 'gameCard').setInteractive();
            card.on('pointerup', function (pointer) {
                self.onAppointCard(i);
            });
            this.cards.push(card);
            //// transform button
            let transformButton = this.scene.add.image(435.5 + i * 95, 677.5, 'gameTransformButton').setInteractive();
            transformButton.on('pointerup', function (pointer) {
                self.onTransformRoadCrad(i);
                if (self.isAction) {
                    self.onAppointCard(i);
                }
            });
            this.transformButtons.push(transformButton);
        }
    }

    /**
     * 創建指定卡牌元件
     * @memberof MainPlayerInfo
     */
    onCreateAppointMark() {
        this.appointMark = this.scene.add.sprite(403, 757.5, 'gameAppointMark');
    }

    /**
     * 創建修復提醒元件
     * @memberof MainPlayerInfo
     */
    onCreateFixMark() {
        let self = this;
        this.fixMark = this.scene.add.image(403, 707.5, 'gameFixMark').setInteractive();
        this.fixMark.on('pointerup', function (pointer) {
            self.onPutActionCard(self.nickname);
        });
    }

    /**
     * 創建指定動作動畫元件
     * @memberof MainPlayerInfo
     */
    onCreateActionAnims() {
        this.actionAnims = new ActionAnims(this.scene);
        this.actionAnims.onInit();
    }

    /**
     * 初始化遊戲資料
     * @param {object} data
     * @memberof MainPlayerInfo
     */
    onInitGameData(data) {
        //// update nickname
        this.nickname = data.nickname;
        this.nicknameTxt.setText(InputService.onReduceTxtInput(this.nicknameTxt, data.nickname, 80) + SPACE_GAME_MAIN_NAME_TXT); //// max width 80
        //// update role
        this.identity = data.identity;
        this.role.setFrame(data.identity);
        //// update cards
        this.cardDatas = data.cards; //// {type:string, typeIndex:int, cardType:int(0:Road Card, 1:Action Card), isReverse:bool}
        this.cardDatas.sort(function (card1, card2) {
            return card1.typeIndex - card2.typeIndex;
        });

        this.onHandleHandCard();
        this.unAction();
    }

    /**
     * 更新資料
     * @param {array} data
     * @memberof MainPlayerInfo
     */
    onUpdateData(data) {
        super.onUpdateData(data);
        //// update map
        this.possibleRoadDatas = data.possibleRoads;
        this.canCollapseRoadDatas = data.canCollapseRoads;
        this.canWatchRoadDatas = data.canWatchRoads;
    }

    /**
     * 更新倒數計時
     * @param {int} countdownTime
     * @memberof MainPlayerInfo
     */
    onUpdateCountdown(countdownTime) {
        this.countdown.setFrame(countdownTime);
        this.countdown.visible = true;

        if (countdownTime <= 3) {
            SoundService.getInstance().onPlay('gameCountDown');
        }
    }

    /**
     * 執行遊戲動作
     * @memberof MainPlayerInfo
     */
    onAction() {
        //// update actionMark
        this.actionMark.anims.play('ActionMark');
        this.actionMark.visible = true;
        //// update giveUpButton
        this.giveUpButton.visible = true;
        //// update card
        for (let card of this.cards) {
            card.input.enabled = true;
        }

        super.onAction();
    }

    /**
     * 禁止執行遊戲動作
     * @memberof MainPlayerInfo
     */
    unAction() {
        //// update map action card
        for (let key in this.mapActionCards) {
            let mapActionCard = this.mapActionCards[key];
            mapActionCard.anims.stop();
            mapActionCard.visible = false;
        }
        //// update countdown
        this.countdown.visible = false;
        //// update actionMark
        this.actionMark.anims.stop();
        this.actionMark.visible = false;
        //// update giveUpButton
        this.giveUpButton.visible = false;
        //// update card
        for (let card of this.cards) {
            card.input.enabled = false;
        }
        //// update appointMark
        this.appointMark.index = -1;
        this.appointMark.visible = false;
        //// update fixMark
        this.fixMark.visible = false;
        super.unAction();
    }

    /**
     * 放置礦道牌
     * @param {string} key
     * @memberof MainPlayerInfo
     */
    onPutDigCard(key) {
        let index = this.appointMark.index;
        if (index !== -1) {
            let cardData = this.cardDatas[index];
            this.unAction();
            this.scene.onRequestPutCard([1, [key, cardData.type, cardData.isReverse ? 1 : 0, cardData.no]]);
        } else {
            this.scene.onRequestPutCard([-1]);
        }
    }

    /**
     * 放置指定動作牌
     * @param {string} targetNickname
     * @memberof MainPlayerInfo
     */
    onPutActionCard(targetNickname) {
        let index = this.appointMark.index;
        if (index !== -1) {
            let cardData = this.cardDatas[index];
            this.unAction();
            this.scene.onRequestPutCard([cardData.cardType, [targetNickname, cardData.type, cardData.no]]);
        } else {
            this.scene.onRequestPutCard([-1]);
        }
    }

    /**
     * 放置崩塌牌
     * @param {int} key
     * @memberof MainPlayerInfo
     */
    onPutCollapseCard(key) {
        let index = this.appointMark.index;
        if (index !== -1) {
            let cardData = this.cardDatas[index];
            this.unAction();
            this.scene.onRequestPutCard([4, [key, cardData.no]]);
        } else {
            this.scene.onRequestPutCard([-1]);
        }
    }

    /**
     * 放置觀看牌
     * @param {int} key
     * @memberof MainPlayerInfo
     */
    onPutWatchCard(key) {
        let index = this.appointMark.index;
        if (index !== -1) {
            let cardData = this.cardDatas[index];
            this.unAction();
            this.scene.onRequestPutCard([5, [key, cardData.no]]);
        } else {
            this.scene.onRequestPutCard([-1]);
        }
    }

    /**
     * 棄牌
     * @memberof MainPlayerInfo
     */
    onGiveUpCard() {
        let index = this.appointMark.index;
        if (index !== -1) {
            let cardData = this.cardDatas[index];
            this.unAction();
            this.scene.onRequestPutCard([0, cardData.no]);
        } else {
            this.scene.onRequestPutCard([-1]);
        }
    }

    /**
     * 丟牌
     * @param {int} cardNo
     * @memberof MainPlayerInfo
     */
    onPutCard(cardNo) {
        for (let i = 0; i < this.cardDatas.length; i++) {
            let card = this.cardDatas[i];
            if (cardNo === card.no) {
                this.cardDatas.splice(i, 1);
                SoundService.getInstance().onPlay('putCard');
                break;
            }
        }

        this.onHandleHandCard();
    }

    /**
     * 補牌
     * @param {object} card
     * @memberof MainPlayerInfo
     */
    onTakeCard(card) {
        this.cardDatas.push(card); //// {type:string, typeIndex:int, cardType:int(0:Bad Road Card, 1:Good Road Card, 2:Action Card), isReverse:bool, no:cardNo}
        this.cardDatas.sort(function (card1, card2) {
            return card1.typeIndex - card2.typeIndex;
        });

        this.onHandleHandCard();
    }

    /**
     * 指定卡牌
     * @param {index} index
     * @memberof MainPlayerInfo
     */
    onAppointCard(index) {
        let cardData = this.cardDatas[index];
        let cardType = cardData.cardType;
        this.appointMark.x = 403 + index * 95;
        this.appointMark.index = index;
        this.appointMark.visible = true;
        switch (cardType) {
            case 0:
            case 1:
                this.onHandleMapActionCard(1, index);
                break;
            case 2:
            case 3:
                this.onHandleMapActionCard(-1, index);
                break;
            case 4:
                this.onHandleMapActionCard(2, index);
                break;
            case 5:
                this.onHandleMapActionCard(3, index);
                break;
        }

        this.onHandleAppointActionCard(index);
    }

    /**
     * 翻轉卡片
     * @param {index} index
     * @memberof MainPlayerInfo
     */
    onTransformRoadCrad(index) {
        let card = this.cards[index];
        let cardData = this.cardDatas[index];
        card.angle += 180;
        cardData.isReverse = card.angle === -180;
    }

    /**
     * 播放指定動作動畫
     * @param {int} 
     * @memberof MainPlayerInfo
     */
    onPlayActionAnims(type) {
        this.actionAnims.onPlayActionAnims(type);
    }

    /**
     * 整理地圖提示
     * @param {int} actionType //// 1:Dig, 2:Collapse, 3:Watch
     * @param {int} cardIndex
     * @memberof MainPlayerInfo
     */
    onHandleMapActionCard(actionType, cardIndex) {
        let isLock = false;
        for (let i = 0; i < 3; i++) {
            let lock = this.locks[i];
            if (lock.frame.name === i) {
                isLock = true;
                break;
            }
        }

        let appointCardData = this.cardDatas[cardIndex];
        let type = appointCardData.type;
        let isReverse = appointCardData.isReverse;
        for (let key in this.mapActionCards) {
            let mapActionCard = this.mapActionCards[key];
            switch (actionType) {
                case 1:
                    let possibleRoadData = this.possibleRoadDatas[key];
                    let isDig = false;
                    if (!isLock) {
                        if (possibleRoadData) {
                            let checkCards = isReverse ? possibleRoadData.reverseCards : possibleRoadData.cards
                            if (checkCards[type]) {
                                isDig = true;
                            }
                        }
                    }

                    if (isDig) {
                        mapActionCard.actionType = 1;
                        mapActionCard.anims.play('Dig');
                        mapActionCard.visible = true;
                    } else {
                        mapActionCard.actionType = -1;
                        mapActionCard.anims.stop();
                        mapActionCard.visible = false;
                    }
                    break;
                case 2:
                    if (this.canCollapseRoadDatas.indexOf(key) !== -1) {
                        mapActionCard.actionType = 2;
                        mapActionCard.anims.play('Collapse');
                        mapActionCard.visible = true;
                    } else {
                        mapActionCard.actionType = -1;
                        mapActionCard.anims.stop();
                        mapActionCard.visible = false;
                    }
                    break;
                case 3:
                    if (this.canWatchRoadDatas.indexOf(key) !== -1) {
                        mapActionCard.actionType = 3;
                        mapActionCard.anims.play('Watch');
                        mapActionCard.visible = true;
                    } else {
                        mapActionCard.actionType = -1;
                        mapActionCard.anims.stop();
                        mapActionCard.visible = false;
                    }
                    break;
                default:
                    mapActionCard.actionType = -1;
                    mapActionCard.anims.stop();
                    mapActionCard.visible = false;
                    break;
            }
        }
    }

    /**
     * 整理手牌
     * @memberof MainPlayerInfo
     */
    onHandleHandCard() {
        for (let i = 0; i < 6; i++) {
            let card = this.cards[i];
            let cardData = this.cardDatas[i];
            let transformButton = this.transformButtons[i];
            if (cardData) {
                card.setFrame(cardData.typeIndex);
                card.angle = cardData.isReverse ? 180 : 0;
                card.visible = true;
                transformButton.visible = cardData.cardType <= 1;
            } else {
                card.visible = false;
                transformButton.visible = false;
            }
        }
    }

    /**
     * 整理指定動作
     * @param {int} cardIndex
     * @memberof MainPlayerInfo
     */
    onHandleAppointActionCard(cardIndex) {
        let appointCardData = this.cardDatas[cardIndex];
        let appointCardFixOrAtk = appointCardData.fixOrAtk;
        let actionType = this.onCanFixOrCanAtk(appointCardFixOrAtk);
        this.fixMark.x = 403 + cardIndex * 95;
        this.fixMark.visible = actionType === 0;
        this.scene.onShowCanAppointAction(appointCardFixOrAtk);
    }
}