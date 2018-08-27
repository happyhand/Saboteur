class RobotPlayer {
    constructor(client, identity, cards, map) {
        //// base info
        this.client = client;
        this.nickname = client.nickname;
        this.identity = identity; //// -1:none, 0:bad man, 1:good man
        this.locks = [false, false, false]; //// [0, Light], [1, Mattock], [2, Minecar]
        this.cards = cards;
        this.isAction = false;
        this.countdownTime = null;
        //// game info
        this.map = map;
        this.possibleRoads = null;
        this.canCollapseRoads = null;
        this.canWatchRoads = null;
        this.goldData = {
            'key': null,
            'index': 0
        };
        this.actions = {};
    }

    /**
     * 加入遊戲
     * @memberof RobotPlayer
     */
    onJoinGame() {
        //// not work
    }

    /**
     * 執行動作
     * @param {int} countdown
     * @memberof RobotPlayer
     */
    onAction(countdown) {
        let self = this;
        // let randomTime = countdown - (Math.random() * 5 + 2);
        let randomTime = countdown - 1;
        this.isAction = true;
        this.countdownTime = setInterval(function () {
            countdown--;
            if (countdown <= randomTime) {
                clearInterval(self.countdownTime);
                self.onRobotAction();
            }
        }, 1000);
    }

    /**
     * 停止動作
     * @memberof RobotPlayer
     */
    unAction() {
        this.isAction = false;
        clearInterval(this.countdownTime);
    }

    /**
     * 執行遊戲動作
     * @memberof RobotPlayer
     */
    onRobotAction() {
        let cardClass = require('./card/Card.js');
        let watchCard = null;
        let fixCards = [];
        let atkCards = [];
        for (let card of this.cards) {
            if (card.type === cardClass.MAP) {
                watchCard = card;
            }

            if (card.cardType === 2) {
                fixCards.push(card);
            } else if (card.cardType === 3) {
                atkCards.push(card);
            }
        }

        //// watch card
        if (watchCard) {
            if (!this.goldData.key) {
                this.client.doWatchCard('8_' + (2 * this.goldData.index), card.no);
                this.goldData.index += 1;
                return;
            }
        }
        //// action card
        if (this.locks.indexOf(true) !== -1) {
            for (let actionCard of this.cards) {
                if (card.type === cardClass.MAP) {
                    for (let watchGoldPositionkey in this.goldPositions) {
                        let watchGoldPosition = this.goldPositions[watchGoldPositionkey];
                        if (watchGoldPosition === -1) {
                            this.client.doWatchCard(watchGoldPositionkey, card.no);
                            return;
                        }
                    }
                }
            }
        }

        //// give up card
        let card = this.cards[Math.floor(Math.random() * this.cards.length)];
        this.client.doGiveUpCard(card.no);
    }

    /**
     * 更新狀態
     * @param {bool} isLockLight
     * @param {bool} isLockMattock
     * @param {bool} isLockMinecar
     * @memberof RobotPlayer
     */
    onUpdateLocks(isLockLight, isLockMattock, isLockMinecar) {
        this.locks = [isLockLight, isLockMattock, isLockMinecar];
    }

    /**
     * 丟牌
     * @param {int} no
     * @memberof RobotPlayer
     */
    onPutCard(no) {
        for (let i = 0; i < this.cards.length; i++) {
            let noCard = this.cards[i];
            if (noCard.no === no) {
                this.cards.splice(i, 1);
                break;
            }
        }
    }

    /**
     * 補牌
     * @param {Card} card
     * @memberof RobotPlayer
     */
    onTakeCard(card) {
        this.cards.push(card);
    }

    /**
     * 修復工具
     * @param {bool} isFixLight
     * @param {bool} isFixMattock
     * @param {bool} isFixMinecar
     * @param {string} action
     * @memberof RobotPlayer
     */
    onFixTool(isFixLight, isFixMattock, isFixMinecar, action) {
        if (isFixLight) {
            this.locks[0] = false;
            this.actions[action]['friendly'] += 1;
        }

        if (isFixMattock) {
            this.locks[1] = false;
            this.actions[action]['friendly'] += 1;
        }

        if (isFixMinecar) {
            this.locks[2] = false;
            this.actions[action]['friendly'] += 1;
        }
    }

    /**
     * 破壞工具
     * @param {bool} isAtkLight
     * @param {bool} isAtkMattock
     * @param {bool} isAtkMinecar
     * @param {string} action
     * @memberof RobotPlayer
     */
    onAtkTool(isAtkLight, isAtkMattock, isAtkMinecar, action) {
        if (isAtkLight) {
            this.locks[0] = true;
            this.actions[action]['friendly'] -= 1;
        }

        if (isAtkMattock) {
            this.locks[1] = true;
            this.actions[action]['friendly'] -= 1;
        }

        if (isAtkMinecar) {
            this.locks[2] = true;
            this.actions[action]['friendly'] -= 1;
        }
    }

    /**
     * 查看牌
     * @param {string} key
     * @param {Card} card
     * @memberof RobotPlayer
     */
    onWatchCard(key, card) {
        if (!this.goldData.key) {
            let cardClass = require('./card/Card.js');
            this.goldData.key = card.type === cardClass.ENDROAD_TYPE_1 ? key : null;
        }
    }

    /**
     * 更新遊戲資訊
     * @param {object} gameInfo
     * @memberof RobotPlayer
     */
    onUpdateGameInfo(gameInfo) {
        let playerDatas = gameInfo.players;
        for (let playerData of playerDatas) {
            if (playerData.nickname !== this.nickname) {
                if (!this.actions[playerData.nickname]) {
                    this.actions[playerData.nickname] = {
                        'locks': [],
                        'friendly': 0
                    };
                }
                this.actions[playerData.nickname]['locks'] = playerData.locks;
            }
        }

        this.possibleRoads = gameInfo.possibleRoads;
        this.canCollapseRoads = gameInfo.canCollapseRoads;
        this.canWatchRoads = gameInfo.canWatchRoads;
    }

    /**
     * 接收遊戲訊息 (Robot 用)
     * @param {int} type
     * @param {string} action
     * @param {string} targer
     * @param {string} key
     * @memberof RobotPlayer
     */
    onReceiveGameRecord(type, action, targer, key) {
        if(action === this.nickname)
        {
            return;
        }
        //// type:(0, dig)、(1, collapse)、(2, watch)、(3, fix)、(4, atk)、(5, give up)
        let col = key ? parseInt(key.split('_')[0]) : null;
        let row = key ? parseInt(key.split('_')[1]) : null;
        let card = key ? this.map[key] : null;
        switch (type) {
            case 0:
                if (this.goldData.key) {
                    if (card.cardType === 0) {
                        let road = card.getRoad();
                        let mapRow = key ? parseInt(this.goldData.key.split('_')[1]) : null;
                        if (road[1] === 1) {
                            if (this.identity === 1) {
                                this.actions[action]['friendly'] += 1;
                            } else {
                                this.actions[action]['friendly'] -= 1;
                            }
                        } else {
                            if (mapRow > row && road[3] === 1) {
                                if (this.identity === 1) {
                                    this.actions[action]['friendly'] += 1;
                                } else {
                                    this.actions[action]['friendly'] -= 1;
                                }
                            } else if (mapRow < row && road[0] === 1) {
                                if (this.identity === 1) {
                                    this.actions[action]['friendly'] += 1;
                                } else {
                                    this.actions[action]['friendly'] -= 1;
                                }
                            }
                            else
                            {
                                if (this.identity === 1) {
                                    this.actions[action]['friendly'] -= 1;
                                } else {
                                    this.actions[action]['friendly'] += 1;
                                }
                            }
                        }
                    }
                } else {
                    if (card.cardType === 0) {
                        if (this.identity === 0) {
                            this.actions[action]['friendly'] += 1;
                        } else {
                            this.actions[action]['friendly'] -= 1;
                        }
                    }
                }
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
        }
    }

    /**
     * 玩家是否可以挖掘礦道
     * @memberof RobotPlayer
     */
    canDig() {
        return this.locks.indexOf(true) === -1;
    }

    /**
     * 銷毀玩家資料
     * @memberof RobotPlayer
     */
    onDestroy() {
        clearInterval(this.countdownTime);
        this.client = null;
        this.nickname = null;
        this.identity = null;
        this.cards = null;
        this.locks = null;
        this.countdownTime = null;
    }
}

module.exports = RobotPlayer;