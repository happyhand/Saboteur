class RoomChatAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof RoomChatAction
     */
    action(data) {
        Socket.getInstance().requestRoomChat(data);
    }

    /**
     * 回覆
     * @param {object} data
     * @memberof RoomChatAction
     */
    response(data) {
        this.do(ActionType.ROOM_CHAT, data);
    }
}