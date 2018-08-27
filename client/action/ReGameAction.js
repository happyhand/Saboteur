class ReGameAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof ReGameAction
     */
    action(data) {
        new LoadAction().action();
        Socket.getInstance().requestReGame();
    }

    /**
     * 回覆
     * @param {object} data
     * @memberof ReGameAction
     */
    response(data) {}
}