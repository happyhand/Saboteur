const LOBBY_INSTANCE = Symbol('instance');
class Lobby {
    constructor() {
        let Class = new.target; // or this.constructor
        if (!Class[LOBBY_INSTANCE]) {
            Class[LOBBY_INSTANCE] = this;
            this.server = null;
            this.logins = [];
            this.rooms = {};
        }
        return Class[LOBBY_INSTANCE];
    }

    //#region Lobby 動作
    /**
     * 客端 Login
     * @param {Client} client 
     * @param {string} loginName 
     * @memberof Lobby
     */
    onLogin(client, loginName) {
        if (this.logins.indexOf(loginName) !== -1) {
            client.onLoginError(-1);
            return;
        }

        this.logins.push(loginName);
        client.onLogin(loginName);
    }

    /**
     * 客端 Logut
     * @param {string} nickname 
     * @memberof Lobby
     */
    onLogout(nickname) {
        let index = this.logins.indexOf(nickname);
        if (index !== -1) {
            this.logins.splice(index, 1);
        }
    }

    /**
     * 客端加入 Lobby
     * @param {Client} client 
     * @memberof Lobby
     */
    onJoinLobby(client) {
        let roomList = this.getRoomList();
        client.onJoinLobby(roomList);
    }

    /**
     * 客端創建 Room
     * @param {Client} client 
     * @param {string} roomName 
     * @param {int} countdown 
     * @param {string} creatorName 
     * @memberof Lobby
     */
    onCreateRoom(client, roomName, countdown, creatorName) {
        if (Object.keys(this.rooms).length >= 10) {
            client.onCreateRoomError(-1);
            return;
        }

        for (let roomID in this.rooms) {
            let room = this.rooms[roomID];
            if (room.roomName === roomName) {
                client.onCreateRoomError(-2);
                return;
            }
        }

        let service = require('./core/Service.js');
        let roomClass = require('./room/Room.js');
        let newRoomID = service.getRandomID();
        let newRoom = new roomClass(this.server, this, newRoomID, roomName, countdown, creatorName);
        this.rooms[newRoomID] = newRoom;
        client.onCreateRoom(newRoomID);
    }

    /**
     * 撤銷房間
     * @param {string}} roomID 
     * @memberof Lobby
     */
    onDeleteRoom(roomID) {
        delete this.rooms[roomID];
        this.onBroadcastCurrentRoomList();
    }
    //#endregion

    //#region 廣播事件
    /**
     * 廣播 Lobby 房間列表更新
     * @memberof Lobby
     */
    onBroadcastCurrentRoomList() {
        let roomList = this.getRoomList();
        this.server.to('lobby').emit('response', JSON.stringify(['updateRoomList', roomList]));
    }
    //#endregion

    //#region Set & Get
    /**
     * 設定 Socket IO
     * @param {Socker.IO} server 
     * @memberof Lobby
     */
    setServer(server) {
        this.server = server;
    }

    /**
     * 取得房間列表
     * @returns array
     * @memberof Lobby
     */
    getRoomList() {
        let list = [];
        for (let roomID in this.rooms) {
            let room = this.rooms[roomID];
            list.push(room.getRoomInfo());
        }

        return list;
    }

    /**
     * 取得房間
     * @param {string} roomID 
     * @memberof Lobby
     */
    getRoom(roomID) {
        return this.rooms[roomID];
    }
    //#endregion































    // getRoom(key) {
    //     return this.rooms[key];
    // }

    // onCreateRoom(roomName, creatorName) {
    //     if (Object.keys(this.rooms).length >= 8) {
    //         return [-1, ''];
    //     }

    //     for (let roomID in this.rooms) {
    //         let room = this.rooms[roomID];
    //         if (room.roomName === roomName) {
    //             return [-2, ''];
    //         }
    //     }

    //     let service = require('./core/Service.js');
    //     let roomClass = require('./room/Room.js');
    //     let newRoomID = service.getRandomID();
    //     let newRoom = new roomClass(newRoomID, roomName, creatorName);
    //     this.rooms[newRoomID] = newRoom;
    //     return [1, newRoomID];
    // }

    // onDeleteRoom(roomID) {
    //     delete this.rooms[roomID];
    // }

    // isRoomExist(roomID) {
    //     let room = this.rooms[roomID];
    //     return room !== undefined && room !== null
    // }

    static getInstance() {
        if (!this[LOBBY_INSTANCE]) {
            this[LOBBY_INSTANCE] = new Lobby();
        }

        return this[LOBBY_INSTANCE];
    }
}

module.exports = Lobby;