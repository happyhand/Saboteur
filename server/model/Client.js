class Client {
    constructor(socket) {
        //// info data
        this.lobby = require('../model/Lobby.js').getInstance();
        this.nickname = '';
        this.roomID = '';
        this.isReadyGame = false;
        console.log('Clinet【', socket.id, '】connected | No of sockets :', socket.server.eio.clientsCount);

        //// socket
        this.socket = socket;
        this.addEvent('request', this.onRequest);
        this.addEvent('disconnect', this.onDisconnect);
        this.socket.emit('connected');
    }

    //#region Socket Action

    /**
     * 新增 socket 事件監聽
     * @param {string} event
     * @param {function} func 
     * @memberof Client
     */
    addEvent(event, func) {
        let self = this;
        this.socket.on(event, function (data) {
            func(self, data);
        });
    }

    /**
     * 客端請求事件
     * @param {Client} client 
     * @param {jsonString} dataJSON 
     * @memberof Client
     */
    onRequest(client, dataJSON) {
        let data = JSON.parse(dataJSON);
        let type = data[0];
        switch (type) {
            case 'login':
                let nickname = data[1];
                client.doLogin(nickname);
                break;
            case 'createRoom':
                let roomName = data[1][0];
                let countdownTime = data[1][1];
                client.doCreateRoom(roomName, countdownTime);
                break;
            case 'joinRoom':
                let roomID = data[1];
                client.doJoinRoom(roomID, false);
                break;
            case 'leaveRoom':
                client.doLeaveRoom();
                break;
            case 'kick':
                let kickName = data[1];
                client.doKick(kickName);
                break;
            case 'roomChat':
                let roomMessage = data[1];
                client.doRoomChat(roomMessage);
                break;
            case 'updateReadyGame':
                let isReady = data[1] === 1;
                client.doUpdateReadyGame(isReady);
                break;
            case 'addRobot':
                client.doAddRobot();
                break;
            case 'createGame':
                client.doCreateGame();
                break;
            case 'digCard':
                let digKey = data[1][0];
                let digType = data[1][1];
                let isReverse = data[1][2] === 1;
                let digCardNo = data[1][3];
                client.doDigCard(digKey, digType, isReverse, digCardNo);
                break;
            case 'fixCard':
                let fixNickname = data[1][0];
                let fixType = data[1][1];
                let fixCardNo = data[1][2];
                client.doFixCard(fixNickname, fixType, fixCardNo);
                break;
            case 'atkCard':
                let atkNickname = data[1][0];
                let atkType = data[1][1];
                let atkCardNo = data[1][2];
                client.doAtkCard(atkNickname, atkType, atkCardNo);
                break;
            case 'CollapseCard':
                let collapseKey = data[1][0];
                let collapseCardNo = data[1][1];
                client.doCollapseCard(collapseKey, collapseCardNo);
                break;
            case 'watchCard':
                let watchKey = data[1][0];
                let watchCardNo = data[1][1];
                client.doWatchCard(watchKey, watchCardNo);
                break;
            case 'giveUpCard':
                let giveUpCardNo = data[1];
                client.doGiveUpCard(giveUpCardNo);
                break;
            case 'reGame':
                client.doReGame();
                break;
            case 'leaveGame':
                client.doLeaveGame();
                break;
            case 'gameChat':
                let gameMessage = data[1];
                client.doGameChat(gameMessage);
                break;
        }
    }
    //#endregion

    //#region 客端請求
    /**
     * 請求 Login
     * @param {string} nickname 
     * @memberof Client
     */
    doLogin(nickname) {
        this.lobby.onLogin(this, nickname);
    }

    /**
     * 請求創建房間
     * @param {string} roomName 
     * @param {string} countdownTime 
     * @memberof Client
     */
    doCreateRoom(roomName, countdownTime) {
        this.lobby.onCreateRoom(this, roomName, countdownTime, this.nickname);
    }

    /**
     * 請求加入 Lobby
     * @memberof Client
     */
    doJoinLobby() {
        this.lobby.onJoinLobby(this);
    }

    /**
     * 請求加入房間
     * @param {string} roomID
     * @memberof Client
     */
    doJoinRoom(roomID) {
        let room = this.lobby.getRoom(roomID);
        if (!room) return;
        room.onJoin(this);
    }

    /**
     * 請求離開房間
     * @memberof Client
     */
    doLeaveRoom() {
        let room = this.lobby.getRoom(this.roomID);
        if (!room) return;
        room.onLeave(this, false);
    }

    /**
     * 請求踢除玩家
     * @param {string} kickName
     * @memberof Client
     */
    doKick(kickName) {
        let room = this.lobby.getRoom(this.roomID);
        if (!room) return;
        room.onKickClient(kickName);
    }

    /**
     * 請求房間聊天
     * @param {string}} message
     * @memberof Client
     */
    doRoomChat(message) {
        let room = this.lobby.getRoom(this.roomID);
        if (!room) return;
        room.onBroadcastRoomChat(this.nickname, message);
    }

    /**
     * 請求更新 isReadyGame
     * @param {bool} isReady
     * @memberof Client
     */
    doUpdateReadyGame(isReady) {
        this.isReadyGame = isReady
        let room = this.lobby.getRoom(this.roomID);
        if (!room) return;
        room.onBroadcastCurrentRoomInfo();
    }

    /**
     * 請求加入 Robot
     * @memberof Client
     */
    doAddRobot() {
        let robotClass = require('../model/Robot.js');
        let robot = new robotClass(this.socket);
        robot.doJoinRoom(this.roomID);
    }

    /**
     * 請求創建遊戲
     * @memberof Client
     */
    doCreateGame() {
        let room = this.lobby.getRoom(this.roomID);
        if (!room) return;
        room.onCreateGame(this);
    }

    /**
     * 請求放置礦道牌
     * @param {string} digKey
     * @param {string} digType
     * @param {bool} isReverse
     * @param {bool} cardNo
     * @memberof Client
     */
    doDigCard(digKey, digType, isReverse, cardNo) {
        let room = this.lobby.getRoom(this.roomID);
        if (!room) return;
        let game = room.getGame();
        if (!game) return;
        game.onDigCard(this.nickname, digKey, digType, isReverse, cardNo);
    }

    /**
     * 請求放置修復牌
     * @param {string} targetNickname
     * @param {string} fixType
     * @param {bool} cardNo
     * @memberof Client
     */
    doFixCard(targetNickname, fixType, cardNo) {
        let room = this.lobby.getRoom(this.roomID);
        if (!room) return;
        let game = room.getGame();
        if (!game) return;
        game.onFixCard(this.nickname, targetNickname, fixType, cardNo);
    }

    /**
     * 請求放置破壞牌
     * @param {string} targetNickname
     * @param {string} atkType
     * @param {bool} cardNo
     * @memberof Client
     */
    doAtkCard(targetNickname, atkType, cardNo) {
        let room = this.lobby.getRoom(this.roomID);
        if (!room) return;
        let game = room.getGame();
        if (!game) return;
        game.onAtkCard(this.nickname, targetNickname, atkType, cardNo);
    }

    /**
     * 請求放置崩塌牌
     * @param {string} collapseKey
     * @param {bool} cardNo
     * @memberof Client
     */
    doCollapseCard(collapseKey, cardNo) {
        let room = this.lobby.getRoom(this.roomID);
        if (!room) return;
        let game = room.getGame();
        if (!game) return;
        game.onCollapseCard(this.nickname, collapseKey, cardNo);
    }

    /**
     * 請求放置觀看牌
     * @param {string} watchKey
     * @param {bool} cardNo
     * @memberof Client
     */
    doWatchCard(watchKey, cardNo) {
        let room = this.lobby.getRoom(this.roomID);
        if (!room) return;
        let game = room.getGame();
        if (!game) return;
        game.onWatchCard(this.nickname, watchKey, cardNo);
    }

    /**
     * 請求棄牌
     * @param {int} cardNo
     * @memberof Client
     */
    doGiveUpCard(cardNo) {
        let room = this.lobby.getRoom(this.roomID);
        if (!room) return;
        let game = room.getGame();
        if (!game) return;
        game.onGiveUpCard(this.nickname, cardNo);
    }

    /**
     * 請求重新加入房間遊戲
     * @memberof Client
     */
    doReGame() {
        let room = this.lobby.getRoom(this.roomID);
        if (!room) return;
        let game = room.getGame();
        if (!game) return;
        game.onLeave(this);
        room.onReJoin(this);
    }

    /**
     * 請求離開遊戲
     * @memberof Client
     */
    doLeaveGame() {
        let room = this.lobby.getRoom(this.roomID);
        if (!room) return;
        let game = room.getGame();
        if (!game) return;
        game.onLeave(this, false);
        this.doLeaveRoom();
    }

    /**
     * 請求遊戲聊天
     * @param {string}} message
     * @memberof Client
     */
    doGameChat(message) {
        let room = this.lobby.getRoom(this.roomID);
        if (!room) return;
        let game = room.getGame();
        if (!game) return;
        game.onBroadcastGameChat(this.nickname, message);
    }

    /**
     * 請求 Logout
     * @memberof Client
     */
    doLogout() {
        this.lobby.onLogout(this.nickname);
    }
    //#endregion

    //#region 呼叫客端動作
    /**
     * 客端 Login
     * @param {string} nickname
     * @memberof Client
     */
    onLogin(nickname) {
        this.nickname = nickname;
        this.onSendResponse('login', [1, nickname]);
        console.log('Clinet【', this.socket.id, '】login | No of login :', this.lobby.logins.length);

        this.doJoinLobby();
    }

    /**
     * 客端 Login Error
     * @param {int} result
     * @memberof Client
     */
    onLoginError(result) {
        this.onSendResponse('login', [result, '']);
    }

    /**
     * 客端加入 Lobby
     * @param {array} roomList
     * @memberof Client
     */
    onJoinLobby(roomList) {
        this.socket.join('lobby');
        this.onSendResponse('joinLobby');
        this.onSendResponse('updateRoomList', roomList);
    }

    /**
     * 客端創建房間
     * @param {string} roomID
     * @memberof Client
     */
    onCreateRoom(roomID) {
        this.roomID = roomID;
        this.onSendResponse('createRoom', 1);
        this.doJoinRoom(roomID, true);
        this.doUpdateReadyGame(true);
    }

    /**
     * 客端創建房間 Error
     * @param {int} result
     * @memberof Client
     */
    onCreateRoomError(result) {
        this.onSendResponse('createRoom', result);
    }

    /**
     * 客端加入房間
     * @param {string} roomID
     * @memberof Client
     */
    onJoinRoom(roomID) {
        this.socket.leave('lobby');
        this.socket.join(roomID);
        this.roomID = roomID;
        this.isReadyGame = false;
        this.onSendResponse('joinRoom', 1);
        this.lobby.onBroadcastCurrentRoomList();
    }

    /**
     * 客端重新加入房間
     * @param {string} roomName
     * @memberof Client
     */
    onReJoinRoom(masterName) {
        this.isReadyGame = this.nickname === masterName;
        this.onSendResponse('joinRoom', 1);
    }

    /**
     * 客端加入房間 Error
     * @param {int} result
     * @memberof Client
     */
    onJoinRoomError(result) {
        this.onSendResponse('joinRoom', [result, '']);
    }

    /**
     * 客端離開房間
     * @param {bool} isKick
     * @memberof Client
     */
    onLeaveRoom(isKick) {
        this.socket.leave(this.roomID);
        this.roomID = '';
        this.onSendResponse('leaveRoom', isKick ? 2 : 1);
        this.lobby.onBroadcastCurrentRoomList();
        this.doJoinLobby();
    }

    /**
     * 客端創建遊戲 Error
     * @param {int} result
     * @memberof Client
     */
    onCreateGameError(result) {
        this.onSendResponse('createGame', result);
    }

    /**
     * 客端加入遊戲
     * @param {string} gameID
     * @param {object} data
     * @memberof Client
     */
    onJoinGame(gameID, data) {
        this.socket.join(gameID);
        this.onSendResponse('joinGame', data);
    }

    /**
     * 客端更新遊戲資訊
     * @param {object} gameInfo
     * @memberof Client
     */
    onUpdateGameInfo(gameInfo) {
        this.onSendResponse('updateGameInfo', gameInfo);
    }

    /**
     * 客端更新遊戲動作時間
     * @param {int} time
     * @memberof Client
     */
    onUpdateCountdown(time) {
        this.onSendResponse('updateCountdown', time);
    }

    /**
     * 客端丟牌
     * @param {int} no
     * @memberof Client
     */
    onPutCard(no) {
        this.onSendResponse('putCard', no);
    }

    /**
     * 客端補牌
     * @param {Card} card
     * @memberof Client
     */
    onTakeCard(card) {
        this.onSendResponse('takeCard', card);
    }

    /**
     * 客端查看牌
     * @param {string} key
     * @param {Card} card
     * @memberof Client
     */
    onWatchCard(key, card) {
        this.onSendResponse('watchCard', [key, card]);
    }

    /**
     * 客端指定動作
     * @param {int} type
     * @memberof Client
     */
    onAppointAction(type) {
        this.onSendResponse('appointAction', type);
    }


    /**
     * 客端離開遊戲
     * @param {string} gameID
     * @memberof Client
     */
    onLeaveGame(gameID) {
        this.socket.leave(gameID);
    }

    /**
     * 客端斷線
     * @param {Client} client
     * @memberof Client
     */
    onDisconnect(client) {
        if (client.roomID) {
            let room = client.lobby.getRoom(client.roomID);
            if (room) {
                let game = room.getGame();
                if (game) {
                    client.doLeaveGame();
                } else {
                    client.doLeaveRoom();
                }
            }
        }

        client.doLogout();
        console.log('Clinet【', client.socket.id, '】logut | No of login :', client.lobby.logins.length);
        console.log('Clinet【', client.socket.id, '】disconnected');
    }

    /**
     * 強制客端斷線
     * @memberof Client
     */
    onForceDisconnect() {
        this.socket.emit('response', ['forceDisconnected', '']);
        this.socket.disconnect(true);
    }

    /**
     * 回覆客端
     * @param {string} event
     * @param {object} data
     * @memberof Client
     */
    onSendResponse(event, data) {
        this.socket.emit('response', JSON.stringify([event, data]));
    }
    //#endregion
}

module.exports = Client;