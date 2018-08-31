class LeaveWatchGameAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof LeaveWatchGameAction
     */
    action(data) {
        new LoadAction().action();
        Socket.getInstance().requestLeaveWatchGame(PlayerData.getInstance().roomID);
    }

    /**
     * 回覆
     * @param {object} data
     * @memberof LeaveWatchGameAction
     */
    response(data) {}
}