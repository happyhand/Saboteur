class Game {
    constructor(server, room, id, countdown) {
        this.server = server;
        this.room = room;
        this.id = id;
        this.countdown = countdown;
        this.clients = null;
        this.watchClients = null;
        this.map = null;
        this.possibleRoads = null;
        this.players = null;
        this.actionList = null;
        this.actionIndex = null;
        this.remainCards = null;
        this.isFinishGame = null;
    }

    //#region Game Create
    /**
     * 創建地圖
     * @param {Card} cardClass
     * @memberof Game
     */
    onCreateMap(cardClass) {
        this.map = {};
        //// create end road
        let endCards = [];
        let initEndCard = function (type) {
            let endCard = new cardClass(type);
            endCard.setReverse(Math.random() > 0.5);
            endCard.setBack(true);
            endCards.push(endCard);
        }

        initEndCard(cardClass.ENDROAD_TYPE_1);
        initEndCard(cardClass.ENDROAD_TYPE_2);
        initEndCard(cardClass.ENDROAD_TYPE_3);
        this.onShuffle(endCards);
        //// put start road and end road
        this.map['0_2'] = new cardClass(cardClass.STARTROAD_TYPE);
        this.map['8_0'] = endCards[0];
        this.map['8_2'] = endCards[1];
        this.map['8_4'] = endCards[2];
    }

    /**
     * 創建卡片數據
     * @param {Card} cardClass
     * @memberof Game
     */
    onCreateCard(cardClass) {
        this.remainCards = [];
        //// put in road card
        for (let i = 5; i >= 1; i--) {
            this.remainCards.push(new cardClass(cardClass.GOODROAD_TYPE_21));
            this.remainCards.push(new cardClass(cardClass.GOODROAD_TYPE_31));
            this.remainCards.push(new cardClass(cardClass.GOODROAD_TYPE_32));
            this.remainCards.push(new cardClass(cardClass.GOODROAD_TYPE_41));
            if (i <= 4) {
                this.remainCards.push(new cardClass(cardClass.GOODROAD_TYPE_22));
                this.remainCards.push(new cardClass(cardClass.GOODROAD_TYPE_12));
            }

            if (i <= 3) {
                this.remainCards.push(new cardClass(cardClass.GOODROAD_TYPE_11));
            }

            if (i === 1) {
                this.remainCards.push(new cardClass(cardClass.BADROAD_TYPE_11));
                this.remainCards.push(new cardClass(cardClass.BADROAD_TYPE_12));
                this.remainCards.push(new cardClass(cardClass.BADROAD_TYPE_21));
                this.remainCards.push(new cardClass(cardClass.BADROAD_TYPE_22));
                this.remainCards.push(new cardClass(cardClass.BADROAD_TYPE_23));
                this.remainCards.push(new cardClass(cardClass.BADROAD_TYPE_24));
                this.remainCards.push(new cardClass(cardClass.BADROAD_TYPE_31));
                this.remainCards.push(new cardClass(cardClass.BADROAD_TYPE_32));
                this.remainCards.push(new cardClass(cardClass.BADROAD_TYPE_41));
            }
        }
        //// put in action card
        for (let j = 6; j >= 1; j--) {
            this.remainCards.push(new cardClass(cardClass.MAP));
            if (j <= 3) {
                this.remainCards.push(new cardClass(cardClass.BREAK_LIGHT));
                this.remainCards.push(new cardClass(cardClass.BREAK_MATTOCK));
                this.remainCards.push(new cardClass(cardClass.BREAK_MINECAR));
                this.remainCards.push(new cardClass(cardClass.COLLAPSE));

            }

            if (j <= 2) {
                this.remainCards.push(new cardClass(cardClass.FIX_LIGHT));
                this.remainCards.push(new cardClass(cardClass.FIX_MATTOCK));
                this.remainCards.push(new cardClass(cardClass.FIX_MINECAR));
            }

            if (j === 1) {
                this.remainCards.push(new cardClass(cardClass.FIX_LIGHT_MATTOCK));
                this.remainCards.push(new cardClass(cardClass.FIX_LIGHT_MINECAR));
                this.remainCards.push(new cardClass(cardClass.FIX_MATTOCK_MINECAR));
            }
        }
        //// shuffle card
        this.onShuffle(this.remainCards);
        //// set card no
        for (let k = 0; k < this.remainCards.length; k++) {
            let remainCard = this.remainCards[k];
            remainCard.setNo(k);
        }
    }

    /**
     * 創建玩家數據
     * @memberof Game
     */
    onCreatePlayer(clients) {
        let noOfPlayer = clients.length;
        //// create role
        let roleCards = [];
        switch (noOfPlayer) {
            case 3:
                roleCards = [0, 1, 1];
                break;
            case 4:
                roleCards = [0, Math.random() > 0.5 ? 0 : 1, 1, 1];
                break;
            case 5:
                roleCards = [0, 0, 1, 1, 1];
                break;
            case 6:
                roleCards = [0, 0, 1, 1, 1, 1];
                break;
            case 7:
                roleCards = [0, 0, Math.random() > 0.5 ? 0 : 1, 1, 1, 1, 1];
                break;
        }
        //// shuffle role
        this.onShuffle(roleCards);
        //// create player
        let playerClass = require('./Player.js');
        let robotPlayerClass = require('./RobotPlayer.js');
        this.clients = clients;
        this.players = {};
        this.actionList = [];
        for (let client of this.clients) {
            let nickname = client.nickname;
            let identity = roleCards.shift();
            let cards = noOfPlayer >= 6 ? this.remainCards.splice(0, 5) : this.remainCards.splice(0, 6);
            let player = !client.isRobot ? new playerClass(client, identity, cards) : new robotPlayerClass(client, identity, cards, this.map);
            this.players[nickname] = player;
            this.actionList.push(nickname);
        }
        //// shuffle action order
        this.actionIndex = 0;
        this.onShuffle(this.actionList);
    }
    //#endregion

    //#region Game 流程
    /**
     * 初始化遊戲
     * @param {array} clients
     * @memberof Game
     */
    onInitGame(clients) {
        let cardClass = require('./card/Card.js');
        this.watchClients = [];
        this.onCreateMap(cardClass);
        this.onCreateCard(cardClass);
        this.onCreatePlayer(clients);
    }

    /**
     * 開始遊戲
     * @memberof Game
     */
    onStartGame() {
        for (let client of this.clients) {
            let player = this.players[client.nickname];
            player.onJoinGame(this.id);
        }

        this.possibleRoads = this.onSearchPossibleRoad('0_2', ['0_2'], {});
        this.isFinishGame = false;
        this.onNextAction(false);
    }

    /**
     * 玩家放置礦道牌
     * @param {string} nickname
     * @param {string} digKey
     * @param {string} digType
     * @param {bool} isReverse
     * @param {int} cardNo
     * @memberof Game
     */
    onDigCard(nickname, digKey, digType, isReverse, cardNo) {
        let player = this.players[nickname];
        if (!player.isAction) {
            return;
        }

        let digCard = null;
        if (player.canDig()) {
            //// put card on the map
            let possibleRoadData = this.possibleRoads[digKey];
            if (possibleRoadData) {
                let checkRoads = isReverse ? possibleRoadData.reverseCards : possibleRoadData.cards;
                if (checkRoads[digType]) {
                    let cardClass = require('./card/Card.js');
                    digCard = new cardClass(digType);
                    digCard.setReverse(isReverse);
                    this.map[digKey] = digCard;
                    if (digCard.cardType === 1) {
                        let digRoad = digCard.getRoad();
                        switch (digKey) {
                            case '7_0':
                                if (digRoad[1] === 1) {
                                    this.map['8_0'].isBack = false;
                                }
                                break;
                            case '8_1':
                                if (digRoad[0] === 1) {
                                    this.map['8_0'].isBack = false;
                                }

                                if (digRoad[3] === 1) {
                                    this.map['8_2'].isBack = false;
                                }
                                break;
                            case '7_2':
                                if (digRoad[1] === 1) {
                                    this.map['8_2'].isBack = false;
                                }
                                break;
                            case '8_3':
                                if (digRoad[0] === 1) {
                                    this.map['8_2'].isBack = false;
                                }

                                if (digRoad[3] === 1) {
                                    this.map['8_4'].isBack = false;
                                }
                                break;
                            case '7_4':
                                if (digRoad[1] === 1) {
                                    this.map['8_4'].isBack = false;
                                }
                                break;
                        }
                    }
                }
            }
        }

        player.onPutCard(cardNo);
        this.possibleRoads = this.onSearchPossibleRoad('0_2', ['0_2'], {});
        this.onBroadcastDigRoad(digKey);
        this.onGameRecord(0, nickname, null, digKey, digCard);
        this.onNextAction(true);
    }

    /**
     * 玩家修復工具
     * @param {string} nickname
     * @param {string} targetNickname
     * @param {string} fixType
     * @param {int} cardNo
     * @memberof Game
     */
    onFixCard(nickname, targetNickname, fixType, cardNo) {
        let player = this.players[nickname];
        if (!player.isAction) {
            return;
        }

        let cardClass = require('./card/Card.js');
        let targetPlayer = this.players[targetNickname];
        switch (fixType) {
            case cardClass.FIX_LIGHT:
                targetPlayer.onFixTool(true, false, false);
                break;
            case cardClass.FIX_MATTOCK:
                targetPlayer.onFixTool(false, true, false);
                break;
            case cardClass.FIX_MINECAR:
                targetPlayer.onFixTool(false, false, true);
                break;
            case cardClass.FIX_LIGHT_MATTOCK:
                targetPlayer.onFixTool(true, true, false);
                break;
            case cardClass.FIX_LIGHT_MINECAR:
                targetPlayer.onFixTool(true, false, true);
                break;
            case cardClass.FIX_MATTOCK_MINECAR:
                targetPlayer.onFixTool(false, true, true);
                break;
        }
        player.onPutCard(cardNo);
        this.onGameRecord(3, nickname, targetNickname, null, null);
        this.onNextAction(true);
    }

    /**
     * 玩家破壞工具
     * @param {string} nickname
     * @param {string} targetNickname
     * @param {string} atkType
     * @param {int} cardNo
     * @memberof Game
     */
    onAtkCard(nickname, targetNickname, atkType, cardNo) {
        let player = this.players[nickname];
        if (!player.isAction) {
            return;
        }

        let cardClass = require('./card/Card.js');
        let targetPlayer = this.players[targetNickname];
        switch (atkType) {
            case cardClass.BREAK_LIGHT:
                targetPlayer.onAtkTool(true, false, false);
                break;
            case cardClass.BREAK_MATTOCK:
                targetPlayer.onAtkTool(false, true, false);
                break;
            case cardClass.BREAK_MINECAR:
                targetPlayer.onAtkTool(false, false, true);
                break;
        }
        player.onPutCard(cardNo);
        this.onGameRecord(4, nickname, targetNickname, null, null);
        this.onNextAction(true);
    }

    /**
     * 玩家崩塌礦道
     * @param {string} nickname
     * @param {string} collapseKey
     * @param {int} cardNo
     * @memberof Game
     */
    onCollapseCard(nickname, collapseKey, cardNo) {
        let player = this.players[nickname];
        if (!player.isAction) {
            return;
        }

        if (this.map[collapseKey]) {
            let collapseRoad = this.map[collapseKey];
            delete this.map[collapseKey];
            player.onPutCard(cardNo);
            this.possibleRoads = this.onSearchPossibleRoad('0_2', ['0_2'], {});
            this.onBroadcastCollapseRoad(collapseKey);
            this.onGameRecord(1, nickname, null, collapseKey, collapseRoad);
            this.onNextAction(true);
        }
    }

    /**
     * 玩家查看金礦
     * @param {string} nickname
     * @param {string} watchKey
     * @param {int} cardNo
     * @memberof Game
     */
    onWatchCard(nickname, watchKey, cardNo) {
        let player = this.players[nickname];
        if (!player.isAction) {
            return;
        }

        let watchCard = this.map[watchKey];
        player.onWatchCard(watchKey, watchCard);
        player.onPutCard(cardNo);
        this.onGameRecord(2, nickname, null, watchKey, null);
        this.onNextAction(true);
    }

    /**
     * 玩家棄牌
     * @param {string} nickname
     * @param {int} cardNo
     * @memberof Game
     */
    onGiveUpCard(nickname, cardNo) {
        let player = this.players[nickname];
        if (!player.isAction) {
            return;
        }

        player.onPutCard(cardNo);
        this.onGameRecord(5, nickname, null, null, null);
        this.onNextAction(true);
    }

    /**
     * 玩家補牌
     * @param {string} nickname
     * @memberof Game
     */
    onTakeCard(nickname) {
        let player = this.players[nickname];
        let takeCard = this.remainCards.pop();
        player.onTakeCard(takeCard);
    }

    /**
     * 下一位玩家執行動作
     * @param {bool} isAction
     * @memberof Game
     */
    onNextAction(isAction) {
        let prePlayer = this.players[this.actionList[this.actionIndex]];
        if (prePlayer) {
            prePlayer.unAction();
        }

        let gameFinishStatus = this.onCheckGameFinish();
        if (gameFinishStatus !== 0) {
            this.onGameFinish(gameFinishStatus);
            return;
        }

        if (isAction) {
            if (this.remainCards.length > 0) {
                if (prePlayer) {
                    this.onTakeCard(prePlayer.nickname);
                }
            }
        }

        this.actionIndex += 1;
        if (this.actionIndex >= this.clients.length) {
            this.actionIndex = 0;
        }
        
        let actionPlayer = this.players[this.actionList[this.actionIndex]];
        if(!isAction)
        {
            if (this.remainCards.length > 0) {
                if (actionPlayer.cards.length === 0) {
                    this.onTakeCard(actionPlayer.nickname);
                }
            }
        }

        this.onBroadcastGameInfo();
        this.onBroadcastActionPlayer();
        actionPlayer.onAction(this.countdown);
    }

    /**
     * 遊戲紀錄
     * @param {int} type
     * @param {string} action
     * @param {string} targer
     * @param {string} key
     * @param {Card} road
     * @memberof Game
     */
    onGameRecord(type, action, targer, key, road) {
        //// type:(0, dig)、(1, collapse)、(2, watch)、(3, fix)、(4, atk)、(5, give up)
        let col = key ? parseInt(key.split('_')[0]) : null;
        let row = key ? parseInt(key.split('_')[1]) : null;
        switch (type) {
            case 0:
                this.onBroadcastGameChat(null, action + ' dig the ( ' + col + ', ' + row + ') map.');
                break;
            case 1:
                this.onBroadcastGameChat(null, action + ' collapse the ( ' + col + ', ' + row + ') map.');
                break;
            case 2:
                this.onBroadcastGameChat(null, action + ' watch the ( ' + col + ', ' + row + ') map.');
                break;
            case 3:
                this.onBroadcastGameChat(null, action + ' fix ' + targer + ' tool.');
                break;
            case 4:
                this.onBroadcastGameChat(null, action + ' atk ' + targer + ' tool.');
                break;
            case 5:
                this.onBroadcastGameChat(null, action + ' giveup this round.');
                break;
        }

        for (let nickname in this.players) {
            let player = this.players[nickname];
            player.onReceiveGameRecord(type, action, targer, key, road);
        }
    }

    /**
     * 遊戲結束
     * @param {int} type
     * @memberof Game
     */
    onGameFinish(type) {
        console.log('['+this.room.roomName+'] Game Finish ::', type);
        this.isFinishGame = true;
        this.map['8_0'].isBack = false;
        this.map['8_2'].isBack = false;
        this.map['8_4'].isBack = false;
        this.onBroadcastGameInfo();
        this.onBroadcastGameResult(type);
        this.room.onGameFinish();
    }

    /**
     * 玩家離開遊戲
     * @param {Client} client
     * @memberof Game
     */
    onLeave(client) {
        let index = this.clients.indexOf(client);
        if (index !== -1) {
            this.clients.splice(index, 1);
            client.onLeaveGame(this.id);
            if (!this.isFinishGame) {
                let hasReallyClient = false;
                for (let client of this.clients) {
                    if (!client.isRobot) {
                        hasReallyClient = true;
                    }
                }

                if (hasReallyClient && this.clients.length >= Game.MIN_OF_GAME_PLAYER) {
                    let nickname = client.nickname;
                    let player = this.players[nickname];
                    //// 放置離開玩家的手牌
                    this.remainCards = this.remainCards.concat(player.cards);
                    this.onShuffle(this.remainCards);
                    //// 銷毀離開玩家資料
                    player.onDestroy();
                    delete this.players[nickname];
                    let leaveActionIndex = this.actionList.indexOf(nickname);
                    if (leaveActionIndex !== -1) {
                        this.actionList.splice(leaveActionIndex, 1);
                    }
                    //// 檢查是否為正在執行動作的玩家
                    let isJumpAction = leaveActionIndex === this.actionIndex;
                    if (isJumpAction) {
                        this.onNextAction(false);
                    } else {
                        this.onBroadcastGameInfo();
                    }
                } else {
                    this.isFinishGame = true;
                    this.onBroadcastGameResult(-1);
                    let remainClients = this.clients.concat();
                    for (let remainClient of remainClients) {
                        remainClient.onLeaveGame(this.id);
                        this.room.onReJoin(remainClient);
                    }

                    this.room.onDeleteGame();
                }
            } else {
                if (this.clients && this.clients.length === 0) {
                    this.room.onDeleteGame();
                }
            }
        }
    }

    /**
     * 加入觀看遊戲
     * @param {Client} client
     * @returns int
     * @memberof Game
     */
    onJoinWatchGame(client) {
        if (!this.id) {
            client.onJoinWatchGameError(-1);
            return;
        }

        if (this.watchClients.indexOf(client) !== -1) {
            client.onJoinWatchGameError(-2);
            return;
        }

        this.watchClients.push(client);
        let action = this.actionList[this.actionIndex];
        client.onJoinWatchGame(this.room.id, this.id, this.getGameInfo(client.nickname), action);
    }

    /**
     * 離開觀看遊戲
     * @param {Client} client
     * @memberof Game
     */
    onLeaveWatchGame(client) {
        let index = this.watchClients.indexOf(client);
        if (index !== -1) {
            this.watchClients.splice(index, 1);
            client.onLeaveWatchGame(this.id);
        }
    }

    /**
     * 撤銷遊戲
     * @memberof Game
     */
    onDestroy() {
        if (this.players) {
            for (let nickname in this.players) {
                let player = this.players[nickname];
                player.onDestroy();
            }
            this.players = null;
        }

        if (this.watchClients) {
            this.onBroadcastGameResult(-1);
            for (let watchClient of this.watchClients) {
                watchClient.onLeaveWatchGame(this.id);
            }

            this.watchClients = null;
        }

        this.server = null;
        this.room = null;
        this.id = null;
        this.clients = null;
        this.map = null;
        this.possibleRoads = null;
        this.actionList = null;
        this.actionIndex = null;
        this.remainCards = null;
        this.isFinishGame = null;
    }
    //#endregion

    //#region Game 輔助
    /**
     * 搜尋可放置的礦道
     * @param {string} key
     * @param {array} searchKeyList
     * @param {object} possibleRoads
     * @memberof Game
     */
    onSearchPossibleRoad(key, searchKeyList, possibleRoads) {
        let self = this;
        let col = parseInt(key.split('_')[0]);
        let row = parseInt(key.split('_')[1]);
        let road = this.map[key].getRoad();
        let checkFunc = function (checkKey, checkDirection) {
            let checkCard = self.map[checkKey];
            if (checkCard) {
                if (searchKeyList.indexOf(checkKey) === -1) {
                    searchKeyList.push(checkKey);
                    if (checkCard.cardType === 1) {
                        let checkRoad = checkCard.getRoad();
                        if (road[checkDirection] === 1 && checkRoad[3 - checkDirection] === 1) {
                            self.onSearchPossibleRoad(checkKey, searchKeyList.concat(), possibleRoads);
                        }
                    }
                }
            } else {
                possibleRoads[checkKey] = self.onSearchRoadMatchType(checkKey);
            }
        }

        //// check up
        if (road[0] === 1) {
            let upRow = row - 1;
            if (upRow >= 0) {
                let upkey = col + '_' + upRow;
                checkFunc(upkey, 0);
            }
        }
        //// check right
        if (road[1] === 1) {
            let rightCol = col + 1;
            if (rightCol < 9) {
                let rightkey = rightCol + '_' + row;
                checkFunc(rightkey, 1);
            }
        }
        //// check left
        if (road[2] === 1) {
            let leftCol = col - 1;
            if (leftCol >= 0) {
                let leftkey = leftCol + '_' + row;
                checkFunc(leftkey, 2);
            }
        }
        //// check down
        if (road[3] === 1) {
            let downRow = row + 1;
            if (downRow < 9) {
                let downkey = col + '_' + downRow;
                checkFunc(downkey, 3);
            }
        }
        // console.log('Over');

        return possibleRoads;
    }

    /**
     * 搜尋可放置礦道類型
     * @param {string} key
     * @returns object
     * @memberof Game
     */
    onSearchRoadMatchType(key) {
        let col = parseInt(key.split('_')[0]);
        let row = parseInt(key.split('_')[1]);
        let matchArr = {};
        let reverseMatchArr = {};
        let matchType = [-1, -1, -1, -1];
        //// check up
        if (row - 1 >= 0) {
            let upRoad = this.map[col + '_' + (row - 1)];
            if (upRoad && !upRoad.isBack) {
                let upWay = upRoad.getRoad();
                matchType[0] = upWay[3];
            }
        }
        //// check right
        if (col + 1 < 9) {
            let rightRoad = this.map[(col + 1) + '_' + row];
            if (rightRoad && !rightRoad.isBack) {
                let rightWay = rightRoad.getRoad();
                matchType[1] = rightWay[2];
            }
        }
        //// check left
        if (col - 1 >= 0) {
            let leftRoad = this.map[(col - 1) + '_' + row];
            if (leftRoad && !leftRoad.isBack) {
                let leftWay = leftRoad.getRoad();
                matchType[2] = leftWay[1];
            }
        }
        //// check down
        if (row + 1 < 9) {
            let downRoad = this.map[col + '_' + (row + 1)];
            if (downRoad && !downRoad.isBack) {
                let downWay = downRoad.getRoad();
                matchType[3] = downWay[0];
            }
        }
        //// search road
        let cardClass = require('./card/Card.js');
        let allRoadTypes = [
            cardClass.BADROAD_TYPE_11,
            cardClass.BADROAD_TYPE_12,
            cardClass.BADROAD_TYPE_21,
            cardClass.BADROAD_TYPE_22,
            cardClass.BADROAD_TYPE_23,
            cardClass.BADROAD_TYPE_24,
            cardClass.BADROAD_TYPE_31,
            cardClass.BADROAD_TYPE_32,
            cardClass.BADROAD_TYPE_41,
            cardClass.GOODROAD_TYPE_11,
            cardClass.GOODROAD_TYPE_12,
            cardClass.GOODROAD_TYPE_21,
            cardClass.GOODROAD_TYPE_22,
            cardClass.GOODROAD_TYPE_31,
            cardClass.GOODROAD_TYPE_32,
            cardClass.GOODROAD_TYPE_41
        ];

        let checkMatchRoad = function (checkRoad) {
            let road = checkRoad.getRoad();
            if (matchType[0] === -1 || matchType[0] === road[0]) {
                if (matchType[1] === -1 || matchType[1] === road[1]) {
                    if (matchType[2] === -1 || matchType[2] === road[2]) {
                        if (matchType[3] === -1 || matchType[3] === road[3]) {
                            return true;
                        }
                    }
                }
            }

            return false;
        }

        for (let allRoadType of allRoadTypes) {
            //// check normal
            let matchRoad = new cardClass(allRoadType);
            if (checkMatchRoad(matchRoad)) {
                matchArr[allRoadType] = matchRoad;
            }
            //// check reverse
            let reverseMatchRoad = new cardClass(allRoadType);
            reverseMatchRoad.setReverse(true);
            if (checkMatchRoad(reverseMatchRoad)) {
                reverseMatchArr[allRoadType] = reverseMatchRoad;
            }
        }

        return {
            cards: matchArr,
            reverseCards: reverseMatchArr
        };
    }

    /**
     * 檢查遊戲是否結束 (0:game running, 1:good man win, 2:bad man win)
     * @returns int
     * @memberof Game
     */
    onCheckGameFinish() {
        //// check map end road
        let cardClass = require('./card/Card.js');
        let isGethGold = false;
        if (this.map['8_0'].type === cardClass.ENDROAD_TYPE_1) {
            isGethGold = this.isMatchGoldRoad('8_0', ['8_0']);
        }

        if (this.map['8_2'].type === cardClass.ENDROAD_TYPE_1) {
            isGethGold = this.isMatchGoldRoad('8_2', ['8_2']);
        }

        if (this.map['8_4'].type === cardClass.ENDROAD_TYPE_1) {
            isGethGold = this.isMatchGoldRoad('8_4', ['8_4']);
        }

        if (isGethGold) {
            return 1;
        } else {
            //// check remain card
            if (this.remainCards.length > 0) {
                return 0;
            }
            //// check client card
            for (let nickname in this.players) {
                let player = this.players[nickname];
                if (player.cards.length > 0) {
                    return 0;
                }
            }

            return 2;
        }
    }

    /**
     * 檢查是否連接到金礦
     * @param {string} key
     * @param {array} keyList
     * @returns bool
     * @memberof Game
     */
    isMatchGoldRoad(key, keyList) {
        let self = this;
        let col = parseInt(key.split('_')[0]);
        let row = parseInt(key.split('_')[1]);
        let road = this.map[key].getRoad();
        //// check function
        let checkFunc = function (checkKey, checkDirection) {
            if (checkKey === '0_2') {
                return true;
            }

            if (keyList.indexOf(checkKey) === -1) {
                let checkCard = self.map[checkKey];
                if (checkCard) {
                    if (checkCard.cardType === 1) {
                        let checkRoad = checkCard.getRoad();
                        // console.log('=========================');
                        // console.log('checkKey', checkKey);
                        // console.log('checkDirection', checkDirection);
                        // console.log(road[checkDirection], checkRoad[3 - checkDirection]);
                        // console.log('=========================');
                        if (road[checkDirection] === 1 && checkRoad[3 - checkDirection] === 1) {
                            keyList.push(checkKey);
                            // console.log('next');
                            return self.isMatchGoldRoad(checkKey, keyList.concat());
                        }
                    }
                }
            }
            return false;
        }
        //// check up
        let upkey = col + '_' + (row - 1);
        if (checkFunc(upkey, 0)) {
            return true;
        }
        //// check right
        let rightkey = (col + 1) + '_' + row;
        if (checkFunc(rightkey, 1)) {
            return true;
        }
        //// check left
        let leftkey = (col - 1) + '_' + row;
        if (checkFunc(leftkey, 2)) {
            return true;
        }
        //// check down
        let downkey = col + '_' + (row + 1);
        if (checkFunc(downkey, 3)) {
            return true;
        }
        // console.log('Over');
        return false;
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
    //#endregion

    //#region 廣播事件
    /**
     * 廣播遊戲結果
     * @param {int} result 
     * @memberof Game
     */
    onBroadcastGameResult(result) {
        let goodManTeam = [];
        let badManTeam = [];
        for (let nickname in this.players) {
            let player = this.players[nickname];
            let identity = player.identity;
            switch (identity) {
                case 0:
                    badManTeam.push(nickname);
                    break;
                case 1:
                    goodManTeam.push(nickname);
                    break;
            }
        }

        this.server.to(this.id).emit('response', JSON.stringify(['finishGame', [result, {
            goodManTeam: goodManTeam,
            badManTeam: badManTeam
        }]]));
    }

    /**
     * 廣播遊戲資訊
     * @memberof Game
     */
    onBroadcastGameInfo() {
        for (let nickname in this.players) {
            let player = this.players[nickname];
            let gameInfo = this.getGameInfo(nickname);
            player.onUpdateGameInfo(gameInfo);
        }

        let watchGameInfo = this.getGameInfo('GetWatchGameIfo');
        for (let watchClient of this.watchClients) {
            watchClient.onUpdateGameInfo(watchGameInfo);
        }
    }

    /**
     * 廣播遊戲執行動作者
     * @memberof Game
     */
    onBroadcastActionPlayer() {
        let action = this.actionList[this.actionIndex];
        this.server.to(this.id).emit('response', JSON.stringify(['actionPlayer', [action, this.countdown]]));
    }

    /**
     * 廣播挖掘礦道
     * @param {string} key 
     * @memberof Game
     */
    onBroadcastDigRoad(key) {
        this.server.to(this.id).emit('response', JSON.stringify(['digCard', key]));
    }

    /**
     * 廣播礦道崩塌
     * @param {string} key 
     * @memberof Game
     */
    onBroadcastCollapseRoad(key) {
        this.server.to(this.id).emit('response', JSON.stringify(['collapseCard', key]));
    }

    /**
     * 廣播遊戲聊天訊息
     * @param {string} sender
     * @param {string} message
     * @memberof Game
     */
    onBroadcastGameChat(sender, message) {
        this.server.to(this.id).emit('response', JSON.stringify(['gameChat', [sender, message]]));
    }
    //#endregion

    //#region Set & Get
    /**
     * 取得遊戲資訊
     * @param {string}} inquirer
     * @returns object
     * @memberof Game
     */
    getGameInfo(inquirer) {
        if (this.players) {
            //// get map data and can collapse road data and can watch road data
            let mapData = Object.assign({}, this.map);
            let canCollapseRoadDatas = [];
            let canWatchRoadDatas = [];
            let checkEndRoad = function (key) {
                let endRoad = mapData[key];
                if (endRoad.isBack) {
                    let cardClass = require('./card/Card.js');
                    canWatchRoadDatas.push(key);
                    mapData[key] = new cardClass(cardClass.ENDROAD_BACK_TYPE);
                }

                return endRoad;
            }

            checkEndRoad('8_0');
            checkEndRoad('8_2');
            checkEndRoad('8_4');

            for (let key in mapData) {
                if (key !== '0_2') {
                    if (key !== '8_0') {
                        if (key !== '8_2') {
                            if (key !== '8_4') {
                                canCollapseRoadDatas.push(key);
                            }
                        }
                    }
                }
            }
            //// get no fo remain card
            let noOfRemainCardData = this.remainCards.length;
            //// get possible road data
            let possibleRoadData = Object.assign({}, this.possibleRoads);
            //// get player data
            let index = this.actionList.indexOf(inquirer);
            let cloneActionList = this.actionList.slice(index).concat(this.actionList.slice(0, index));
            let playerDatas = [];
            for (let i = 0; i < cloneActionList.length; i++) {
                let nickname = cloneActionList[i];
                let player = this.players[nickname];
                playerDatas.push({
                    nickname: player.nickname,
                    locks: player.locks.concat()
                });
            }

            return {
                map: mapData,
                noOfRemainCard: noOfRemainCardData,
                possibleRoads: possibleRoadData,
                canCollapseRoads: canCollapseRoadDatas,
                canWatchRoads: canWatchRoadDatas,
                players: playerDatas
            }
        } else {
            return {};
        }
    }

    /**
     * 最低遊戲人數
     * @readonly
     * @static
     * @returns int
     * @memberof Game
     */
    static get MIN_OF_GAME_PLAYER() {
        return 3;
    }
    //#endregion
}

module.exports = Game;