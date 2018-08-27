class UpdateRoomListAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof UpdateRoomListAction
     */
    action(data) {}

    /**
     * 回覆
     * @param {object} data
     * @memberof UpdateRoomListAction
     */
    response(data) {
        this.do(ActionType.UPDATE_ROOM_LIST, data);
    }
}