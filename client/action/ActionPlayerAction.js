class ActionPlayerAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof ActionPlayerAction
     */
    action(data) {
    }

    /**
     * 回覆
     * @param {object} data
     * @memberof ActionPlayerAction
     */
    response(data) {
        this.do(ActionType.ACTION_PLAYER, data);
    }
}