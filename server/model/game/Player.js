class Player {
    constructor(client, identity, cards) {
        this.client = client;
        this.nickname = client.nickname;
        this.identity = identity; //// -1:none, 0:bad man, 1:good man
        this.locks = [false, false, false]; //// [0, Light], [1, Mattock], [2, Minecar]
        this.cards = cards;
        this.isAction = false;
        this.countdownTime = null;

    }

    /**
     * 加入遊戲
     * @param {string} gameID
     * @memberof Player
     */
    onJoinGame(gameID) {
        this.client.onJoinGame(gameID, {
            nickname: this.nickname,
            identity: this.identity,
            cards: this.cards
        });
    }

    /**
     * 執行動作
     * @param {int} countdown
     * @memberof Player
     */
    onAction(countdown) {
        let self = this;
        this.isAction = true;
        this.countdownTime = setInterval(function () {
            if (countdown > 0) {
                countdown--;
                self.client.onUpdateCountdown(countdown);
            } else {
                clearInterval(self.countdownTime);
                let card = self.cards[Math.floor(Math.random() * self.cards.length)];
                self.client.doGiveUpCard(card.no);
            }
        }, 1000);
    }

    /**
     * 停止動作
     * @memberof Player
     */
    unAction() {
        this.isAction = false;
        clearInterval(this.countdownTime);
    }

    /**
     * 更新狀態
     * @param {bool} isLockLight
     * @param {bool} isLockMattock
     * @param {bool} isLockMinecar
     * @memberof Player
     */
    onUpdateLocks(isLockLight, isLockMattock, isLockMinecar) {
        this.locks = [isLockLight, isLockMattock, isLockMinecar];
    }

    /**
     * 丟牌
     * @param {int} no
     * @memberof Player
     */
    onPutCard(no) {
        for (let i = 0; i < this.cards.length; i++) {
            let noCard = this.cards[i];
            if (noCard.no === no) {
                this.cards.splice(i, 1);
                break;
            }
        }

        this.client.onPutCard(no);
    }

    /**
     * 補牌
     * @param {Card} card
     * @memberof Player
     */
    onTakeCard(card) {
        this.cards.push(card);
        this.client.onTakeCard(card);
    }

    /**
     * 修復工具
     * @param {bool} isFixLight
     * @param {bool} isFixMattock
     * @param {bool} isFixMinecar
     * @memberof Player
     */
    onFixTool(isFixLight, isFixMattock, isFixMinecar) {
        if (isFixLight) {
            let isLockLight = this.locks[0];
            this.locks[0] = false;
            if (isLockLight) {
                this.client.onAppointAction(1);
            }
        }

        if (isFixMattock) {
            let isLockMattock = this.locks[1];
            this.locks[1] = false;
            if (isLockMattock) {
                this.client.onAppointAction(2);
            }
        }

        if (isFixMinecar) {
            let isLockMinecar = this.locks[2];
            this.locks[2] = false;
            if (isLockMinecar) {
                this.client.onAppointAction(3);
            }
        }
    }

    /**
     * 破壞工具
     * @param {bool} isAtkLight
     * @param {bool} isAtkMattock
     * @param {bool} isAtkMinecar
     * @memberof Player
     */
    onAtkTool(isAtkLight, isAtkMattock, isAtkMinecar) {
        if (isAtkLight) {
            this.locks[0] = true;
            this.client.onAppointAction(-1);
        }

        if (isAtkMattock) {
            this.locks[1] = true;
            this.client.onAppointAction(-2);
        }

        if (isAtkMinecar) {
            this.locks[2] = true;
            this.client.onAppointAction(-3);
        }
    }

    /**
     * 查看牌
     * @param {string} key
     * @param {Card} card
     * @memberof Player
     */
    onWatchCard(key, card) {
        this.client.onWatchCard(key, card);
    }

    /**
     * 更新遊戲資訊
     * @param {object} gameInfo
     * @memberof Player
     */
    onUpdateGameInfo(gameInfo) {
        this.client.onUpdateGameInfo(gameInfo);
    }

    /**
     * 接收遊戲訊息 (Robot 用來判斷友善值)
     * @param {object} map
     * @param {int} type
     * @param {string} action
     * @param {string} targer
     * @param {string} key
     * @memberof RobotPlayer
     */
    onReceiveGameRecord(map, type, action, targer, key) {
        //// not work
    }

    /**
     * 玩家是否可以挖掘礦道
     * @returns bool
     * @memberof Player
     */
    canDig() {
        return this.locks.indexOf(true) === -1;
    }

    /**
     * 銷毀玩家資料
     * @memberof Player
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

module.exports = Player;