class LeaveRoomAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof LeaveRoomAction
     */
    action(data) {
        new LoadAction().action();
        Socket.getInstance().requestLeaveRoom(data);
    }

    /**
     * 回覆
     * @param {object} data
     * @memberof LeaveRoomAction
     */
    response(data) {
        switch (data) {
            case 2:
                new MessageAction().action(MessageType.SYS_LEAVE_ROOM_KICKED);
                break;
        }
    }
}