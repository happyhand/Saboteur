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
     * @memberof Robot
     */
    doJoinRoom(roomID) {
        try {
            let service = require('./core/Service.js');
            this.nickname = 'Robot-' + service.getRandomID().substring(12, 15);
            let room = this.lobby.getRoom(roomID);
            if (!room) return;
            room.onJoin(this);
        } catch (error) {
            this.onServerError(901, error);
        }
    }

    /**
     * 請求離開房間
     * @memberof Robot
     */
    doLeaveRoom() {
        try {
            let room = this.lobby.getRoom(this.roomID);
            if (!room) return;
            room.onLeave(this, false);
        } catch (error) {
            this.onServerError(902, error);
        }
    }

    /**
     * 請求放置礦道牌
     * @param {string} digKey
     * @param {string} digType
     * @param {bool} isReverse
     * @param {bool} cardNo
     * @memberof Robot
     */
    doDigCard(digKey, digType, isReverse, cardNo) {
        try {
            let room = this.lobby.getRoom(this.roomID);
            if (!room) return;
            let game = room.getGame();
            if (!game) return;
            game.onDigCard(this.nickname, digKey, digType, isReverse, cardNo);
        } catch (error) {
            this.onServerError(903, error);
        }
    }

    /**
     * 請求放置修復牌
     * @param {string} targetNickname
     * @param {string} fixType
     * @param {bool} cardNo
     * @memberof Robot
     */
    doFixCard(targetNickname, fixType, cardNo) {
        try {
            let room = this.lobby.getRoom(this.roomID);
            if (!room) return;
            let game = room.getGame();
            if (!game) return;
            game.onFixCard(this.nickname, targetNickname, fixType, cardNo);
        } catch (error) {
            this.onServerError(904, error);
        }
    }

    /**
     * 請求放置破壞牌
     * @param {string} targetNickname
     * @param {string} atkType
     * @param {bool} cardNo
     * @memberof Robot
     */
    doAtkCard(targetNickname, atkType, cardNo) {
        try {
            let room = this.lobby.getRoom(this.roomID);
            if (!room) return;
            let game = room.getGame();
            if (!game) return;
            game.onAtkCard(this.nickname, targetNickname, atkType, cardNo);
        } catch (error) {
            this.onServerError(905, error);
        }
    }

    /**
     * 請求放置崩塌牌
     * @param {string} collapseKey
     * @param {bool} cardNo
     * @memberof Robot
     */
    doCollapseCard(collapseKey, cardNo) {
        try {
            let room = this.lobby.getRoom(this.roomID);
            if (!room) return;
            let game = room.getGame();
            if (!game) return;
            game.onCollapseCard(this.nickname, collapseKey, cardNo);
        } catch (error) {
            this.onServerError(906, error);
        }
    }

    /**
     * 請求放置觀看牌
     * @param {string} watchKey
     * @param {bool} cardNo
     * @memberof Robot
     */
    doWatchCard(watchKey, cardNo) {
        try {
            let room = this.lobby.getRoom(this.roomID);
            if (!room) return;
            let game = room.getGame();
            if (!game) return;
            game.onWatchCard(this.nickname, watchKey, cardNo);
        } catch (error) {
            this.onServerError(907, error);
        }
    }

    /**
     * 請求棄牌
     * @param {int} cardNo
     * @memberof Robot
     */
    doGiveUpCard(cardNo) {
        try {
            let room = this.lobby.getRoom(this.roomID);
            if (!room) return;
            let game = room.getGame();
            if (!game) return;
            game.onGiveUpCard(this.nickname, cardNo);
        } catch (error) {
            this.onServerError(908, error);
        }
    }

    /**
     * 請求重新加入房間遊戲
     * @memberof Robot
     */
    doReGame() {
        try {
            let room = this.lobby.getRoom(this.roomID);
            if (!room) return;
            let game = room.getGame();
            if (!game) return;
            game.onLeave(this);
            room.onReJoin(this);
        } catch (error) {
            this.onServerError(909, error);
        }
    }

    //#endregion

    //#region Action
    /**
     * Robot 加入房間
     * @param {string} roomID
     * @memberof Robot
     */
    onJoinRoom(roomID) {
        try {
            this.roomID = roomID;
            this.isReadyGame = true;
            this.onSendResponse('addRobot', 1);
            this.lobby.onBroadcastCurrentRoomList();
        } catch (error) {
            this.onServerError(910, error);
        }
    }

    /**
     * Robot 重新加入房間
     * @memberof Robot
     */
    onReJoinRoom() {
        this.isReadyGame = true;
    }

    /**
     * Robot 加入房間 Error
     * @memberof Robot
     */
    onJoinRoomError() {
        this.onSendResponse('addRobot', -1);
    }

    /**
     * Robot 離開房間
     * @memberof Robot
     */
    onLeaveRoom() {
        this.lobby.onBroadcastCurrentRoomList();
        this.onDestory();
    }

    /**
     * Robot 離開遊戲
     * @memberof Robot
     */
    onLeaveGame() {
        //// not work
    }

    /**
     * 回覆客端
     * @param {string} event
     * @param {object} data
     * @memberof Robot
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

    /**
     * 伺服器發生錯誤
     * @memberof Room
     */
    onServerError(code, error) {
        console.log('\n====================== Server Error =========================');
        console.log('Error Code ::', code);
        console.log('Error Message ::', error.message);
        console.log('Error Line ::', error.stack.split('\n')[1].trim());
    }
    //#endregion
}

module.exports = Robot;