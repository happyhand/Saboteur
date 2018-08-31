const MAX_OF_CLIENT = 7;
const MAX_OF_COUNTDOWN = 5;
class Room {
    constructor(server, lobby, id, roomName, countdown, masterName) {
        this.server = server;
        this.lobby = lobby;
        this.id = id;
        this.roomName = roomName;
        this.countdown = countdown;
        this.masterName = masterName;
        this.clients = [];
        this.game = null;
    }

    //#region Room 動作
    /**
     * 加入房間
     * @param {Client} client
     * @memberof Room
     */
    onJoin(client) {
        if (this.clients.length >= MAX_OF_CLIENT) {
            client.onJoinRoomError(-3, this.id);
            return;
        }

        if (this.clients.indexOf(client) !== -1) {
            client.onJoinRoomError(-4, this.id);
            return;
        }

        if (this.hasRepeatNickname(client.nickname)) {
            client.onJoinRoomError(-4, this.id);
            return;
        }

        if (this.game && !this.game.isFinishGame) {
            client.onJoinRoomError(-5, this.id);
            return;
        }

        this.clients.push(client);
        client.onJoinRoom(this.id);
        this.onBroadcastCurrentRoomInfo();
    }

    /**
     * 重新加入房間
     * @param {Client} client
     * @memberof Room
     */
    onReJoin(client) {
        if (this.clients.indexOf(client) === -1) {
            client.onJoinRoomError(-6, this.id);
            client.doLeaveRoom();
            return;
        }

        client.onReJoinRoom(this.masterName);
        this.onBroadcastCurrentRoomInfo();
    }

    /**
     * 踢除玩家
     * @param {string}} nickname
     * @memberof Room
     */
    onKickClient(nickname) {
        for (let client of this.clients) {
            if (client.nickname === nickname) {
                if (this.game) {
                    this.game.onLeave(client);
                }

                this.onLeave(client, true);
                break;
            }
        }
    }

    /**
     * 離開房間
     * @param {Client} client
     * @param {bool} isKick
     * @memberof Room
     */
    onLeave(client, isKick) {
        let index = this.clients.indexOf(client);
        if (index !== -1) {
            this.clients.splice(index, 1);
            client.onLeaveRoom(isKick);
            let isMasterLeave = client.nickname === this.masterName;
            if (isMasterLeave) {
                this.masterName = null;
                for (let existClient of this.clients) {
                    if (!existClient.isRobot) {
                        existClient.isReadyGame = true;
                        this.masterName = existClient.nickname;
                        break;
                    }
                }
            }

            if (this.masterName) {
                this.onBroadcastCurrentRoomInfo();
            } else {
                this.onDestroy();
            }
        }
    }

    /**
     * 創建遊戲
     * @memberof Room
     */
    onCreateGame(client) {
        let isGameReady = this.isGameReady();
        if (isGameReady) {
            let service = require('../core/Service.js');
            let gameClass = require('../game/Game.js');
            let gameID = service.getRandomID();
            this.game = new gameClass(this.server, this, gameID, this.countdown);
            this.game.onInitGame(this.clients.concat());
            this.onBroadcastCreateGame();
            this.lobby.onBroadcastCurrentRoomList();
            setTimeout(this.onPrepareGame, 1000, this, MAX_OF_COUNTDOWN);
        } else {
            client.onCreateGameError(-1);
        }
    }

    /**
     * 準備遊戲
     * @param {Room} room
     * @param {int} index
     * @memberof Room
     */
    onPrepareGame(room, index) {
        if (room.game) {
            if (room.clients) {
                if (index === 0) {
                    room.game.onStartGame();
                } else {
                    room.onBroadcastRoomChat(null, 'The game starts after ' + index + ' seconds.');
                    setTimeout(room.onPrepareGame, 1000, room, --index);
                }
            }
        } else {
            if (room.clients) {
                room.onBroadcastRoomChat(null, 'The game has been closed.');
            }
        }
    }

    /**
     * 遊戲結束
     * @memberof Room
     */
    onGameFinish() {
        for (let client of this.clients) {
            if(!client.isRobot)
            {
                client.isReadyGame = false;
            }
            else
            {
                client.doReGame();
            }
        }

        this.onBroadcastCurrentRoomInfo();
        this.lobby.onBroadcastCurrentRoomList();
    }

    /**
     * 撤銷遊戲
     * @param {string}} roomID 
     * @memberof Lobby
     */
    onDeleteGame() {
        //// destroy game
        this.game.onDestroy();
        this.game = null;
    }

    /**
     * 撤銷房間
     * @memberof Room
     */
    onDestroy() {
        this.lobby.onDeleteRoom(this.id);
        if (this.clients) {
            for (let client of this.clients) {
                if (client.isRobot) {
                    client.onDestory();
                }
            }

            this.clients = null;
        }

        this.server = null;
        this.lobby = null;
        this.id = null;
        this.roomName = null;
        this.masterName = null;
        this.game = null;
    }
    //#endregion

    //#region 廣播事件
    /**
     * 廣播目前房間資訊
     * @memberof Room
     */
    onBroadcastCurrentRoomInfo() {
        let roomInfo = this.getRoomInfo();
        this.server.to(this.id).emit('response', JSON.stringify(['updateRoomInfo', roomInfo]));
    }

    /**
     * 廣播房間聊天訊息
     * @param {string} sender
     * @param {string} message
     * @memberof Room
     */
    onBroadcastRoomChat(sender, message) {
        this.server.to(this.id).emit('response', JSON.stringify(['roomChat', [sender, message]]));
    }

    /**
     * 廣播遊戲創建
     * @memberof Room
     */
    onBroadcastCreateGame() {
        this.server.to(this.id).emit('response', JSON.stringify(['createGame', 1]));
    }
    //#endregion

    //#region Set & Get
    /**
     * 取得房間資訊
     * @returns object
     * @memberof Room
     */
    getRoomInfo() {
        if (this.clients) {
            let clientInfos = [];
            for (let client of this.clients) {
                let isMaster = client.nickname === this.masterName;
                let data = {
                    nickname: client.nickname,
                    isMaster: isMaster,
                    isReadyGame: client.isReadyGame
                };
                if (isMaster) {
                    clientInfos.unshift(data);
                } else {
                    clientInfos.push(data);
                }
            }

            return {
                id: this.id,
                name: this.roomName,
                countdown: this.countdown,
                master: this.masterName,
                isGameRunning: this.game !== undefined && this.game !== null && !this.game.isFinishGame ? 1 : 0,
                isGameReady: this.isGameReady(),
                clients: clientInfos,
            };
        } else {
            return {};
        }
    }

    /**
     * 取得遊戲
     * @returns Game
     * @memberof Room
     */
    getGame() {
        return this.game;
    }

    /**
     * 玩家是否已準備遊戲
     * @returns bool
     * @memberof Room
     */
    isGameReady() {
        let noOfGameReady = 0;
        for (let client of this.clients) {
            if (client.isReadyGame) {
                noOfGameReady += 1;
            }
        }

        let gameClass = require('../game/Game.js');
        return noOfGameReady === this.clients.length && noOfGameReady >= gameClass.MIN_OF_GAME_PLAYER;
    }

    /**
     * 查看是否有重複的名字
     * @memberof Room
     */
    hasRepeatNickname(nickname) {
        for (let client of this.clients) {
            if (client.nickname === nickname) {
                return true;
            }
        }

        return false;
    }
    //#endregion
}

module.exports = Room;