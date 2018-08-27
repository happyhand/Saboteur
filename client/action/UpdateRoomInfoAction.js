class UpdateRoomInfoAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof UpdateRoomInfoAction
     */
    action(data) {}

    /**
     * 回覆
     * @param {object} data
     * @memberof UpdateRoomInfoAction
     */
    response(data) {
        this.do(ActionType.UPDATE_ROOM_INFO, data);
    }
}