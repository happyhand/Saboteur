class MessageAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof MessageAction
     */
    action(data) {
        this.do(ActionType.SYSTEM_MESSAGE, data);
    }

    /**
     * 回覆
     * @param {object} data
     * @memberof MessageAction
     */
    response(data) {}
}