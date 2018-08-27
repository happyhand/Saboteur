class MessageType {
    /**
     * 無顯示訊息
     * @readonly
     * @static
     * @memberof MessageType
     */
    static get NONE() {
        return "NONE";
    }

    /**
     * 註冊失敗
     * @readonly
     * @static
     * @memberof MessageType
     */
    static get SYS_LOGIN_FAIL() {
        return "SYS_LOGIN_FAIL";
    }

    /**
     * 未輸入玩家暱稱
     * @readonly
     * @static
     * @memberof MessageType
     */
    static get SYS_MISS_PLAYER_NAME() {
        return "SYS_MISS_PLAYER_NAME";
    }

    /**
     * 未輸入房間名稱
     * @readonly
     * @static
     * @memberof MessageType
     */
    static get SYS_MISS_ROOM_NAME() {
        return "SYS_MISS_ROOM_NAME";
    }

    /**
     * 房間可創建個數已滿
     * @readonly
     * @static
     * @memberof MessageType
     */
    static get SYS_FULL_ROOM() {
        return "SYS_FULLROOM";
    }

    /**
     * 已有相同名稱的房間
     * @readonly
     * @static
     * @memberof MessageType
     */
    static get SYS_CREATE_REPEAT_ROOM() {
        return "SYS_CREATE_REPEAT_ROOM";
    }

    /**
     * 重複加入多個房間
     * @readonly
     * @static
     * @memberof MessageType
     */
    static get SYS_JOIN_MULTIPLE_ROOM() {
        return "SYS_JOIN_MULTIPLE_ROOM";
    }

    /**
     * 房間不存在
     * @readonly
     * @static
     * @memberof MessageType
     */
    static get SYS_ROOM_NOT_EXIST() {
        return "SYS_ROOM_NOT_EXIST";
    }

    /**
     * 房間人數已滿
     * @readonly
     * @static
     * @memberof MessageType
     */
    static get SYS_FULL_CLIENT_OF_ROOM() {
        return "SYS_FULL_CLIENT_OF_ROOM";
    }

    /**
     * 已加入相同房間
     * @readonly
     * @static
     * @memberof MessageType
     */
    static get SYS_CLIENT_ALREADY_JOIN() {
        return "SYS_CLIENT_ALREADY_JOIN";
    }

    /**
     * 遊戲進行中
     * @readonly
     * @static
     * @memberof MessageType
     */
    static get SYS_THE_GAME_IS_RUNNING() {
        return "SYS_THE_GAME_IS_RUNNING";
    }

    /**
     * 已被踢除房間
     * @readonly
     * @static
     * @memberof MessageType
     */
    static get SYS_LEAVE_ROOM_KICKED() {
        return "SYS_LEAVE_ROOM_KICKED";
    }

    /**
     * 尚有玩家未準備遊戲
     * @readonly
     * @static
     * @memberof MessageType
     */
    static get SYS_CREATE_GAME_ERROR_FOR_PLAYER_NOT_READY() {
        return "SYS_CREATE_GAME_ERROR_FOR_PLAYER_NOT_READY";
    }

    /**
     * 加入 Robot 失敗
     * @readonly
     * @static
     * @memberof MessageType
     */
    static get SYS_ADD_ROBOT_FAIL() {
        return "SYS_ADD_ROBOT_FAIL";
    }

    /**
     * 玩家未指定要丟出的牌
     * @readonly
     * @static
     * @memberof MessageType
     */
    static get SYS_NOT_APPOINT_PUT_CARD() {
        return "SYS_NOT_APPOINT_PUT_CARD";
    }

    /**
     * 遊戲已被關閉
     * @readonly
     * @static
     * @memberof MessageType
     */
    static get SYS_THE_GAME_HAS_BEEN_CLOSED() {
        return "SYS_THE_GAME_HAS_BEEN_CLOSED";
    }

    /**
     * 重新加入遊戲發生錯誤
     * @readonly
     * @static
     * @memberof MessageType
     */
    static get SYS_RE_GAME_ERROR() {
        return "SYS_RE_GAME_ERROR";
    }

    /**
     * 伺服器拒絕連線
     * @readonly
     * @static
     * @memberof MessageType
     */
    static get SYS_FORCE_DISCONNECTED() {
        return "SYS_FORCE_DISCONNECTED";
    }
}