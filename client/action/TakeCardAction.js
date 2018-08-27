class TakeCardAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof TakeCardAction
     */
    action(data) {}

    /**
     * 回覆
     * @param {object} data
     * @memberof TakeCardAction
     */
    response(data) {
        this.do(ActionType.TAKE_CARD, data);
    }
}