class UpdateCountdownAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof UpdateCountdownAction
     */
    action(data) {
    }

    /**
     * 回覆
     * @param {object} data
     * @memberof UpdateCountdownAction
     */
    response(data) {
        this.do(ActionType.UPDATE_COUNTDOWN, data);
    }
}