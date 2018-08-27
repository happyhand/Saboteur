class LoadAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof LoadAction
     */
    action(data) {
        this.do(ActionType.LOADING);
    }

    /**
     * 回覆
     * @param {object} data
     * @memberof LoadAction
     */
    response(data) {}
}