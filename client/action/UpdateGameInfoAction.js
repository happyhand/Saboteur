class UpdateGameInfoAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof UpdateGameInfoAction
     */
    action(data) {}

    /**
     * 回覆
     * @param {object} data
     * @memberof UpdateGameInfoAction
     */
    response(data) {
        this.do(ActionType.UPDATE_GAME_INFO, data);
    }
}