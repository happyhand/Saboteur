class ActionType {
    /**
     * 系統訊息
     * @readonly
     * @static
     * @memberof ActionType
     */
    static get SYSTEM_MESSAGE() {
        return "SYSTEM_MESSAGE";
    }

    /**
     * 轉場 Load
     * @readonly
     * @static
     * @memberof ActionType
     */
    static get LOADING() {
        return "LOADING";
    }


    /**
     * 遊戲初始化
     * @readonly
     * @static
     * @memberof ActionType
     */
    static get GAME_INIT() {
        return "GAME_INIT";
    }

    /**
     * 客端 Login Error
     * @readonly
     * @static
     * @memberof ActionType
     */
    static get LOGIN_ERROR() {
        return "LOGIN_ERROR";
    }

    /**
     * 客端加入 Lobby
     * @readonly
     * @static
     * @memberof ActionType
     */
    static get JOIN_LOBBY() {
        return "JOIN_LOBBY";
    }

    /**
     * 客端創建房間 Error
     * @readonly
     * @static
     * @memberof ActionType
     */
    static get CREATE_ROOM_ERROR() {
        return "CREATE_ROOM_ERROR";
    }

    /**
     * 客端加入房間
     * @readonly
     * @static
     * @memberof ActionType
     */
    static get JOIN_ROOM() {
        return "JOIN_ROOM";
    }

    /**
     * 客端加入房間 Error
     * @readonly
     * @static
     * @memberof ActionType
     */
    static get JOIN_ROOM_ERROR() {
        return "JOIN_ROOM_ERROR";
    }

    /**
     * 更新房間列表
     * @readonly
     * @static
     * @memberof ActionType
     */
    static get UPDATE_ROOM_LIST() {
        return "UPDATE_ROOM_LIST";
    }

    /**
     * 更新房間資訊
     * @readonly
     * @static
     * @memberof ActionType
     */
    static get UPDATE_ROOM_INFO() {
        return "UPDATE_ROOM_INFO";
    }

    /**
     * 房間聊天訊息
     * @readonly
     * @static
     * @memberof ActionType
     */
    static get ROOM_CHAT() {
        return "ROOM_CHAT";
    }

    /**
     * 客端創建遊戲
     * @readonly
     * @static
     * @memberof ActionType
     */
    static get CREATE_GAME() {
        return "CREATE_GAME";
    }

    /**
     * 客端創建遊戲 Error
     * @readonly
     * @static
     * @memberof ActionType
     */
    static get CREATE_GAME_ERROR() {
        return "CREATE_GAME_ERROR";
    }

    /**
     * 客端加入遊戲
     * @readonly
     * @static
     * @memberof ActionType
     */
    static get JOIN_GAME() {
        return "JOIN_GAME";
    }

    /**
     * 更新遊戲資訊
     * @readonly
     * @static
     * @memberof ActionType
     */
    static get UPDATE_GAME_INFO() {
        return "UPDATE_GAME_INFO";
    }

    /**
     * 執行遊戲動作者
     * @readonly
     * @static
     * @memberof ActionType
     */
    static get ACTION_PLAYER() {
        return "ACTION_PLAYER";
    }

    /**
     * 執行遊戲動作時間
     * @readonly
     * @static
     * @memberof ActionType
     */
    static get UPDATE_COUNTDOWN() {
        return "UPDATE_COUNTDOWN";
    }

    /**
     * 客端丟牌
     * @readonly
     * @static
     * @memberof ActionType
     */
    static get PUT_CARD() {
        return "PUT_CARD";
    }

    /**
     * 客端補牌
     * @readonly
     * @static
     * @memberof ActionType
     */
    static get TAKE_CARD() {
        return "TAKE_CARD";
    }

    /**
     * 客端顯示挖掘動畫
     * @readonly
     * @static
     * @memberof ActionType
     */
    static get DIG_ANIMS() {
        return "DIG_ANIMS";
    }

    /**
     * 客端顯示崩塌動畫
     * @readonly
     * @static
     * @memberof ActionType
     */
    static get COLLAPSE_ANIMS() {
        return "COLLAPSE_ANIMS";
    }

    /**
     * 客端查看卡牌
     * @readonly
     * @static
     * @memberof ActionType
     */
    static get WATCH_CARD() {
        return "WATCH_CARD";
    }

    /**
     * 客端指定動作動畫
     * @readonly
     * @static
     * @memberof ActionType
     */
    static get ACTION_ANIMS() {
        return "ACTION_ANIMS";
    }

    /**
     * 遊戲結束
     * @readonly
     * @static
     * @memberof ActionType
     */
    static get GAME_OVER() {
        return "GAME_OVER";
    }

    /**
     * 遊戲聊天訊息
     * @readonly
     * @static
     * @memberof ActionType
     */
    static get GAME_CHAT() {
        return "GAME_CHAT";
    }

    /**
     * 客端加入觀看遊戲
     * @readonly
     * @static
     * @memberof ActionType
     */
    static get JOIN_WATCH_GAME() {
        return "JOIN_WATCH_GAME";
    }
}