class Robot {
    constructor(socket) {
        //// info data
        this.lobby = require('../model/Lobby.js').getInstance();
        this.nickname = '';
        this.roomID = '';
        this.isReadyGame = false;
        this.isRobot = true;
        //// socket
        this.socket = socket;
    }

    //#region Do Reqest
    /**
     * 請求加入房間
     * @param {string} roomID
     * @memberof Client
     */
    doJoinRoom(roomID) {
        let service = require('./core/Service.js');
        this.nickname = 'Robot-' + service.getRandomID().substring(12, 15);
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

    //#endregion

    //#region Action
    /**
     * Robot 加入房間
     * @param {string} roomID
     * @memberof Client
     */
    onJoinRoom(roomID) {
        this.roomID = roomID;
        this.isReadyGame = true;
        this.onSendResponse('addRobot', 1);
        this.lobby.onBroadcastCurrentRoomList();
    }

    /**
     * Robot 重新加入房間
     * @memberof Client
     */
    onReJoinRoom() {
        this.isReadyGame = true;
    }

    /**
     * Robot 加入房間 Error
     * @memberof Client
     */
    onJoinRoomError() {
        this.onSendResponse('addRobot', -1);
    }

    /**
     * Robot 離開房間
     * @memberof Client
     */
    onLeaveRoom() {
        this.lobby.onBroadcastCurrentRoomList();
        this.onDestory();
    }

    /**
     * Robot 離開遊戲
     * @memberof Client
     */
    onLeaveGame() {
        //// not work
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

    /**
     * 銷毀 Robot
     * @memberof Robot
     */
    onDestory() {
        this.lobby = null;
        this.nickname = null;
        this.roomID = null;
        this.gameID = null;
        this.isReadyGame = null;
        this.isRobot = null;
        this.socket = null;
    }
    //#endregion
}

module.exports = Robot;