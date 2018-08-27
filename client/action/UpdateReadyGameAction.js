class UpdateReadyGameAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof UpdateReadyGameAction
     */
    action(data) {
        Socket.getInstance().requestUpdateReadyGame(data);
    }

    /**
     * 回覆
     * @param {object} data
     * @memberof UpdateReadyGameAction
     */
    response(data) {}
}