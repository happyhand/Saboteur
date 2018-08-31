class JoinWatchGameAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof JoinWatchGameAction
     */
    action(data) {
        Socket.getInstance().requestJoinWatchGame(data);
    }

    /**
     * 回覆
     * @param {object} data
     * @memberof JoinWatchGameAction
     */
    response(data) {
        let result = data[0];
        let roomID = data[1];
        switch (result) {
            case 1:
                new LoadAction().action();
                PlayerData.getInstance().roomID = roomID;
                this.do(ActionType.JOIN_WATCH_GAME, [data[2], data[3]]);
                break;
            case -1:
                new MessageAction().action([MessageType.SYS_GAME_NOT_EXIST]);
                break;
            case -2:
                new MessageAction().action([MessageType.SYS_CLIENT_ALREADY_WATCH]);
                break;
        }
    }
}