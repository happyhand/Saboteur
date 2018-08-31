class RobotPlayer {
    constructor(client, identity, cards) {
        //// base info
        this.client = client;
        this.nickname = client.nickname;
        this.identity = identity; //// -1:none, 0:bad man, 1:good man
        this.locks = [false, false, false]; //// [0, Light], [1, Mattock], [2, Minecar]
        this.cards = cards;
        this.isAction = false;
        this.countdownTime = null;
        //// game info
        this.map = null;
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
        let randomTime = countdown - (Math.random() * 5 + 2);
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
        let actions = Object.assign({}, this.actions);
        let goodCards = [];
        let badCards = [];
        let fixCards = [];
        let atkCards = [];
        let collapseCard = null;
        let watchCard = null;
        this.onShuffle(actions);
        for (let card of this.cards) {
            switch (card.cardType) {
                case 0:
                    badCards.push(card);
                    break;
                case 1:
                    goodCards.push(card);
                    break;
                case 2:
                    fixCards.push(card);
                    break;
                case 3:
                    atkCards.push(card);
                    break;
                case 4:
                    collapseCard = card;
                    break;
                case 5:
                    watchCard = card;
                    break;
            }
        }
        //// watch card
        if (this.doWatchAction(watchCard)) {
            return;
        }
        //// fix card
        if (this.doFixSelfAction(fixCards, actions)) {
            return;
        } else {
            if (this.doFixOtherAction(fixCards, actions)) {
                return;
            }
        }
        //// atk card
        if (this.doAtkAction(atkCards, actions)) {
            return;
        }
        //// dig or collapse card
        if (this.canDig()) {
            let roadCombine = this.identity === 1?goodCards:goodCards.concat(badCards);
            if (this.doDigOrCollapse(roadCombine, collapseCard, actions)) {
                return;
            }
        }
        //// give up card
        if (this.identity === 1) {
            if (badCards.length > 0) {
                this.client.doGiveUpCard(badCards[0].no);
                return;
            }
        } else {
            if (goodCards.length > 0) {
                this.client.doGiveUpCard(goodCards[0].no);
                return;
            }
        }

        if (watchCard) {
            this.client.doGiveUpCard(watchCard.no);
            return;
        }

        let card = this.cards[Math.floor(Math.random() * this.cards.length)];
        this.client.doGiveUpCard(card.no);
    }

    /**
     * 執行上方挖掘或崩塌礦道動作
     * @param {array} roadCards
     * @param {Card} collapseCard
     * @param {object} actions 
     * @returns bool
     * @memberof RobotPlayer
     */
    doDigOrCollapse(roadCards, collapseCard, actions) {
        let result = null;
        let goldKey = this.getGoldKey();
        if (this.identity === 1) {
            switch (goldKey) {
                case '8_0':
                    result = this.doDigOrCollapseToTopLine(1, roadCards, collapseCard);
                    break;
                case '8_2':
                    result = this.doDigOrCollapseToMiddleLine(1, roadCards, collapseCard);
                    break;
                case '8_4':
                    result = this.doDigOrCollapseToBottomLine(1, roadCards, collapseCard);
                    break;
                default:
                    result = this.doDigOrCollapseToMiddleLine(1, roadCards, collapseCard);
                    break;
            }
        } else {
            let useBadAction = false;
            let warnCol = 6 - Math.floor(actions.length * 0.5);
            for (let row = 0; row < 5; row++) {
                let key = warnCol + '_' + row;
                if (this.map[key]) {
                    useBadAction = true;
                    break;
                }
            }

            if (useBadAction) {
                switch (goldKey) {
                    case '8_0':
                        result = this.doDigOrCollapseToTopLine(0, roadCards, collapseCard);
                        break;
                    case '8_2':
                        result = this.doDigOrCollapseToMiddleLine(0, roadCards, collapseCard);
                        break;
                    case '8_4':
                        result = this.doDigOrCollapseToBottomLine(0, roadCards, collapseCard);
                        break;
                    default:
                        result = this.doDigOrCollapseToMiddleLine(0, roadCards, collapseCard);
                        break;
                }
            } else {
                result = this.doDigOrCollapseToMiddleLine(1, roadCards, collapseCard);
            }
        }

        if (result) {
            let targerKey = result['key'];
            let digCard = result['dig'];
            if (digCard) {
                this.client.doDigCard(targerKey, digCard.type, digCard.isReverse, digCard.no);
                return true;
            } else {
                this.client.doCollapseCard(targerKey, collapseCard.no);
                return true;
            }
        }

        return false;
    }

    /**
     * 執行上方挖掘或崩塌礦道動作
     * @param {int} actionType 0:bad action, 1:good action
     * @param {array} digRoads
     * @param {Card} collapseCard
     * @returns object
     * @memberof RobotPlayer
     */
    doDigOrCollapseToTopLine(actionType, digRoads, collapseCard) {
        for (let col = 8; col >= 0; col--) {
            let mapRoadKey = null;
            for (let row = 0; row <= 2; row++) {
                let key = col + "_" + row;
                let possibleRoad = this.possibleRoads[key];
                if (possibleRoad) {
                    let road = this.doFindTopMatchDigRoad(actionType, digRoads, possibleRoad.cards, col, row);
                    if (road) {
                        return {
                            'key': key,
                            'dig': road
                        };
                    } else {
                        road = this.doFindTopMatchDigRoad(actionType, digRoads, possibleRoad.reverseCards, col, row);
                        if (road) {
                            return {
                                'key': key,
                                'dig': road
                            };
                        }
                    }
                }

                if (!mapRoadKey) {
                    let mapRoad = this.map[key];
                    if (mapRoad && !mapRoad.isBack) {
                        mapRoadKey = key;
                    }
                }
            }

            if (mapRoadKey) {
                return this.doCollapseRoad(actionType, collapseCard, mapRoadKey);
            }
        }

        return null;
    }

    /**
     * 執行中央挖掘或崩塌礦道動作
     * @param {int} actionType 0:bad action, 1:good action
     * @param {array} digRoads
     * @param {Card} collapseCard
     * @returns object
     * @memberof RobotPlayer
     */
    doDigOrCollapseToMiddleLine(actionType, digRoads, collapseCard) {
        for (let col = 8; col >= 0; col--) {
            let mapRoadKey = null;
            for (let row = 1; row <= 3; row++) {
                let key = col + "_" + row;
                let possibleRoad = this.possibleRoads[key];
                if (possibleRoad) {
                    let road = this.doFindMiddleMatchDigRoad(actionType, digRoads, possibleRoad.cards, col, row);
                    if (road) {
                        return {
                            'key': key,
                            'dig': road
                        };
                    } else {
                        road = this.doFindMiddleMatchDigRoad(actionType, digRoads, possibleRoad.reverseCards, col, row);
                        if (road) {
                            return {
                                'key': key,
                                'dig': road
                            };
                        }
                    }
                }

                if (!mapRoadKey) {
                    let mapRoad = this.map[key];
                    if (mapRoad && !mapRoad.isBack) {
                        mapRoadKey = key;
                    }
                }
            }

            if (mapRoadKey) {
                return this.doCollapseRoad(actionType, collapseCard, mapRoadKey);
            }
        }

        return null;
    }

    /**
     * 執行下方挖掘或崩塌礦道動作
     * @param {int} actionType 0:bad action, 1:good action
     * @param {array} digRoads
     * @param {Card} collapseCard
     * @returns object
     * @memberof RobotPlayer
     */
    doDigOrCollapseToBottomLine(actionType, digRoads, collapseCard) {
        for (let col = 8; col >= 0; col--) {
            let mapRoadKey = null;
            for (let row = 4; row >= 2; row--) {
                let key = col + "_" + row;
                let possibleRoad = this.possibleRoads[key];
                if (possibleRoad) {
                    let road = this.doFindBottomMatchDigRoad(actionType, digRoads, possibleRoad.cards, col, row);
                    if (road) {
                        return {
                            'key': key,
                            'dig': road
                        };
                    } else {
                        road = this.doFindBottomMatchDigRoad(actionType, digRoads, possibleRoad.reverseCards, col, row);
                        if (road) {
                            return {
                                'key': key,
                                'dig': road
                            };
                        }
                    }
                }

                if (!mapRoadKey) {
                    let mapRoad = this.map[key];
                    if (mapRoad && !mapRoad.isBack) {
                        mapRoadKey = key;
                    }
                }
            }

            if (mapRoadKey) {
                return this.doCollapseRoad(actionType, collapseCard, mapRoadKey);
            }
        }

        return null;
    }

    /**
     * 執行找尋上方符合可挖掘礦道
     * @param {int} actionType 0:bad action, 1:good action
     * @param {array} digRoads
     * @param {array} possibleRoads
     * @param {int} digCol
     * @param {int} digRow
     * @returns Card
     * @memberof RobotPlayer
     */
    doFindTopMatchDigRoad(actionType, digRoads, possibleRoads, digCol, digRow) {
        for (let digRoad of digRoads) {
            let possibleRoad = possibleRoads[digRoad.type];
            if (possibleRoad) {
                let road = possibleRoad.getRoad();
                if (digCol !== 8) {
                    if (digRow !== 0) {
                        if (actionType === 1) {
                            if (road[0] === actionType || road[1] === actionType) {
                                return this.doCloneDigRoad(possibleRoad.type, possibleRoad.isReverse, digRoad.no);
                            }
                        } else {
                            if (road[0] === actionType && road[1] === actionType) {
                                return this.doCloneDigRoad(possibleRoad.type, possibleRoad.isReverse, digRoad.no);
                            }
                        }
                    } else {
                        if (road[1] === actionType) {
                            return this.doCloneDigRoad(possibleRoad.type, possibleRoad.isReverse, digRoad.no);
                        }
                    }
                } else {
                    if (road[0] === actionType) {
                        return this.doCloneDigRoad(possibleRoad.type, possibleRoad.isReverse, digRoad.no);
                    }
                }
            }
        }

        return null;
    }

    /**
     * 執行找尋中央符合可挖掘礦道
     * @param {int} actionType 0:bad action, 1:good action
     * @param {array} digRoads
     * @param {array} possibleRoads
     * @param {int} digCol
     * @param {int} digRow
     * @returns Card
     * @memberof RobotPlayer
     */
    doFindMiddleMatchDigRoad(actionType, digRoads, possibleRoads, digCol, digRow) {
        for (let digRoad of digRoads) {
            let possibleRoad = possibleRoads[digRoad.type];
            if (possibleRoad) {
                let road = possibleRoad.getRoad();
                if (digCol !== 8) {
                    switch (digRow) {
                        case 1:
                            if (actionType === 1) {
                                if (road[3] === actionType || road[1] === actionType) {
                                    return this.doCloneDigRoad(possibleRoad.type, possibleRoad.isReverse, digRoad.no);
                                }
                            } else {
                                if (road[3] === actionType && road[1] === actionType) {
                                    return this.doCloneDigRoad(possibleRoad.type, possibleRoad.isReverse, digRoad.no);
                                }
                            }
                            break;
                        case 2:
                            if (road[1] === actionType) {
                                return this.doCloneDigRoad(possibleRoad.type, possibleRoad.isReverse, digRoad.no);
                            }
                            break;
                        case 3:
                            if (actionType === 1) {
                                if (road[0] === actionType || road[1] === actionType) {
                                    return this.doCloneDigRoad(possibleRoad.type, possibleRoad.isReverse, digRoad.no);
                                }
                            } else {
                                if (road[0] === actionType && road[1] === actionType) {
                                    return this.doCloneDigRoad(possibleRoad.type, possibleRoad.isReverse, digRoad.no);
                                }
                            }
                            break;
                    }
                } else {
                    switch (digRow) {
                        case 1:
                            if (road[3] === actionType) {
                                return this.doCloneDigRoad(possibleRoad.type, possibleRoad.isReverse, digRoad.no);
                            }
                            break;
                        case 3:
                            if (road[0] === actionType) {
                                return this.doCloneDigRoad(possibleRoad.type, possibleRoad.isReverse, digRoad.no);
                            }
                            break;
                    }
                }
            }
        }

        return null;
    }

    /**
     * 執行找尋下方符合可挖掘礦道
     * @param {int} actionType 0:bad action, 1:good action
     * @param {array} digRoads
     * @param {array} possibleRoads
     * @param {int} digCol
     * @param {int} digRow
     * @returns Card
     * @memberof RobotPlayer
     */
    doFindBottomMatchDigRoad(actionType, digRoads, possibleRoads, digCol, digRow) {
        for (let digRoad of digRoads) {
            let possibleRoad = possibleRoads[digRoad.type];
            if (possibleRoad) {
                let road = possibleRoad.getRoad();
                if (digCol !== 8) {
                    if (digRow !== 4) {
                        if (actionType === 1) {
                            if (road[3] === actionType || road[1] === actionType) {
                                return this.doCloneDigRoad(possibleRoad.type, possibleRoad.isReverse, digRoad.no);
                            }
                        } else {
                            if (road[3] === actionType && road[1] === actionType) {
                                return this.doCloneDigRoad(possibleRoad.type, possibleRoad.isReverse, digRoad.no);
                            }
                        }
                    } else {
                        if (road[1] === actionType) {
                            return this.doCloneDigRoad(possibleRoad.type, possibleRoad.isReverse, digRoad.no);
                        }
                    }
                } else {
                    if (road[3] === actionType) {
                        return this.doCloneDigRoad(possibleRoad.type, possibleRoad.isReverse, digRoad.no);
                    }
                }
            }
        }

        return null;
    }

    /**
     * 執行複製挖掘礦道資料
     * @memberof RobotPlayer
     */
    doCloneDigRoad(type, isReverse, no) {
        let cardClass = require('./card/Card.js');
        let card = new cardClass(type);
        card.setReverse(isReverse);
        card.setNo(no);
        return card;
    }

    /**
     * 執行崩塌礦道動作
     * @param {int} actionType 0:bad action, 1:good action
     * @param {Card} collapseCard
     * @param {Card} targetMap
     * @returns string
     * @memberof RobotPlayer
     */
    doCollapseRoad(actionType, collapseCard, targetMapKey) {
        let key = null;
        if (collapseCard) {
            if (actionType === 1) {
                key = targetMapKey;
            } else {
                if (this.map['0_1'] && this.map['0_1'].cardType === 1) {
                    key = '0_1';
                } else if (this.map['1_2'] && this.map['1_2'].cardType === 1) {
                    key = '1_2';
                } else if (this.map['0_3'] && this.map['0_3'].cardType === 1) {
                    key = '0_3';
                }
            }
        }

        if (this.canCollapseRoads.indexOf(key) !== -1) {
            return {
                'key': key
            }
        }

        return null;
    }

    /**
     * 執行自我修復動作
     * @param {array} fixCards 
     * @returns bool
     * @memberof RobotPlayer
     */
    doFixSelfAction(fixCards) {
        if (fixCards.length > 0) {
            for (let i = 0; i < 3; i++) {
                let lock = this.locks[i];
                if (lock) {
                    for (let fixCard of fixCards) {
                        if (fixCard.fixOrAtk[i] === 1) {
                            this.client.doFixCard(this.nickname, fixCard.type, fixCard.no);
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }

    /**
     * 執行修復指定對象動作
     * @param {array} fixCards 
     * @param {object} actions 
     * @returns bool
     * @memberof RobotPlayer
     */
    doFixOtherAction(fixCards, actions) {
        if (fixCards.length > 0) {
            for (let nickname in actions) {
                let action = actions[nickname];
                let gbv = action['gbv'];
                let doFix = (this.identity === 1 && gbv > 0) || (this.identity === 0 && gbv < 0);
                if (doFix) {
                    let locks = action['locks'];
                    for (let i = 0; i < 3; i++) {
                        let lock = locks[i];
                        if (lock) {
                            for (let fixCard of fixCards) {
                                if (fixCard.fixOrAtk[i] === 1) {
                                    this.client.doFixCard(nickname, fixCard.type, fixCard.no);
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }

        return false;
    }

    /**
     * 執行破壞動作
     * @param {array} atkCards 
     * @param {object} actions 
     * @returns bool
     * @memberof RobotPlayer
     */
    doAtkAction(atkCards, actions) {
        if (atkCards.length > 0) {
            for (let nickname in actions) {
                let action = actions[nickname];
                let gbv = action['gbv'];
                let doAtk = (this.identity === 1 && gbv > 0) || (this.identity === 0 && gbv < 0);
                if (doAtk) {
                    let locks = action['locks'];
                    if (locks.indexOf(true) === -1) {
                        this.client.doAtkCard(nickname, atkCards[0].type, atkCards[0].no);
                        return true;
                    }
                }
            }
        }

        return false;
    }

    /**
     * 執行看牌動作
     * @param {Card} watchCard 
     * @returns bool
     * @memberof RobotPlayer
     */
    doWatchAction(watchCard) {
        if (watchCard) {
            let goldKey = this.getGoldKey();
            if (!goldKey) {
                this.client.doWatchCard('8_' + (2 * this.goldData.index), watchCard.no);
                this.goldData.index += 1;
                return true;
            }
        }

        return false;
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
     * @memberof RobotPlayer
     */
    onFixTool(isFixLight, isFixMattock, isFixMinecar) {
        if (isFixLight) {
            this.locks[0] = false;
        }

        if (isFixMattock) {
            this.locks[1] = false;
        }

        if (isFixMinecar) {
            this.locks[2] = false;
        }
    }

    /**
     * 破壞工具
     * @param {bool} isAtkLight
     * @param {bool} isAtkMattock
     * @param {bool} isAtkMinecar
     * @memberof RobotPlayer
     */
    onAtkTool(isAtkLight, isAtkMattock, isAtkMinecar) {
        if (isAtkLight) {
            this.locks[0] = true;
        }

        if (isAtkMattock) {
            this.locks[1] = true;
        }

        if (isAtkMinecar) {
            this.locks[2] = true;
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
                        'gbv': 0 //// Good And Bad Value
                    };
                }
                this.actions[playerData.nickname]['locks'] = playerData.locks;
            }
        }

        this.map = gameInfo.map;
        this.possibleRoads = gameInfo.possibleRoads;
        this.canCollapseRoads = gameInfo.canCollapseRoads;
        this.canWatchRoads = gameInfo.canWatchRoads;
    }

    /**
     * 接收遊戲訊息 (Robot 用來判斷友善值)
     * @param {object} map
     * @param {int} type
     * @param {string} action
     * @param {string} targer
     * @param {string} key
     * @param {Card} card
     * @memberof RobotPlayer
     */
    onReceiveGameRecord(type, action, targer, key, card) {
        if (action === this.nickname) {
            return;
        }
        //// type:(0, dig)、(1, collapse)、(2, watch)、(3, fix)、(4, atk)、(5, give up)
        let row = key ? parseInt(key.split('_')[1]) : null;
        switch (type) {
            case 0:
                if (card.cardType === 1) {
                    let goldKey = this.getGoldKey();
                    if (goldKey) {
                        //// 若已知金礦所在，若放置無法往右行走，或是無法往上或往下靠近金礦者，將視為 bad man
                        let road = card.getRoad();
                        let mapCol = key ? parseInt(goldKey.split('_')[0]) : null;
                        let mapRow = key ? parseInt(goldKey.split('_')[1]) : null;
                        if (mapRow > row && road[3] === 1) {
                            this.actions[action]['gbv'] += 1;
                        } else if (mapRow < row && road[0] === 1) {
                            this.actions[action]['gbv'] += 1;
                        } else if (mapCol !== 8 && road[1] === 1) {
                            this.actions[action]['gbv'] += 1;
                        } else {
                            this.actions[action]['gbv'] -= 1;
                        }
                    }
                } else {
                    //// 若放置壞礦道者，將視為 bad man
                    this.actions[action]['gbv'] -= 1;
                }
                break;
            case 1:
                if (card.cardType === 1) {
                    this.actions[action]['gbv'] += 1;
                } else {
                    this.actions[action]['gbv'] -= 1;
                }
                break;
            case 2:
                //// not work
                break;
            case 3:
                if (targer === this.nickname) {
                    this.actions[action]['gbv'] += -2 * (1 + 2 * this.identity);
                }
                break;
            case 4:
                if (targer === this.nickname) {
                    this.actions[action]['gbv'] -= -2 * (1 + 2 * this.identity);
                }
                break;
            case 5:
                //// not work
                break;
        }
    }

    /**
     * 隨機排序
     * @param {array} arr 
     * @memberof Game
     */
    onShuffle(arr) {
        for (let i = 0; i < arr.length; i++) {
            let randomIndex = Math.floor(Math.random() * arr.length);
            let element = arr[i];
            let randomElement = arr[randomIndex];
            arr[randomIndex] = element;
            arr[i] = randomElement;
        }
    }

    /**
     * 取得金礦位置
     * @returns string
     * @memberof RobotPlayer
     */
    getGoldKey() {
        if (this.goldData.key) {
            return this.goldData.key;
        } else {
            let cardClass = require('./card/Card.js');
            if (this.map['8_0'].type === cardClass.ENDROAD_TYPE_1) {
                return '8_0';
            }

            if (this.map['8_2'].type === cardClass.ENDROAD_TYPE_1) {
                return '8_0';
            }

            if (this.map['8_4'].type === cardClass.ENDROAD_TYPE_1) {
                return '8_0';
            }
        }

        return null;
    }

    /**
     * 玩家是否可以挖掘礦道
     * @returns bool
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
        this.isAction = null;
        this.map = null;
        this.possibleRoads = null;
        this.canCollapseRoads = null;
        this.canWatchRoads = null;
        this.goldData = null;
        this.actions = null;
    }
}

module.exports = RobotPlayer;