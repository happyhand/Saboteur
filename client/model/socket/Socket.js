const SOCKET_INSTANCE = Symbol('instance');
class Socket {
    constructor() {
        let Class = new.target; // or this.constructor
        if (!Class[SOCKET_INSTANCE]) {
            Class[SOCKET_INSTANCE] = this;
            this.socket = null;
        }
        return Class[SOCKET_INSTANCE];
    }

    /**
     * 請求 Login
     * @param {string}} data
     * @memberof Socket
     */
    requestLogin(data) {
        if (this.socket === null || this.socket.disconnected) {
            let self = this;
            this.socket = io.connect('//10.9.64.191:6699'); // 連線至伺服器
            // this.socket = io.connect('//104.199.160.50:9453'); // 連線至伺服器
            this.socket.on('connected', function () {
                self.onSendRequest('login', data);
            });
            this.socket.on('response', this.onResponse);
        } else {
            this.onSendRequest('login', data);
        }
    }

    /**
     * 請求創建房間
     * @param {string} data
     * @memberof Socket
     */
    requestCreateRoom(data) {
        this.onSendRequest('createRoom', data);
    }

    /**
     * 請求加入房間
     * @param {string} data
     * @memberof Socket
     */
    requestJoinRoom(data) {
        this.onSendRequest('joinRoom', data);
    }

    /**
     * 請求離開房間
     * @memberof Socket
     */
    requestLeaveRoom() {
        this.onSendRequest('leaveRoom');
    }

    /**
     * 請求踢除玩家
     * @param {string} data
     * @memberof Socket
     */
    requestKick(data) {
        this.onSendRequest('kick', data);
    }

    /**
     * 請求房間聊天
     * @param {string} data
     * @memberof Socket
     */
    requestRoomChat(data) {
        this.onSendRequest('roomChat', data);
    }

    /**
     * 請求更新準備遊戲
     * @param {int} data
     * @memberof Socket
     */
    requestUpdateReadyGame(data) {
        this.onSendRequest('updateReadyGame', data);
    }


    /**
     * 請求加入 Robot
     * @memberof Socket
     */
    requestAddRobot() {
        this.onSendRequest('addRobot');
    }

    /**
     * 請求創建遊戲
     * @memberof Socket
     */
    requestCreateGame() {
        this.onSendRequest('createGame');
    }

    /**
     * 請求挖掘礦道
     * @param {array} data
     * @memberof Socket
     */
    requestDigCard(data) {
        this.onSendRequest('digCard', data);
    }

    /**
     * 請求修復
     * @param {array} data
     * @memberof Socket
     */
    requestFixCard(data) {
        this.onSendRequest('fixCard', data);
    }

    /**
     * 請求破壞
     * @param {array} data
     * @memberof Socket
     */
    requestAtkCard(data) {
        this.onSendRequest('atkCard', data);
    }

    /**
     * 請求崩塌礦道
     * @param {array} data
     * @memberof Socket
     */
    requestCollapseCard(data) {
        this.onSendRequest('CollapseCard', data);
    }

    /**
     * 請求查看金礦所在地
     * @param {array} data
     * @memberof Socket
     */
    requestWatchCard(data) {
        this.onSendRequest('watchCard', data);
    }

    /**
     * 請求棄牌
     * @param {string} data
     * @memberof Socket
     */
    requestGiveUpCard(data) {
        this.onSendRequest('giveUpCard', data);
    }

    /**
     * 請求重新遊戲
     * @memberof Socket
     */
    requestReGame() {
        this.onSendRequest('reGame');
    }

    /**
     * 請求離開遊戲
     * @memberof Socket
     */
    requestLeaveGame() {
        this.onSendRequest('leaveGame');
    }

    /**
     * 請求遊戲聊天
     * @param {string} data
     * @memberof Socket
     */
    requestGameChat(data) {
        this.onSendRequest('gameChat', data);
    }

    /**
     * 請求加入觀看遊戲
     * @memberof Socket
     */
    requestJoinWatchGame(data) {
        this.onSendRequest('joinWatchGame', data);
    }

    /**
     * 請求離開觀看遊戲
     * @memberof Socket
     */
    requestLeaveWatchGame(data) {
        this.onSendRequest('leaveWatchGame', data);
    }

    /**
     * Server 回覆 \ 通知
     * @param {jsonString} dataJSON
     * @memberof Socket
     */
    onResponse(dataJSON) {
        let data = JSON.parse(dataJSON);
        console.log('onResponse :: ', data.concat());
        let type = data[0];
        switch (type) {
            case 'login':
                new LoginAction().response(data[1]);
                break;
            case 'joinLobby':
                new JoinLobbyAction().response();
                break;
            case 'updateRoomList':
                new UpdateRoomListAction().response(data[1]);
                break;
            case 'createRoom':
                new CreateRoomAction().response(data[1]);
                break;
            case 'joinRoom':
                new JoinRoomAction().response(data[1]);
                break;
            case 'leaveRoom':
                new LeaveRoomAction().response(data[1]);
                break;
            case 'updateRoomInfo':
                new UpdateRoomInfoAction().response(data[1]);
                break;
            case 'roomChat':
                new RoomChatAction().response(data[1]);
                break;
            case 'addRobot':
                new AddRobotAction().response(data[1]);
                break;
            case 'createGame':
                new CreateGameAction().response(data[1]);
                break;
            case 'joinGame':
                new JoinGameAction().response(data[1]);
                break;
            case 'joinWatchGame':
                new JoinWatchGameAction().response(data[1]);
                break;
            case 'updateGameInfo':
                new UpdateGameInfoAction().response(data[1]);
                break;
            case 'actionPlayer':
                new ActionPlayerAction().response(data[1]);
                break;
            case 'updateCountdown':
                new UpdateCountdownAction().response(data[1]);
                break;
            case 'putCard':
                new PutCardAction().response(data[1]);
                break;
            case 'takeCard':
                new TakeCardAction().response(data[1]);
                break;
            case 'digCard':
                new MapActionAction().response([1, data[1]]);
                break;
            case 'collapseCard':
                new MapActionAction().response([2, data[1]]);
                break;
            case 'watchCard':
                new MapActionAction().response([3, data[1]]);
                break;
            case 'appointAction':
                new AppointActionAction().response(data[1]);
                break;
            case 'finishGame':
                new FinishGameAction().response(data[1]);
                break;
            case 'gameChat':
                new GameChatAction().response(data[1]);
                break;
            case 'forceDisconnected':
                new ForceConnectAction().action();
                break;
            case 'serverError':
                new MessageAction().action([MessageType.SYS_SERVER_ERROR, data[1]]);
                break;
        }
    }

    /**
     * 發送請求事件
     * @param {string} event
     * @param {object} data
     * @memberof Socket
     */
    onSendRequest(event, data) {
        this.socket.emit('request', JSON.stringify([event, data]));
    }

    /**
     * 客端關閉連線
     * @memberof Socket
     */
    onClose() {
        this.socket.close();
    }

    /**
     * Socket 單例
     * @static
     * @returns
     * @memberof Socket
     */
    static getInstance() {
        if (!this[SOCKET_INSTANCE]) {
            this[SOCKET_INSTANCE] = new Socket();
        }

        return this[SOCKET_INSTANCE];
    }
}