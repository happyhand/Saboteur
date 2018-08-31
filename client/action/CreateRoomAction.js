class CreateRoomAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof CreateRoomAction
     */
    action(data) {
        new LoadAction().action();
        Socket.getInstance().requestCreateRoom(data);
    }

    /**
     * 回覆
     * @param {object} data
     * @memberof CreateRoomAction
     */
    response(data) {
        switch (data) {
            case -1:
                new MessageAction().action([MessageType.SYS_FULL_ROOM]);
                this.do(ActionType.CREATE_ROOM_ERROR);
                break;
            case -2:
                new MessageAction().action([MessageType.SYS_CREATE_REPEAT_ROOM]);
                this.do(ActionType.CREATE_ROOM_ERROR);
                break;
        }
    }
}