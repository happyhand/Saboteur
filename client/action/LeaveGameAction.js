class LeaveGameAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof LeaveGameAction
     */
    action(data) {
        new LoadAction().action();
        Socket.getInstance().requestLeaveGame();
    }

    /**
     * 回覆
     * @param {object} data
     * @memberof LeaveGameAction
     */
    response(data) {}
}