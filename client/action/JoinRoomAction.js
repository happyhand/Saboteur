class JoinRoomAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof JoinRoomAction
     */
    action(data) {
        new LoadAction().action();
        Socket.getInstance().requestJoinRoom(data);
    }

    /**
     * 回覆
     * @param {object} data
     * @memberof JoinRoomAction
     */
    response(data) {
        let result = data[0];
        let roomID = data[1];
        switch (result) {
            case -1:
                new MessageAction().action([MessageType.SYS_JOIN_MULTIPLE_ROOM]);
                break;
            case -2:
                new MessageAction().action([MessageType.SYS_ROOM_NOT_EXIST]);
                break;
            case -3:
                new MessageAction().action([MessageType.SYS_FULL_CLIENT_OF_ROOM]);
                break;
            case -4:
                new MessageAction().action([MessageType.SYS_CLIENT_ALREADY_JOIN]);
                break;
            case -5:
                new MessageAction().action([MessageType.SYS_THE_GAME_IS_RUNNING, roomID]);
                break;
            case -6:
                new MessageAction().action([MessageType.SYS_RE_GAME_ERROR]);
                break;
        }

        if (result === 1) {
            PlayerData.getInstance().roomID = roomID;
            this.do(ActionType.JOIN_ROOM);
        } else {
            this.do(ActionType.JOIN_ROOM_ERROR);
        }
    }
}